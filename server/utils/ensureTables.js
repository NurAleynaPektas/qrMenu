const fs = require("fs").promises;
const path = require("path");

async function ensureTablesFile() {
  const fullPath = path.join(__dirname, "..", "data", "tables.json");

  try {
    await fs.access(fullPath);
    return;
  } catch {
  }

  const tables = Array.from({ length: 20 }, (_, i) => ({
    table: i + 1,
    status: "FREE",
    activeOrderId: null,
    updatedAt: null,
  }));

  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, JSON.stringify(tables, null, 2), "utf-8");
}

module.exports = { ensureTablesFile };
