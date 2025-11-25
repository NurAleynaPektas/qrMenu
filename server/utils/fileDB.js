const fs = require("fs").promises;
const path = require("path");

async function readJson(file) {
  const fullPath = path.join(__dirname, "..", file);
  const data = await fs.readFile(fullPath, "utf-8");
  return JSON.parse(data || "[]");
}

async function writeJson(file, jsonData) {
  const fullPath = path.join(__dirname, "..", file);
  await fs.writeFile(fullPath, JSON.stringify(jsonData, null, 2));
}

module.exports = { readJson, writeJson };
