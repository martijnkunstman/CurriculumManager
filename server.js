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
setupCrudRoutes('ka_cohorten');
setupCrudRoutes('ka_leereenheden');
setupCrudRoutes('ka_cohort_leereenheden');

// Special endpoint for year visualizer
app.get('/api/year-view/:schooljaar_id', (req, res) => {
    const sql = `
        SELECT 
            w.id AS week_id,
            w.volgnummer_schooljaar,
            w.kalenderweek,
            w.startdatum,
            w.einddatum,
            p.naam AS periode_naam,
            p.volgnummer AS periode_volgnummer,
            wt.is_lesweek,
            wt.omschrijving AS week_type
        FROM ka_weken w
        LEFT JOIN ka_periodes p ON w.periode_id = p.id
        LEFT JOIN ka_week_types wt ON w.type_id = wt.id
        WHERE w.schooljaar_id = ?
        ORDER BY w.startdatum ASC
    `;
    db.all(sql, [req.params.schooljaar_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

// Special endpoint for cohort-leereenheden connections
app.get('/api/cohort-connections/:cohort_id', (req, res) => {
    const sql = `
        SELECT l.*, 
            CASE WHEN cl.id IS NOT NULL THEN 1 ELSE 0 END as is_connected
        FROM ka_leereenheden l
        LEFT JOIN ka_cohort_leereenheden cl 
            ON l.id = cl.leereenheid_id AND cl.cohort_id = ?
    `;
    db.all(sql, [req.params.cohort_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.post('/api/cohort-connections/:cohort_id/toggle', (req, res) => {
    const { leereenheid_id, is_connected } = req.body;
    const cohort_id = req.params.cohort_id;
    
    if (is_connected) {
        const sql = `INSERT INTO ka_cohort_leereenheden (cohort_id, leereenheid_id) VALUES (?, ?)`;
        db.run(sql, [cohort_id, leereenheid_id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Connected' });
        });
    } else {
        const sql = `DELETE FROM ka_cohort_leereenheden WHERE cohort_id = ? AND leereenheid_id = ?`;
        db.run(sql, [cohort_id, leereenheid_id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Disconnected' });
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
