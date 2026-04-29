const getLogs = (req, res, db) => {
    const sql = "SELECT * FROM LOGS ORDER BY datetime DESC LIMIT 100";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Fout bij ophalen logs:", err.message);
            return res.status(500).json({ ok: false, message: err.message });
        }
        res.status(200).json({
            ok: true,
            data: results
        });
    });
};
module.exports = { getLogs };