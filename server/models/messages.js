const mongoose = require('mongoose')



const messageSchema = mongoose.Schema({
    conversationId:{type:String},
    sender:{type:String},
    content:{type:String},
    file:{type:String},

},{timestamps:true})

module.exports = mongoose.model('message',messageSchema)