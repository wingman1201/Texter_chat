const express = require('express')
const socketIo = require('socket.io')
const http = require('http')
require('dotenv').config();
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fs = require('fs')
const path = require('path')

const connectDB = require('./DB_connection')
const userRoutes = require('./routes/usersRoutes')
const authRoutes = require('./routes/authRoutes')
const conversationRoutes = require('./routes/conversationRoutes')
const messages = require('./models/messages')




const app = new express()
const server = http.createServer(app)
const io = socketIo(server,{
    cors:{
        origin:'http://localhost:3000'
    }
})

app.use('/uploads',express.static(__dirname+'/uploads'))
app.use(cors({
    credentials : true,
    origin:'http://localhost:3000'
}))
app.use(express.json())
app.use(cookieParser())
connectDB()
global.onlineUsers = new Map()
const getUserBysocketId = (socketId) =>{
    for(const[userId,id] of onlineUsers.entries()){
        if(id===socketId){
            return userId;
        }
    }
    return null
}


io.on('connection',(socket)=>{
    socket.on('userConnected',(username)=>{
        console.log(`user ${username} connected to socket ${socket.id}`)
    })
    socket.on('disconnect',()=>{
        const userId = getUserBysocketId(socket.id);
        if(userId){
            onlineUsers.delete(userId)
        }
    })
    
    socket.on('send-message', async (message)=>{
        const {conversationId,sender,content,file} = message
        if(!file){
        
        
        try{
            const newMessage = new messages({conversationId,sender,content,file:null})
            const savedMessage = await newMessage.save()
            socket.to(conversationId).emit('message',savedMessage)
            console.log(savedMessage)
        }catch(err){
            console.log(err.message)
        }
        }else{
           const parts = file.name.split('.')
           const extention = parts[parts.length - 1]
           const filename = Date.now()+'.'+extention 
           const filepath = __dirname + '/uploads/'+filename
           const decodeData =  Buffer.from(file.data.split(',')[1],'base64')
           fs.writeFile(filepath,decodeData,async()=>{
            console.log(filepath)
            const newMessage = new messages({conversationId,sender,content:null,file:filename})
           try{
            const savedMessage = await newMessage.save()
            socket.to(conversationId).emit('message',savedMessage)
            console.log('saved:',savedMessage)
           }catch(err){
            console.log(err)
           }
           })
           
        }
    })

    socket.on('joinConversation',(conversationId)=>{
        socket.join(conversationId)
        console.log(`user joined conversation ${conversationId}`)
    })
})



app.get('/',(req,res)=>{
    res.send('<h1>Hello World</h1>')
})

app.use('/',userRoutes)
app.use('/',authRoutes)
app.use('/',conversationRoutes)
server.listen(8000,()=>{
    console.log('server is running')
})

