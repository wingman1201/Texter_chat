const users = require('../models/users')
const User = require('../models/users')
const conversations = require('../models/conversations')
const CryptoJs = require('crypto-js')
const registerUser = async(req,res)=>{
    
    const {username,email,password} = req.body
    try{
        
        const userExists = await User.findOne({email})
        if(userExists){
            return res.status(400).json({message:"User already exists"})
        }
        const encryptedPassword = CryptoJs.AES.encrypt(password,process.env.PASSKEY).toString()
        const newUser = await User.create({username,email,password:encryptedPassword})
        const savedUser = await newUser.save()

        
        if(newUser){
            
            return res.status(200).json(savedUser)
        }
    }catch(err){
        res.status(500).json({err:err.message})
    }
}

const searchUser = async(req,res)=>{
    let searchkey = req.body.key
    if(!searchkey.trim()){
        return res.status(400).json({message:'enter valid user'})
    }
    searchkey = searchkey.toString()
    console.log(searchkey)
    
    try{
        const searchResults = await users.find({username:{$regex: searchkey, $options:'i'}})
        if(searchResults.length===0){
            return res.status(404).json({message:'no results'})
        }
        res.status(200).json(searchResults)
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

module.exports = {registerUser,searchUser}