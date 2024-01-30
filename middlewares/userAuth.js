const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) =>{
    
    //getting jwt token sent from frontend
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({error: "UnAuthorized user"});
    }

    //verifying jwt token and access data
    const user = jwt.verify(token, "dani1998");
    if(!user){
        return res.status(401).json({error: "Invalid jwt token"});
    }

    req.user = user;
    next();
}

module.exports = userAuth;