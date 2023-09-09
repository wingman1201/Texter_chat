const jwt = require('jsonwebtoken')

const authenticateUser = async(req,res,next)=>{
    
    const token = req.headers['authorization']
    if(!token){
        return res.status(401).json({message:'Missing Token'})
    }
    
    try{
        const token_string = token.split(" ")[1]
        const decoded = jwt.verify(token_string,process.env.TOKEN_KEY)
        console.log(decoded)
        req.username = decoded.username
        console.log(req.username,'user')
        next()
    }catch(err){
        res.status(401).json({error:err.message+'this is from here'})
    }
}

module.exports = authenticateUser