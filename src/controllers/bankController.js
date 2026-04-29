const getBanks = (req, res, db) => {
    const sql = "SELECT * FROM BANKS";
    
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ status: 200, data: results });
    });
};

// src/controllers/bankController.js
const jwt = require('jsonwebtoken');
const { SECRET_JWT_KEY } = require('../middleware/authMiddleware');

const getToken = (req, res, db) => {
    const { bic, secret_key } = req.body;

    // Check 1: Hebben we alle info gekregen?
    if (!bic || !secret_key) {
        return res.status(400).json({ status: 400, ok: false, message: "BIC en Secret Key zijn verplicht" });
    }

    // Check 2: Zoek de bank in de database (we zoeken op ID omdat dat je PK is)
    const sql = "SELECT id, secret_key FROM BANKS WHERE id = ? AND secret_key = ?";
    
    db.query(sql, [bic, secret_key], (err, results) => {
        if (err) {
            console.error("SQL Error in getToken:", err.message);
            return res.status(500).json({ status: 500, ok: false, message: "Database fout: " + err.message });
        }

        if (results.length === 0) {
            return res.status(401).json({ status: 401, ok: false, message: "Ongeldige BIC of Secret Key" });
        }

        // Check 3: Token genereren
        try {
            const token = jwt.sign(
                { bic: results[0].id }, 
                SECRET_JWT_KEY, 
                { expiresIn: '2h' }
            );

            // OPTIONEEL: Update het token in de database (je nieuwe kolom)
            db.query("UPDATE BANKS SET token = ? WHERE id = ?", [token, results[0].id]);

            // Stuur het antwoord terug
            res.status(200).json({
                status: 200,
                ok: true,
                token: token
            });
        } catch (jwtErr) {
            console.error("JWT Sign Error:", jwtErr.message);
            return res.status(500).json({ status: 500, ok: false, message: "Token generatie mislukt" });
        }
    });
};

module.exports = {
    getToken,
    getBanks
};