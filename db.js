const path = require("node:path");
const fs = require("node:fs");
const Database = require("better-sqlite3");

const dataDir = process.env.DATA_DIR || __dirname;
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "internships.sqlite"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));

module.exports = { db };
