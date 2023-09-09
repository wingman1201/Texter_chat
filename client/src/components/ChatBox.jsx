import React from 'react'
import {toast, ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import {useState,useEffect,useContext,useRef} from 'react'
import io from 'socket.io-client'
import Message from './Message';
import api from '../api'
import styled from 'styled-components'
import {Avatar} from '@mui/material'
import EmojiPicker, { Emoji } from 'emoji-picker-react'
import SendIcon from '@mui/icons-material/Send'
import MenuIcon from '@mui/icons-material/Menu'
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ConversationsContext } from '../conversationsContext'
const socket = io('http://localhost:8000')
const Page = styled.div`
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
`
const SelectedUserSection = styled.div`
    width:100%;
    padding:10px;
    display:flex;
    align-items:center;
    gap:10px;
    color:rgba(255,255,255,0.5);
    border-bottom: 1px solid rgba(0,0,0,0.4);
`
const Chat = styled.div`
    width:100%;
    height:100%;
    display:flex;
    padding-left:10px;
    padding-right:10px;
    flex-direction:column; 
    overflow-y: scroll;
    
`


const ChatInputArea = styled.div`
    display:flex;
    width:100%;
    padding:10px;
    
`
const InputBox = styled.input`
    height:2.5rem;
    width:100%;
    border:none;
    outline:none;
    color:white;
    background:none;
    border-top: 1px solid rgba(255,255,255,0.4);
    border-bottom: 1px solid rgba(255,255,255,0.4);
    padding-left:10px;
`
const ChatButtons = styled.div`
    background:none;
    height:2.5rem;
    display:flex;
    justify-content:center;
    align-items:center;
    width:2.5rem;
    color:rgba(255,255,255,0.5);

    :hover{
      cursor:pointer;
    }
`
const MenuBtn = styled.div`
  padding:1px;
  display:none;
  z-index:10000;
  :hover{
    cursor:pointer;
  }
  @media screen and (max-width:720px){
    display:flex;
  }
`



const ChatBox = ({username,handleMenuClick}) => {
  const {conversationId,selectedConversation} = useContext(ConversationsContext)
  const [message,setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [showEmojiPicker,setShowEmojiPicker] = useState(false)
  const chatContainerRef = useRef(null)
  const fileInputRef = useRef(null)
 

  useEffect(()=>{
    if(conversationId!==''){
        socket.emit('joinConversation',conversationId)
    }
    
  },[conversationId])  

  useEffect(()=>{
    socket.on('message',(newMessage)=>{
      if(newMessage.conversationId !== conversationId){
        toast('New message from',newMessage.sender)
      }else{
        setMessages([...messages,newMessage])
        console.log(messages)
      }
    })
  })
 const sendMessage = () =>{
    if(message.trim()!==''){
        console.log('clicked',message)
        const newMessage = {conversationId:conversationId,sender:username,content:message,file:null}
        socket.emit('send-message',{conversationId,sender:username,content:message,file:null})
        setMessages([...messages,newMessage])
        console.log(messages)
        setMessage('')
        
        setShowEmojiPicker(false)
    
      
    }
 }

 const handleFileChange = (e) =>{
  const selectedFile = e.target.files[0]
  const reader = new FileReader()
  reader.readAsDataURL(selectedFile)
  reader.onload = ()=>{
    socket.emit('send-message',{conversationId:conversationId,sender:username,content:null,file:{
      data: reader.result,
      name:selectedFile.name
    }})
    fetchMessagesByConversationId(conversationId)
    
  }
 }

 const deleteMessage = async(messageId)=>{
  
  const user = JSON.parse(localStorage.getItem('user'))
    try{
      const res = await api.delete(`/deleteMessage/${messageId}`,{
        headers:{
          Authorization:`Bearer ${user.token}`,
        }
      })
      if(res.status === 201){
        fetchMessagesByConversationId(conversationId)
        
      }
    }catch(err){
      console.log(err)
    }
    
 }

 const handleAttatchFileClick = () =>{
    fileInputRef.current.click()
 }

 const fetchMessagesByConversationId = async(id)=>{
    const user = JSON.parse(localStorage.getItem('user'))
      try{
        const response = await api.get(`/getMessages/${id}`,{
          headers:{
            Authorization:`Bearer ${user.token}`,
          }
        })
        
        if(response.data.length>0){
          setMessages(response.data.map((message)=>({_id:message._id,conversationId:message.conversationId,sender:message.sender,content:message.content,file:message.file})))
          console.log(messages)
        }else{
          setMessages([])
        }
      }catch(error){
        console.log(error)
      }
  }
  useEffect(()=>{
    fetchMessagesByConversationId(conversationId)
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    console.log(conversationId)
   },[conversationId])

  useEffect(()=>{
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
  },[messages])

  return (
    <Page>
        <SelectedUserSection>
          <MenuBtn>
            <MenuIcon onClick={handleMenuClick}/>
          </MenuBtn>
          {selectedConversation.name&&<Avatar>{selectedConversation.name[0]}</Avatar>}{selectedConversation.name}
        </SelectedUserSection>
        <Chat ref={chatContainerRef}>
          
            {
                messages.length === 0?(
                    <h2>no chats</h2>
                ):
                (messages.map((item)=>{
                    return(
                        <Message key={item._id} item = {item} username={username} deleteMessage={deleteMessage}/>
                    )
                })
            )}
        </Chat>
        <ChatInputArea>
            <ChatButtons style={{borderTop:'1px solid rgba(255,255,255,0.4)',borderLeft:'1px solid rgba(255,255,255,0.4)',borderBottom:'1px solid rgba(255,255,255,0.4)'}}><AttachFileIcon onClick={handleAttatchFileClick}/>
                <input ref={fileInputRef} type='file' accept='.jpg, .jpeg, .png, .pdf, .gif' style={{display:'none'}} onChange={handleFileChange}/>
            </ChatButtons>
            <ChatButtons onClick={()=>setShowEmojiPicker(!showEmojiPicker)} style={{borderTop:'1px solid rgba(255,255,255,0.4)',borderBottom:'1px solid rgba(255,255,255,0.4)'}}><EmojiEmotionsOutlinedIcon/></ChatButtons>
            <InputBox placeholder='type something...' onChange={(e)=>{setMessage(e.target.value)} } value={message}/>
            <ChatButtons style={{borderTop:'1px solid rgba(255,255,255,0.4)',borderRight:'1px solid rgba(255,255,255,0.4)',borderBottom:'1px solid rgba(255,255,255,0.4)'}}><SendIcon onClick={sendMessage}/></ChatButtons>
        </ChatInputArea>
        {showEmojiPicker&&<EmojiPicker theme='dark' emojiStyle='google' width='100%' height='100%' onEmojiClick={(emojiObject)=>{setMessage(message+emojiObject.emoji)}}/>}
    </Page>
  )
}

export default ChatBox