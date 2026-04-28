const receivePO = async (req, res, db) => {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ status: 400, ok: false, message: "Geen geldige array ontvangen" });
    }

    console.log(`Verwerking & Uitgebreide Logging van ${data.length} PO's...`);

    for (const po of data) {
        const cb_datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const cb_code = 2000;

        const sqlIn = `INSERT INTO PO_IN (
            po_id, po_amount, po_message, po_datetime, 
            ob_id, oa_id, ob_code, ob_datetime, 
            bb_id, ba_id, cb_datetime
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const valuesIn = [
            po.po_id, po.po_amount, po.po_message, po.po_datetime,
            po.ob_id, po.oa_id, po.ob_code, po.ob_datetime,
            po.bb_id, po.ba_id, cb_datetime
        ];

        try {
            await db.promise().query(sqlIn, valuesIn);
            console.log(`PO ${po.po_id} geregistreerd in PO_IN.`);

            const logData = async (logType, logMessage, currentCbCode = null) => {
                const sqlLog = `INSERT INTO LOGS (
                    datetime, message, type, po_id, po_amount, po_message, po_datetime,
                    ob_id, oa_id, ob_code, ob_datetime, cb_code, cb_datetime,
                    bb_id, ba_id
                ) VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                const logValues = [
                    logMessage, logType, po.po_id, po.po_amount, po.po_message, po.po_datetime,
                    po.ob_id, po.oa_id, po.ob_code, po.ob_datetime,
                    currentCbCode, cb_datetime, po.bb_id, po.ba_id
                ];
                await db.promise().query(sqlLog, logValues);
            };

            if (parseFloat(po.po_amount) > 700) {
                console.log(`PO ${po.po_id} afgewezen.`);
                await logData('VALIDATION_FAIL', 'Bedrag te hoog (> 700)');
            } else {
                const sqlOut = `INSERT INTO PO_OUT (
                    po_id, po_amount, po_message, po_datetime, 
                    ob_id, oa_id, ob_code, ob_datetime, 
                    bb_id, ba_id, 
                    cb_code, cb_datetime
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                const valuesOut = [
                    po.po_id,
                    po.po_amount,
                    po.po_message,
                    po.po_datetime,
                    po.ob_id,
                    po.oa_id,
                    po.ob_code,
                    po.ob_datetime,
                    po.bb_id,
                    po.ba_id,
                    cb_code,
                    cb_datetime
                ];

                await db.promise().query(sqlOut, valuesOut);

                console.log(`PO ${po.po_id} doorgezet naar PO_OUT.`);
                await logData('VALIDATION_OK', 'Succesvol gevalideerd', cb_code);
            }

        } catch (err) {
            console.error(`Fout voor ${po.po_id}:`, err.message);
            db.query("INSERT INTO LOGS (datetime, message, type, po_id) VALUES (NOW(), ?, 'SYSTEM_ERROR', ?)", [err.message, po.po_id]);
        }
    }

    res.status(201).json({ status: 201, ok: true, message: "Verwerkt met volledige logs." });
};

const getPendingPOs = (req, res, db) => {
    const sql = "SELECT * FROM PO_OUT";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database fout:", err.message);
            return res.status(500).json({
                "status": 500,
                "ok": false,
                "message": "Kon geen data ophalen uit PO_OUT"
            });
        }
        res.status(200).json({
            "status": 200,
            "ok": true,
            "data": results
        });
    });
};

module.exports = {
    receivePO,
    getPendingPOs
};