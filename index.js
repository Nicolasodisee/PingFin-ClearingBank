const express = require('express');
const app = express();
const mysql = require("mysql2");

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "secret", 
    database: "Pingfin"
});

db.connect((err) => {
    if (err) throw err;
    console.log("Verbonden!");
});

module.exports = { db, app };

const port = 8080;

app.use(express.json());
const apiRoutes = require('./src/routes/api')(db); 
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Hello world');    a
});

app.listen(port, () => {
    console.log(`Clearing Bank API draait op http://localhost:${port}`);
});