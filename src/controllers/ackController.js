const receiveACK = async (req, res, db) => {
    const { data } = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ status: 400, ok: false, message: "Data moet een array zijn" });
    }

    const ack = data[0];

    try {
        const sqlIn = `INSERT INTO ACK_IN (po_id, po_amount, po_message, po_datetime, ob_id, oa_id, ob_code, ob_datetime, cb_code, cb_datetime, bb_id, ba_id, bb_code, bb_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [ack.po_id, ack.po_amount, ack.po_message, ack.po_datetime, ack.ob_id, ack.oa_id, ack.ob_code, ack.ob_datetime, ack.cb_code, ack.cb_datetime, ack.bb_id, ack.ba_id, ack.bb_code, ack.bb_datetime];
        
        await db.promise().query(sqlIn, values);

        const sqlOut = `INSERT INTO ACK_OUT (po_id, po_amount, po_message, po_datetime, ob_id, oa_id, ob_code, ob_datetime, cb_code, cb_datetime, bb_id, ba_id, bb_code, bb_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        await db.promise().query(sqlOut, values);

        await db.promise().query("DELETE FROM PO_OUT WHERE po_id = ?", [ack.po_id]);

        await db.promise().query("INSERT INTO LOGS (datetime, message, type, po_id) VALUES (NOW(), 'ACK ontvangen en verwerkt', 'ACK_SUCCESS', ?)", [ack.po_id]);

        res.status(200).json({ status: 200, ok: true, message: "ACK verwerkt en PO afgerond." });
    } catch (err) {
        console.error("Fout bij ACK verwerking:", err.message);
        res.status(500).json({ status: 500, ok: false, message: err.message });
    }
};

const getFinalStatuses = (req, res, db) => {
    db.query("SELECT * FROM ACK_OUT", (err, results) => {
        if (err) return res.status(500).json({ status: 500, ok: false, message: err.message });
        res.status(200).json({ status: 200, ok: true, data: results });
    });
};

module.exports = { receiveACK, getFinalStatuses };