const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');

module.exports = (db) => {
    const router = express.Router();
    
    const bankController = require('../controllers/bankController');
    const poController = require('../controllers/poController');
    const ackController = require('../controllers/ackController');
    const logController = require('../controllers/logController');

    /**
     * @openapi
     * /api/token:
     *   post:
     *     summary: Verkrijg een Bearer token
     *     tags: [Authenticatie]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               bic:
     *                 type: string
     *               secret_key:
     *                 type: string
     *     responses:
     *       200:
     *         description: Token succesvol gegenereerd
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: integer
     *                 ok:
     *                   type: boolean
     *                 token:
     *                   type: string
     */
    router.post('/token', (req, res) => bankController.getToken(req, res, db));
    
    /**
     * @openapi
     * /api/banks:
     *   get:
     *     summary: Lijst van alle banken
     *     tags: [Informatie]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Succesvol opgehaald
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: integer
     *                 data:
     *                   type: array
     */
    router.get('/banks', verifyToken, (req, res) => bankController.getBanks(req, res, db));

    /**
     * @openapi
     * /api/logs:
     *   get:
     *     summary: Bekijk systeemlogs
     *     tags: [Admin]
     *     responses:
     *       200:
     *         description: Logs succesvol opgehaald
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 ok:
     *                   type: boolean
     *                 data:
     *                   type: array
     */
    router.get('/logs', (req, res) => logController.getLogs(req, res, db));

    /**
     * @openapi
     * /api/po_in:
     *   post:
     *     summary: Ontvang nieuwe Payment Orders (Directe array)
     *     tags: [Transacties]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *               type: object
     *               required: [po_id, po_amount, ob_id, oa_id, bb_id, ba_id]
     *               properties:
     *                 po_id: { type: string }
     *                 po_amount: { type: string }
     *                 po_message: { type: string }
     *                 po_datetime: { type: string }
     *                 ob_id: { type: string }
     *                 oa_id: { type: string }
     *                 ob_code: { type: integer }
     *                 ob_datetime: { type: string }
     *                 bb_id: { type: string }
     *                 ba_id: { type: string }
     *                 cb_code: { type: integer, nullable: true }
     *                 cb_datetime: { type: string, nullable: true }
     *                 bb_code: { type: integer, nullable: true }
     *                 bb_datetime: { type: string, nullable: true }
     *     responses:
     *       201:
     *         description: PO's succesvol verwerkt
     */
    router.post('/po_in', verifyToken, (req, res) => poController.receivePO(req, res, db));

    /**
     * @openapi
     * /api/po_out:
     *   get:
     *     summary: Haal uitgaande Payment Orders op
     *     tags: [Transacties]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Uitgaande PO's opgehaald
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: integer
     *                 ok:
     *                   type: boolean
     *                 data:
     *                   type: array
     */
    router.get('/po_out', verifyToken, (req, res) => poController.getPendingPOs(req, res, db));

    /**
     * @openapi
     * /api/ack_in:
     *   post:
     *     summary: Ontvang Acknowledgements (Directe array)
     *     tags: [Transacties]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *               type: object
     *               required: [po_id, po_amount, po_message, po_datetime, ob_id, oa_id, ob_code, ob_datetime, cb_code, cb_datetime, bb_id, ba_id, bb_code, bb_datetime]
     *               properties:
     *                 po_id: { type: string }
     *                 po_amount: { type: string }
     *                 po_message: { type: string }
     *                 po_datetime: { type: string }
     *                 ob_id: { type: string }
     *                 oa_id: { type: string }
     *                 ob_code: { type: integer }
     *                 ob_datetime: { type: string }
     *                 cb_code: { type: integer }
     *                 cb_datetime: { type: string }
     *                 bb_id: { type: string }
     *                 ba_id: { type: string }
     *                 bb_code: { type: integer }
     *                 bb_datetime: { type: string }
     *     responses:
     *       200:
     *         description: ACK succesvol verwerkt
     */
    router.post('/ack_in', verifyToken, (req, res) => ackController.receiveACK(req, res, db));

    /**
     * @openapi
     * /api/ack_out:
     *   get:
     *     summary: Bekijk status van afgehandelde transacties
     *     tags: [Transacties]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Afgeronde transacties opgehaald
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: integer
     *                 ok:
     *                   type: boolean
     *                 data:
     *                   type: array
     */
    router.get('/ack_out', verifyToken, (req, res) => ackController.getFinalStatuses(req, res, db));

    return router;
};