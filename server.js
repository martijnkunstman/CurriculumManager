const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'database.sqlite');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error connecting to SQLite config:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Generic helper function to handle API generation for tables
const setupCrudRoutes = (tableName) => {
    // GET all
    app.get(`/api/${tableName}`, (req, res) => {
        db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ data: rows });
        });
    });

    // POST (Create)
    app.post(`/api/${tableName}`, (req, res) => {
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        const placeholders = keys.map(() => '?').join(',');
        
        const sql = `INSERT INTO ${tableName} (${keys.join(',')}) VALUES (${placeholders})`;
        
        db.run(sql, values, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ data: { id: this.lastID, ...req.body } });
        });
    });

    // PUT (Update)
    app.put(`/api/${tableName}/:id`, (req, res) => {
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        const updates = keys.map(k => `${k} = ?`).join(', ');
        
        const sql = `UPDATE ${tableName} SET ${updates} WHERE id = ?`;
        
        db.run(sql, [...values, req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        });
    });

    // DELETE (Delete)
    app.delete(`/api/${tableName}/:id`, (req, res) => {
        db.run(`DELETE FROM ${tableName} WHERE id = ?`, req.params.id, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ deleted: this.changes });
        });
    });
};

setupCrudRoutes('ka_schooljaren');
setupCrudRoutes('ka_periodes');
setupCrudRoutes('ka_week_types');
setupCrudRoutes('ka_weken');

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
