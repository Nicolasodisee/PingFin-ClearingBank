const mysql = require('mysql2/promise');
const crypto = require('crypto');

const API_URL = 'http://localhost:8080/api/po_in';
const DB_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: 'secret',
    database: 'Pingfin'
};

const generateRandomPOs = (bankIds, count) => {
    const messages = ["Lunch", "Factuur 2024-01", "Pizza (No Pineapple!)", "Cadeau", "Huur"];
    const pos = [];

    for (let i = 0; i < count; i++) {
        const ob_id = bankIds[Math.floor(Math.random() * bankIds.length)];
        let bb_id = bankIds[Math.floor(Math.random() * bankIds.length)];
        
        while (bb_id === ob_id) {
            bb_id = bankIds[Math.floor(Math.random() * bankIds.length)];
        }

        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        pos.push({
            po_id: `PO-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
            po_amount: parseFloat((Math.random() * 800).toFixed(2)),
            po_message: messages[Math.floor(Math.random() * messages.length)],
            po_datetime: now,
            ob_id: ob_id,
            oa_id: `BE${Math.floor(10 + Math.random() * 89)} ${Math.floor(1000 + Math.random() * 8999)} ${Math.floor(1000 + Math.random() * 8999)} ${Math.floor(1000 + Math.random() * 8999)}`,
            ob_code: 2000,
            ob_datetime: now,
            bb_id: bb_id,
            ba_id: `BE${Math.floor(10 + Math.random() * 89)} ${Math.floor(1000 + Math.random() * 8999)} ${Math.floor(1000 + Math.random() * 8999)} ${Math.floor(1000 + Math.random() * 8999)}`
        });
    }
    return pos;
};

async function run() {
    const count = process.argv[2] || 5;
    let connection;

    try {
        console.log(`Verbinden met database ${DB_CONFIG.database}...`);
        connection = await mysql.createConnection(DB_CONFIG);

        const [rows] = await connection.execute("SELECT id FROM BANKS");
        const bankIds = rows.map(row => row.id);

        if (bankIds.length < 2) {
            console.error("Fout: Je hebt minimaal 2 banken in de BANKS tabel nodig.");
            process.exit(1);
        }

        const randomData = generateRandomPOs(bankIds, count);
        console.log(`${count} volledige PO's gegenereerd.`);

        console.log(`Verzenden naar ${API_URL}...`);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: randomData })
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Succes! Server antwoord:", result.message);
            console.table(randomData.map(p => ({ 
                ID: p.po_id, 
                Bedrag: `€${p.po_amount}`, 
                Status: p.po_amount > 670 ? 'Zal weigeren' : 'OK' 
            })));
        } else {
            console.error("Server weigerde de batch:", result.message);
        }

    } catch (error) {
        console.error("Kritieke fout:", error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log("Staat je server ('node index.js') wel aan?");
        }
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
}
run();