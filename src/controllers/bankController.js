const getBanks = (req, res, db) => {
    const sql = "SELECT * FROM BANKS";
    
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ status: 200, data: results });
    });
};

module.exports = { getBanks };