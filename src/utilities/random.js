const mysql = require('mysql2/promise');
const crypto = require('crypto');

const TOKEN_URL = 'http://localhost:8080/api/token';
const PO_IN_URL = 'http://localhost:8080/api/po_in';

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
        const ob_id = "BMEUBEB1";
        let bb_id = "EURBBE99";
        
        while (bb_id === ob_id) {
            bb_id = bankIds[Math.floor(Math.random() * bankIds.length)];
        }

        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        pos.push({
            po_id: `PO-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
            po_amount: parseFloat((Math.random() * 600).toFixed(2)),
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
        console.log(`🔗 Verbinding maken met de database...`);
        connection = await mysql.createConnection(DB_CONFIG);

        const [rows] = await connection.execute("SELECT id, secret_key FROM BANKS LIMIT 1");
        
        if (rows.length === 0) {
            console.error("Fout: Geen banken gevonden in de tabel BANKS. Voeg er eerst een toe.");
            process.exit(1);
        }

        const myBank = rows[0];

        const [allBanks] = await connection.execute("SELECT id FROM BANKS");
        const bankIds = allBanks.map(row => row.id);

        console.log(`Inloggen bij de Clearing Bank als ${myBank.id}...`);
        const tokenResponse = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                bic: myBank.id, 
                secret_key: myBank.secret_key 
            })
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            throw new Error(`Login mislukt: ${tokenData.message}`);
        }

        const bearerToken = tokenData.token;
        console.log("Bearer Token ontvangen.");

        const randomData = generateRandomPOs(bankIds, count);
        console.log(`${count} PO's klaargezet voor verzending.`);

        console.log(`POST naar ${PO_IN_URL}...`);
        const response = await fetch(PO_IN_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}` 
            },
            body: JSON.stringify({ data: randomData })
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Succes! Server bericht:", result.message);
            console.table(randomData.map(p => ({ 
                ID: p.po_id, 
                Bedrag: `€${p.po_amount}`,
                Van: p.ob_id,
                Naar: p.bb_id
            })));
        } else {
            console.error("De server heeft de PO's geweigerd:", result.message);
        }

    } catch (error) {
        console.error("Fout in random.js:", error.message);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
}

run();