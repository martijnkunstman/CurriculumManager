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
setupCrudRoutes('leereenheid_types');
setupCrudRoutes('cohorten');
setupCrudRoutes('leereenheden');
setupCrudRoutes('cohort_leereenheden');
setupCrudRoutes('cohort_schooljaren');

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
        FROM leereenheden l
        LEFT JOIN cohort_leereenheden cl 
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
        const sql = `INSERT INTO cohort_leereenheden (cohort_id, leereenheid_id) VALUES (?, ?)`;
        db.run(sql, [cohort_id, leereenheid_id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Connected' });
        });
    } else {
        const sql = `DELETE FROM cohort_leereenheden WHERE cohort_id = ? AND leereenheid_id = ?`;
        db.run(sql, [cohort_id, leereenheid_id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Disconnected' });
        });
    }
});

app.get('/api/cohort-schooljaren/:cohort_id', (req, res) => {
    const sql = `
        SELECT cs.id, s.id as schooljaar_id, s.naam
        FROM cohort_schooljaren cs
        JOIN ka_schooljaren s ON cs.schooljaar_id = s.id
        WHERE cs.cohort_id = ?
        ORDER BY cs.id ASC
    `;
    db.all(sql, [req.params.cohort_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.post('/api/cohort-schooljaren/:cohort_id', (req, res) => {
    const { schooljaar_id } = req.body;
    const sql = `INSERT INTO cohort_schooljaren (cohort_id, schooljaar_id) VALUES (?, ?)`;
    db.run(sql, [req.params.cohort_id, schooljaar_id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: { id: this.lastID, schooljaar_id } });
    });
});

app.delete('/api/cohort-schooljaren/:id', (req, res) => {
    db.run(`DELETE FROM cohort_schooljaren WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});


// Cohort planning endpoints
app.get('/api/cohort-planning/:cohort_id', (req, res) => {
    const sql = `
        SELECT clp.id, clp.leereenheid_id, l.naam AS leereenheid_naam, l.type AS leereenheid_type,
               clp.start_week_id, clp.eind_week_id,
               sw.volgnummer_schooljaar AS start_volgnummer,
               ew.volgnummer_schooljaar AS eind_volgnummer,
               sw.schooljaar_id AS schooljaar_id
        FROM cohort_leereenheid_planning clp
        JOIN leereenheden l ON clp.leereenheid_id = l.id
        JOIN ka_weken sw ON clp.start_week_id = sw.id
        JOIN ka_weken ew ON clp.eind_week_id = ew.id
        WHERE clp.cohort_id = ?
        ORDER BY sw.startdatum ASC
    `;
    db.all(sql, [req.params.cohort_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.get('/api/cohort-weeks/:cohort_id', (req, res) => {
    const sql = `
        SELECT w.id, w.schooljaar_id, s.naam AS schooljaar_naam,
               w.volgnummer_schooljaar, w.kalenderweek, w.startdatum, w.einddatum,
               p.naam AS periode_naam, wt.is_lesweek, wt.omschrijving AS week_type
        FROM cohort_schooljaren cs
        JOIN ka_weken w ON w.schooljaar_id = cs.schooljaar_id
        JOIN ka_schooljaren s ON s.id = w.schooljaar_id
        LEFT JOIN ka_periodes p ON w.periode_id = p.id
        JOIN ka_week_types wt ON w.type_id = wt.id
        WHERE cs.cohort_id = ?
        ORDER BY w.startdatum ASC
    `;
    db.all(sql, [req.params.cohort_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.post('/api/cohort-planning', (req, res) => {
    const { cohort_id, leereenheid_id, start_week_id, eind_week_id } = req.body;
    const sql = `INSERT INTO cohort_leereenheid_planning (cohort_id, leereenheid_id, start_week_id, eind_week_id) VALUES (?, ?, ?, ?)`;
    db.run(sql, [cohort_id, leereenheid_id, start_week_id, eind_week_id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: { id: this.lastID, cohort_id, leereenheid_id, start_week_id, eind_week_id } });
    });
});

app.delete('/api/cohort-planning/:id', (req, res) => {
    db.run(`DELETE FROM cohort_leereenheid_planning WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

app.put('/api/cohort-planning/:id', (req, res) => {
    const { start_week_id, eind_week_id } = req.body;
    db.run(
        `UPDATE cohort_leereenheid_planning SET start_week_id = ?, eind_week_id = ? WHERE id = ?`,
        [start_week_id, eind_week_id, req.params.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        }
    );
});

// Full database SQL export
app.get('/api/export-sql', (req, res) => {
    const tables = [
        'ka_week_types', 'ka_schooljaren', 'ka_periodes', 'ka_weken',
        'leereenheid_types', 'leereenheden', 'cohorten',
        'cohort_leereenheden', 'cohort_schooljaren', 'cohort_leereenheid_planning'
    ];

    function sqlVal(v) {
        if (v === null || v === undefined) return 'NULL';
        if (typeof v === 'number') return v;
        return `'${String(v).replace(/'/g, "''")}'`;
    }

    const promises = tables.map(table =>
        new Promise((resolve, reject) => {
            db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
                if (err) reject(err);
                else resolve({ table, rows });
            });
        })
    );

    Promise.all(promises).then(results => {
        let sql = `-- Database Export\n-- Generated: ${new Date().toISOString()}\n\n`;
        results.forEach(({ table, rows }) => {
            if (!rows.length) return;
            const cols = Object.keys(rows[0]);
            const colList = cols.map(c => `\`${c}\``).join(', ');
            const valList = rows.map(row => `(${cols.map(c => sqlVal(row[c])).join(', ')})`).join(',\n  ');
            sql += `-- ${table}\nINSERT INTO \`${table}\` (${colList}) VALUES\n  ${valList};\n\n`;
        });
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', 'attachment; filename="database_export.sql"');
        res.send(sql);
    }).catch(err => res.status(500).json({ error: err.message }));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
