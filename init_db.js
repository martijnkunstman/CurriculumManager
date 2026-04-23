const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'database.sqlite');
const SQL_FILE_PATH = path.join(__dirname, 'sql', 'curriculum_manager.sql');

if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
    process.exit(1);
  }
});

const sql = fs.readFileSync(SQL_FILE_PATH, 'utf8');

db.exec(sql, (err) => {
  if (err) {
    console.error('Error initializing database:', err.message);
    process.exit(1);
  }
  console.log('Database initialized successfully from curriculum_manager.sql');
  db.close();
});
