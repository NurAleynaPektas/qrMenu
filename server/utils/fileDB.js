const fs = require("fs").promises;

async function readJson(fullPath) {
  const data = await fs.readFile(fullPath, "utf-8");
  return JSON.parse(data || "[]");
}

async function writeJson(fullPath, jsonData) {
  await fs.writeFile(fullPath, JSON.stringify(jsonData, null, 2));
}

module.exports = { readJson, writeJson };
