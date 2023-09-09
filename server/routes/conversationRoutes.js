const Router = require('express').Router()
const {createConversation,getConversations,getConversationMessages,deleteMessage,deleteConversation} = require('../controllers/conversationController')
const authenticateUser = require('../middlewares')

Router.use(authenticateUser)
Router.route('/newConversation').post(createConversation)
Router.route('/deleteConversation/:conversationId').delete(deleteConversation)
Router.route('/getConversation').get(getConversations)
Router.route('/getMessages/:conversationId').get(getConversationMessages)
Router.route('/deleteMessage/:messageId').delete(deleteMessage)
module.exports = Router