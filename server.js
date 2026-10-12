const express = require("express");
const { db } = require("./db");
const { validateInternship } = require("./validation");

const app = express();
app.use(express.json({ limit: "100kb" }));

function error(res, status, message, details) {
  return res.status(status).json({
    success: false,
    error: { message, ...(details ? { details } : {}) }
  });
}

app.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

app.get("/api/internships", (req, res) => {
  const page = Number.parseInt(req.query.page ?? "1", 10);
  const limit = Number.parseInt(req.query.limit ?? "10", 10);
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
    return error(res, 400, "page must be >= 1 and limit must be between 1 and 100");
  }
  const total = db.prepare("SELECT COUNT(*) AS count FROM internships").get().count;
  const rows = db.prepare(
    "SELECT * FROM internships ORDER BY id LIMIT ? OFFSET ?"
  ).all(limit, (page - 1) * limit);
  res.json({
    success: true,
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
});

app.get("/api/internships/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id < 1) return error(res, 400, "id must be a positive integer");
  const row = db.prepare("SELECT * FROM internships WHERE id = ?").get(id);
  if (!row) return error(res, 404, "Internship not found");
  res.json({ success: true, data: row });
});

app.post("/api/internships", (req, res) => {
  const result = validateInternship(req.body);
  if (!result.valid) return error(res, 400, "Validation failed", result.errors);
  const { title, company, location, mode, description, application_url, is_active } = result.value;
  const info = db.prepare(`
    INSERT INTO internships (title, company, location, mode, description, application_url, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(title, company, location, mode, description, application_url, is_active);
  const row = db.prepare("SELECT * FROM internships WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json({ success: true, data: row });
});

app.put("/api/internships/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id < 1) return error(res, 400, "id must be a positive integer");
  if (!db.prepare("SELECT id FROM internships WHERE id = ?").get(id)) {
    return error(res, 404, "Internship not found");
  }
  const result = validateInternship(req.body);
  if (!result.valid) return error(res, 400, "Validation failed", result.errors);
  const { title, company, location, mode, description, application_url, is_active } = result.value;
  db.prepare(`
    UPDATE internships SET title=?, company=?, location=?, mode=?, description=?,
      application_url=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?
  `).run(title, company, location, mode, description, application_url, is_active, id);
  res.json({ success: true, data: db.prepare("SELECT * FROM internships WHERE id = ?").get(id) });
});

app.delete("/api/internships/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id < 1) return error(res, 400, "id must be a positive integer");
  const info = db.prepare("DELETE FROM internships WHERE id = ?").run(id);
  if (!info.changes) return error(res, 404, "Internship not found");
  res.status(200).json({ success: true, data: { id, deleted: true } });
});

app.use((req, res) => error(res, 404, `Route not found: ${req.method} ${req.path}`));
app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && "body" in err) return error(res, 400, "Invalid JSON body");
  console.error(err);
  return error(res, 500, "Internal server error");
});

const port = Number(process.env.PORT) || 3000;
if (require.main === module) {
  app.listen(port, "0.0.0.0", () => console.log(`Internship API listening on port ${port}`));
}
module.exports = app;
