const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'repair.db'));

db.exec(`
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Новая',
    FOREIGN KEY (client_id) REFERENCES clients(id)
);
`);
db.exec(`
CREATE TABLE IF NOT EXISTS statuses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);
`);

db.exec(`
INSERT INTO statuses (name)
SELECT 'Новая'
WHERE NOT EXISTS (
    SELECT 1 FROM statuses WHERE name = 'Новая'
);

INSERT INTO statuses (name)
SELECT 'В ремонте'
WHERE NOT EXISTS (
    SELECT 1 FROM statuses WHERE name = 'В ремонте'
);

INSERT INTO statuses (name)
SELECT 'Готова'
WHERE NOT EXISTS (
    SELECT 1 FROM statuses WHERE name = 'Готова'
);
`);
module.exports = db;