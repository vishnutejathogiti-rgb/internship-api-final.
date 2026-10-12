CREATE TABLE IF NOT EXISTS internships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL CHECK(length(trim(title)) BETWEEN 3 AND 120),
  company TEXT NOT NULL CHECK(length(trim(company)) BETWEEN 2 AND 120),
  location TEXT NOT NULL CHECK(length(trim(location)) BETWEEN 2 AND 120),
  mode TEXT NOT NULL CHECK(mode IN ('Remote', 'Hybrid', 'On-site')),
  description TEXT NOT NULL CHECK(length(trim(description)) BETWEEN 10 AND 2000),
  application_url TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
