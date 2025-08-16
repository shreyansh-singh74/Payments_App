const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('./config')

function authMiddleware(req,res,next){
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({
            message : "No token provided"
        });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch(error){
        console.log('JWT verification error:', error.message);
        return res.status(401).json({
            message : "Invalid token"
        });
    }
}

module.exports = {
    authMiddleware
};