const mongoose = require('mongoose')

const conversationSchema = mongoose.Schema({
    participants:[]
},{timastamps:true})

module.exports = mongoose.model('conversations',conversationSchema)
