const fs = require("node:fs");
const path = require("node:path");
const { db } = require("./db");

const records = JSON.parse(fs.readFileSync(path.join(__dirname, "seed-data.json"), "utf8"));
const insert = db.prepare(`
  INSERT INTO internships (title, company, location, mode, description, application_url, is_active)
  VALUES (@title, @company, @location, @mode, @description, @application_url, @is_active)
`);
const seed = db.transaction((items) => {
  for (const item of items) {
    const exists = db.prepare("SELECT id FROM internships WHERE title=? AND company=?").get(item.title, item.company);
    if (!exists) insert.run(item);
  }
});
seed(records);
console.log(`Seeded ${records.length} sample records (existing matching records were skipped).`);
db.close();
