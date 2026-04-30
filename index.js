const express = require('express');
const cors = require('cors');
const mysql = require("mysql2");
const app = express();
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

const poController = require('./src/controllers/poController');
const ackController = require('./src/controllers/ackController');

app.use(express.json());

const db = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    dateStrings: true
});

db.connect((err) => {
    if (err) throw err;
    console.log("Verbonden met de Pingfin database!");
});

setInterval(() => {
    poController.processTimeouts(db, 10); 
}, 60000);

const port = process.env.PORT;
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Clearing Bank API',
            version: '1.0.0',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const apiRoutes = require('./src/routes/api')(db); 
app.use('/api', apiRoutes);

app.get('/api/logs', (req, res) => poController.getLogs(req, res, db));

app.get('/', (req, res) => {
    res.send('Clearing Bank API is online');
});

module.exports = { db, app };


app.listen(port, () => {
    console.log(`Clearing Bank API draait op http://localhost:${port}`);
});