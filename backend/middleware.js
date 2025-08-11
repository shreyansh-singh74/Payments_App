const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('./config')

function authMiddleware(req,res,next){
    // Add debugging to see what headers are being received
    console.log('All headers:', req.headers);
    console.log('Authorization header:', req.headers.authorization);
    
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            message : "No Authorized"
        });
    }

    // Remove the Bearer check and use the token directly
    const token = authHeader;

    try{
        const decoded = jwt.verify(token,JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch{
        return res.status(400).json({
            message : "Failed authentication."
        });
    }
}

module.exports = {
    authMiddleware
};