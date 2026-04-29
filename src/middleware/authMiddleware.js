const jwt = require('jsonwebtoken');
const SECRET_JWT_KEY = "jouw_super_geheim_wachtwoord";

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ status: 403, ok: false, message: "Access denied: No token provided" });
    }

    jwt.verify(token, SECRET_JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: 401, ok: false, message: "Invalid or expired token" });
        }
        
        req.bankBic = decoded.bic; 
        next(); 
    });
};

module.exports = { verifyToken, SECRET_JWT_KEY };