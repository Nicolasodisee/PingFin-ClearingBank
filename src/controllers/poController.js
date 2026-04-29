const receivePO = async (req, res, db) => {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ status: 400, ok: false, message: "Geen geldige array ontvangen" });
    }

    for (const po of data) {
        const cb_datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let cb_code = 2000;
        let validationError = false;

        try {
            const [existing] = await db.promise().query("SELECT po_id FROM PO_IN WHERE po_id = ?", [po.po_id]);
            if (existing.length > 0) {
                cb_code = 4005;
                validationError = true;
            }

            if (!validationError && parseFloat(po.po_amount) < 0) {
                cb_code = 4003;
                validationError = true;
            }

            if (!validationError && parseFloat(po.po_amount) > 500) {
                cb_code = 4002;
                validationError = true;
            }

            if (!validationError) {
                const [bank] = await db.promise().query("SELECT id FROM BANKS WHERE id = ?", [po.bb_id]);
                if (bank.length === 0) {
                    cb_code = 4004;
                    validationError = true;
                }
            }

            const sqlIn = `INSERT INTO PO_IN (po_id, po_amount, po_message, po_datetime, ob_id, oa_id, ob_code, ob_datetime, bb_id, ba_id, cb_code, cb_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            await db.promise().query(sqlIn, [po.po_id, po.po_amount, po.po_message, po.po_datetime, po.ob_id, po.oa_id, po.ob_code, po.ob_datetime, po.bb_id, po.ba_id, cb_code, cb_datetime]);

            if (validationError) {
                const sqlAckFail = `INSERT INTO ACK_OUT (po_id, po_amount, po_message, po_datetime, ob_id, oa_id, ob_code, ob_datetime, cb_code, cb_datetime, bb_id, ba_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                await db.promise().query(sqlAckFail, [po.po_id, po.po_amount, po.po_message, po.po_datetime, po.ob_id, po.oa_id, po.ob_code, po.ob_datetime, cb_code, cb_datetime, po.bb_id, po.ba_id]);
                
                await logData(db, po, 'VALIDATION_FAIL', `Afgewezen met code ${cb_code}`, cb_code, cb_datetime);
                console.log(`PO ${po.po_id} afgewezen (Code ${cb_code}) en naar ACK_OUT.`);
            } else {
                const sqlOut = `INSERT INTO PO_OUT (po_id, po_amount, po_message, po_datetime, ob_id, oa_id, ob_code, ob_datetime, bb_id, ba_id, cb_code, cb_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                await db.promise().query(sqlOut, [po.po_id, po.po_amount, po.po_message, po.po_datetime, po.ob_id, po.oa_id, po.ob_code, po.ob_datetime, po.bb_id, po.ba_id, cb_code, cb_datetime]);
                
                await logData(db, po, 'VALIDATION_OK', 'Succesvol gevalideerd', cb_code, cb_datetime);
                console.log(`PO ${po.po_id} doorgezet naar PO_OUT.`);
            }

            await db.promise().query("DELETE FROM PO_IN WHERE po_id = ?", [po.po_id]);

        } catch (err) {
            console.error(`Systeemfout voor ${po.po_id}:`, err.message);
            await db.promise().query("INSERT INTO LOGS (datetime, message, type, po_id) VALUES (NOW(), ?, 'SYSTEM_ERROR', ?)", [err.message, po.po_id]);
        }
    }
    res.status(201).json({ status: 201, ok: true, message: "PO's verwerkt en PO_IN opgeschoond." });
};

const logData = async (db, po, logType, logMessage, currentCbCode, cb_datetime) => {
    const sqlLog = `INSERT INTO LOGS (datetime, message, type, po_id, po_amount, po_message, po_datetime, ob_id, oa_id, ob_code, ob_datetime, cb_code, cb_datetime, bb_id, ba_id) VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await db.promise().query(sqlLog, [logMessage, logType, po.po_id, po.po_amount, po.po_message, po.po_datetime, po.ob_id, po.oa_id, po.ob_code, po.ob_datetime, currentCbCode, cb_datetime, po.bb_id, po.ba_id]);
};

const processTimeouts = async (db, timeoutMinutes = 30) => {
    console.log(`Checking for PO timeouts older than ${timeoutMinutes} minutes...`);
    
    const sqlSelect = `SELECT * FROM PO_OUT WHERE cb_datetime < NOW() - INTERVAL ? MINUTE`;
    const [expiredPOs] = await db.promise().query(sqlSelect, [timeoutMinutes]);

    for (const po of expiredPOs) {
        try {
            const sqlMove = `INSERT INTO ACK_OUT (po_id, po_amount, po_message, po_datetime, ob_id, oa_id, ob_code, ob_datetime, cb_code, cb_datetime, bb_id, ba_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 4001, NOW(), ?, ?)`;
            await db.promise().query(sqlMove, [po.po_id, po.po_amount, po.po_message, po.po_datetime, po.ob_id, po.oa_id, po.ob_code, po.ob_datetime, po.bb_id, po.ba_id]);

            await db.promise().query("DELETE FROM PO_OUT WHERE po_id = ?", [po.po_id]);
            
            await db.promise().query("INSERT INTO LOGS (datetime, message, type, po_id) VALUES (NOW(), 'PO timed out - moved to ACK_OUT', 'TIMEOUT', ?)", [po.po_id]);
            console.log(`PO ${po.po_id} verlopen en verplaatst naar ACK_OUT.`);
        } catch (err) {
            console.error("Fout bij verwerken timeout:", err.message);
        }
    }
};

const getPendingPOs = (req, res, db) => {
    db.query("SELECT * FROM PO_OUT", (err, results) => {
        if (err) return res.status(500).json({ status: 500, ok: false, message: err.message });
        res.status(200).json({ status: 200, ok: true, data: results });
    });
};

module.exports = { receivePO, getPendingPOs, processTimeouts };