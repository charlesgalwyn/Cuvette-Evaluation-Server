const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) =>{
    
    //getting jwt token sent from frontend
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({error: "UnAuthorized user"});
    }

    //verifying jwt token and access data
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(!user){
        return res.status(401).json({error: "Invalid jwt token"});
    }

    req.user = user;
    next();
}

module.exports = userAuth;