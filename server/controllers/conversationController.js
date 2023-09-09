const conversations = require('../models/conversations');
const Conversations = require('../models/conversations');
const messages = require('../models/messages');
const Messages = require('../models/messages')

const createConversation = async(req,res)=>{
    const participants = req.body.participants;
    
    try{
        const existingConversation = await Conversations.findOne({
            participants: {$all: participants}
        })

        if(existingConversation){
            return res.status(409).json({message:'Conversation already exists'})
        }
        const newConversation = await Conversations.create({participants})
        const savedConversation = await newConversation.save()
        return res.status(201).json({newConversation:savedConversation})
    }catch(err){
        return res.status(500).json({error:err.message})
    }
}

const deleteConversation = async(req,res)=>{
    const id = req.params.conversationId
    try{
        const deletedMessages = await messages.deleteMany({conversationId:id})
        const deletedConversation = await conversations.findByIdAndRemove(id)

        if(deleteConversation){
            return res.status(200).send('Deleted conversation successfully!')
        }
    }catch(err){
        return res.status(500).json(err)
    }
}

const getConversations = async(req,res)=>{
    const username = req.username
    try{
        const conversations = await Conversations.find({
            participants:username
        })
        
        const UpdatedConversations = conversations.map((conversation)=>{
            let name = conversation.participants.find((participant)=> participant!==username)
            return {...conversation._doc,name}
        })
        
        res.status(201).json(UpdatedConversations)
    }catch(err){
        console.log(err.message)
        res.status(500).json({message:err.message})
    }
}

const getConversationMessages = async(req,res)=>{
    const conversationId = req.params.conversationId
    try{
        const messages = await Messages.find({conversationId})
        res.status(201).json(messages)
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

const deleteMessage = async(req,res)=>{
    const messageId = req.params.messageId
    try{
        const deletedMessage = await Messages.findByIdAndRemove(messageId)
        if (!deletedMessage) {
            return res.status(404).json({ error: 'Message not found' });
          }
        
          
          
        
          
          res.status(201).json({ message: 'Message deleted successfully' });
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

module.exports = {createConversation,deleteConversation,getConversations,getConversationMessages,deleteMessage}