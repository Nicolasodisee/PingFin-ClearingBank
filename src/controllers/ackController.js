const receiveACK = (req, res, db) => {
    const { data } = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ status: 400, ok: false, message: "Data moet een array zijn" });
    }

    const ack = data[0];

    const sqlIn = `INSERT INTO ACK_IN (
        po_id, po_amount, po_message, po_datetime, 
        ob_id, oa_id, ob_code, ob_datetime, 
        cb_code, cb_datetime, 
        bb_id, ba_id, bb_code, bb_datetime
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        ack.po_id, ack.po_amount, ack.po_message, ack.po_datetime,
        ack.ob_id, ack.oa_id, ack.ob_code, ack.ob_datetime,
        ack.cb_code, ack.cb_datetime,
        ack.bb_id, ack.ba_id, ack.bb_code, ack.bb_datetime
    ];

    db.query(sqlIn, values, (err, result) => {
        if (err) {
            console.error("Fout bij ACK_IN:", err.message);
            return res.status(500).json({ status: 500, ok: false, message: err.message });
        }

        const sqlOut = `INSERT INTO ACK_OUT (
            po_id, po_amount, po_message, po_datetime, 
            ob_id, oa_id, ob_code, ob_datetime, 
            cb_code, cb_datetime, 
            bb_id, ba_id, bb_code, bb_datetime
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(sqlOut, values, (errOut, resultOut) => {
            if (errOut) {
                console.error("Fout bij transfer naar ACK_OUT:", errOut.message);
                return res.status(500).json({ status: 500, ok: false, message: "ACK_IN opgeslagen, maar transfer naar ACK_OUT mislukt." });
            }

            db.query("INSERT INTO LOGS (datetime, message, type, po_id) VALUES (NOW(), 'ACK doorgezet naar ACK_OUT', 'ACK_IN', ?)", [ack.po_id]);

            console.log(`ACK voor ${ack.po_id} direct doorgezet van IN naar OUT.`);

            res.status(200).json({
                status: 200,
                ok: true,
                message: "Acknowledgment ontvangen en direct doorgezet naar ACK_OUT",
            });
        });
    });
};

const getFinalStatuses = (req, res, db) => {
    const sql = "SELECT * FROM ACK_OUT";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ status: 500, ok: false, message: err.message });
        res.status(200).json({ status: 200, ok: true, data: results });
    });
};

module.exports = {  
    receiveACK, 
    getFinalStatuses
};