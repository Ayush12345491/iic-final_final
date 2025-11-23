const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let db;

async function initDb() {
    if (db) return db;

    const dbPath = path.join(__dirname, 'revision_app.db');

    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            original_text TEXT,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('Database initialized at', dbPath);
    return db;
}

async function saveResult(type, originalText, content) {
    const db = await initDb();
    const result = await db.run(
        'INSERT INTO history (type, original_text, content) VALUES (?, ?, ?)',
        [type, originalText, content]
    );
    return { id: result.lastID, type, originalText, content };
}

async function getHistory() {
    const db = await initDb();
    return await db.all('SELECT * FROM history ORDER BY created_at DESC');
}

async function deleteResult(id) {
    const db = await initDb();
    await db.run('DELETE FROM history WHERE id = ?', [id]);
}

module.exports = {
    initDb,
    saveResult,
    getHistory,
    deleteResult
};
