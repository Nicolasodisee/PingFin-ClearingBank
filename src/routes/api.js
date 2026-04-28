const express = require('express');

module.exports = (db) => {
    const router = express.Router();
    
    const bankController = require('../controllers/bankController');
    const poController = require('../controllers/poController');
	 const ackController = require('../controllers/ackController');

    router.get('/banks', (req, res) => bankController.getBanks(req, res, db));

    router.post('/po_in', (req, res) => poController.receivePO(req, res, db));
    router.get('/po_out', (req, res) => poController.getPendingPOs(req, res, db));

    router.post('/ack_in', (req, res) => ackController.receiveACK(req, res, db));
    router.get('/ack_out', (req, res) => ackController.getFinalStatuses(req, res, db));

    return router;
};