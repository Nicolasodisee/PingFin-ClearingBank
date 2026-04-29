const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');

module.exports = (db) => {
    const router = express.Router();
    
    const bankController = require('../controllers/bankController');
    const poController = require('../controllers/poController');
	const ackController = require('../controllers/ackController');
    const logController = require('../controllers/logController');

    router.post('/token', (req, res) => bankController.getToken(req, res, db));
    
    router.get('/banks', verifyToken, (req, res) => bankController.getBanks(req, res, db));

    router.get('/logs', (req, res) => logController.getLogs(req, res, db));

    router.post('/po_in', verifyToken, (req, res) => poController.receivePO(req, res, db));
    router.get('/po_out', verifyToken, (req, res) => poController.getPendingPOs(req, res, db));

    router.post('/ack_in', verifyToken, (req, res) => ackController.receiveACK(req, res, db));
    router.get('/ack_out', verifyToken, (req, res) => ackController.getFinalStatuses(req, res, db));

    const jwt = require('jsonwebtoken');
    const SECRET_JWT_KEY = process.env.JWT_SECRET;

    router.post('/login', (req, res) => {
    const { bic, token } = req.body;

    db.query("SELECT * FROM BANKS WHERE bic = ? AND token = ?", [bic, token], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ message: "Ongeldige BIC of Token" });
        }

        const token = jwt.sign({ bic: bic }, SECRET_JWT_KEY, { expiresIn: '1h' });

        res.json({
            message: "Inloggen geslaagd",
            token: token
        });
    });
});

    return router;
};