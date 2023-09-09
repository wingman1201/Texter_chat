const jwt = require('jsonwebtoken')
const users = require('../models/users')
const CryptoJs = require('crypto-js')

const login = async(req,res)=>{
    const {username,password} = req.body;
    try{
        if(username==='' || password===''){
            return res.status(400).json({error:'Username or Password not provided!'})
        }
        const user = await users.findOne({username})
        if(user){
            let decryptedPassword = CryptoJs.AES.decrypt(user.password,process.env.PASSKEY).toString(CryptoJs.enc.Utf8)

            if(password === decryptedPassword){
                const token = jwt.sign(
                    {username:user.username,
                    id:user._id,
                    email:user.email},
                process.env.TOKEN_KEY,
                {
                    expiresIn:"5h",
                }
                )
                
                const returnUser = {...user._doc,token:token}
                
                return res.status(200).json(returnUser)
            }else{
                return res.status(400).json({error:'password is incorrect'})
            }
        }else{
            return res.status(400).json({error:'no such username exists please register'})
        }
    }catch(err){
        return res.status(500).json({err:err.message})
    }
}



module.exports = {login}