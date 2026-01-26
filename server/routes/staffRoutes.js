const express = require("express");
const admin = require("../firebaseAdmin");
const Staff = require("../models/Staff");

const router = express.Router();

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!token || !token.startsWith("jwt-admin-")) {
    return res.status(401).json({ message: "Unauthorized (admin only)" });
  }
  next();
}

// CREATE STAFF (Admin only) - Firebase Auth + MongoDB
router.post("/create", requireAdmin, async (req, res) => {
  let createdUid = null;

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const displayName = String(name).trim();
    const pass = String(password);

    if (pass.length < 4) {
      return res.status(400).json({ message: "Password too short (min 4)" });
    }

    // 1) Mongo'da email var mı?
    const existing = await Staff.findOne({ email: normalizedEmail }).lean();
    if (existing) {
      return res
        .status(409)
        .json({ message: "This email is already registered." });
    }

    // 2) Firebase Auth user oluştur
    const userRecord = await admin.auth().createUser({
      email: normalizedEmail,
      password: pass,
      displayName,
    });

    createdUid = userRecord.uid;

    // 3) Role claim (Firestore gerektirmez)
   
    await admin.auth().setCustomUserClaims(createdUid, { role: "staff" });

    // 4) MongoDB’ye kaydet
    await Staff.create({
      uid: createdUid,
      name: displayName,
      email: normalizedEmail,
      role: "staff",
      active: true,
    });

    return res.status(201).json({
      uid: createdUid,
      message: "Staff created",
    });
  } catch (err) {
    if (createdUid) {
      try {
        await admin.auth().deleteUser(createdUid);
      } catch {}
    }

    const msg = err?.message || "Create failed";
    return res.status(500).json({ message: msg });
  }
});

// LIST STAFF (Admin only) - MongoDB
router.get("/", requireAdmin, async (req, res) => {
  try {
    const list = await Staff.find({})
      .sort({ createdAt: -1 })
      .select({
        _id: 0,
        uid: 1,
        name: 1,
        email: 1,
        role: 1,
        active: 1,
        createdAt: 1,
      })
      .lean();

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err?.message || "List failed" });
  }
});

// DELETE STAFF (Admin only) - Firebase Auth + MongoDB
router.delete("/:uid", requireAdmin, async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid) return res.status(400).json({ message: "Missing uid" });

    // 1) Mongo kaydını bul
    const staff = await Staff.findOne({ uid }).lean();
    if (!staff) {
      try {
        await admin.auth().deleteUser(uid);
      } catch {}
      return res.status(404).json({ message: "Staff not found" });
    }

    // 2) Firebase user sil
    await admin.auth().deleteUser(uid);

    // 3) Mongo kaydı sil
    await Staff.deleteOne({ uid });

    res.json({ message: "Staff deleted" });
  } catch (err) {
    res.status(500).json({ message: err?.message || "Delete failed" });
  }
});

module.exports = router;
