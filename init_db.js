const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'database.sqlite');
const SQL_FILE_PATH = path.join(__dirname, 'sql', 'curriculum_manager.sql');

// Remove existing db if you want a fresh start
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
    process.exit(1);
  }
});

const schema = `
CREATE TABLE ka_schooljaren (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  naam TEXT NOT NULL UNIQUE,
  startdatum TEXT NOT NULL,
  einddatum TEXT NOT NULL
);

CREATE TABLE ka_periodes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  schooljaar_id INTEGER NOT NULL,
  volgnummer INTEGER NOT NULL,
  naam TEXT NOT NULL,
  UNIQUE(schooljaar_id, volgnummer)
);

CREATE TABLE ka_week_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  is_lesweek INTEGER NOT NULL DEFAULT 0,
  omschrijving TEXT NOT NULL UNIQUE
);

CREATE TABLE ka_weken (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  schooljaar_id INTEGER NOT NULL,
  periode_id INTEGER DEFAULT NULL,
  volgnummer_schooljaar INTEGER NOT NULL,
  kalenderweek INTEGER NOT NULL,
  startdatum TEXT NOT NULL,
  einddatum TEXT NOT NULL,
  type_id INTEGER NOT NULL
);

CREATE TABLE cohorten (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  naam TEXT NOT NULL UNIQUE
);

CREATE TABLE leereenheid_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  naam TEXT NOT NULL UNIQUE
);

CREATE TABLE leereenheden (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  naam TEXT NOT NULL UNIQUE,
  type TEXT
);

CREATE TABLE cohort_leereenheden (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cohort_id INTEGER NOT NULL,
  leereenheid_id INTEGER NOT NULL,
  UNIQUE(cohort_id, leereenheid_id)
);

CREATE TABLE cohort_schooljaren (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cohort_id INTEGER NOT NULL,
  schooljaar_id INTEGER NOT NULL
);

CREATE TABLE cohort_leereenheid_planning (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cohort_id INTEGER NOT NULL,
  leereenheid_id INTEGER NOT NULL,
  start_week_id INTEGER NOT NULL,
  eind_week_id INTEGER NOT NULL
);
`;

function initializeDatabase() {
  console.log('Reading SQL file...');
  const sqlContent = fs.readFileSync(SQL_FILE_PATH, 'utf8');

  // Extract INSERT statements for the ka_ tables
  const tablesToExtract = ['ka_schooljaren', 'ka_periodes', 'ka_week_types', 'ka_weken', 'leereenheid_types', 'cohorten', 'leereenheden', 'cohort_leereenheden', 'cohort_schooljaren'];
  const inserts = [];

  tablesToExtract.forEach(table => {
    const regex = new RegExp(`INSERT INTO \`${table}\`.*?VALUES?[\\s\\S]*?(?=;|INSERT|--|CREATE)`, 'gi');
    let match;
    while ((match = regex.exec(sqlContent)) !== null) {
      inserts.push(match[0].trim() + ';');
    }
  });

  db.serialize(() => {
    console.log('Creating schema...');
    db.exec(schema, (err) => {
      if (err) {
        console.error('Error creating schema:', err.message);
        return;
      }
      console.log('Schema created.');

      console.log('Running INSERTS...');
      let hasErrors = false;
      db.run('BEGIN TRANSACTION');
      inserts.forEach(insertSql => {
        db.exec(insertSql, (err) => {
          if (err && !hasErrors) {
            hasErrors = true;
            console.error('Error executing insert:', err.message);
            console.log('Failed query was:', insertSql.substring(0, 500) + '...');
          }
        });
      });

      db.run('COMMIT', (err) => {
        if (err) console.error('Error committing transaction', err);
        else console.log('Database initialized successfully with ka_ data.');
      });
    });
  });
}

initializeDatabase();
