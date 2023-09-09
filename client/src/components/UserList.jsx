import React from 'react'
import styled from 'styled-components'
import { Avatar,Badge } from '@mui/material'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { useContext, useEffect } from 'react'
import { ConversationsContext } from '../conversationsContext'
import api from '../api'
import { UserContext } from '../UserContext'
const List = styled.div`
    height:100%;
    overflow-y:scroll;
    width:100%;
    display:flex;
    flex-direction:column;
    gap:2px;
`
const ListItem = styled.div`
    display:flex;
    width:100%;
    font-family:Victor Mono;
    padding:10px;
    justify-content:space-between;
    background:rgba(0,0,0,0.1);
    color:rgba(255,255,255,0.5);
    align-items:center;
    gap:10px;
    &:hover{
      cursor:pointer;
    }
    
`
const StyledDeleteIcon = styled(DeleteOutlineOutlinedIcon)`
    color:rgba(255,255,255,0.5);
`
const Wrapper = styled.div`
    background:none;
    display:flex;
    gap:15px;
    align-items:center;
`


const UserList = ({myUsername}) => {
    const {conversations,setConversations,conversationId,setConversationId,setSelectedConversation} = useContext(ConversationsContext)
    const {expired,setExpired} = useContext(UserContext)
    const getConversation = async()=>{
      const User = localStorage.getItem('user')
      const token = JSON.parse(User).token
      try{
        const responseConversations = await api.get('/getConversation',{
          headers:{
            'Authorization': `Bearer ${token}`
          }
        })
        
        setConversations(responseConversations.data)
        
      }catch(err){
        if(err.response.status === 401){
          setExpired(true)
        }
        console.log(err.response)
      }
    }
    const deleteConversation = async(id)=>{
      try{
          const res = await api.delete(`/deleteConversation/${id}`)
          if(res.status === 200){
            console.log('successfully deleted')
            setConversationId('')
            getConversation()
            setSelectedConversation({})
          }
      }catch(err){
        console.log(err)
      }
    }
    useEffect(()=>{
      getConversation()
    },[])
    useEffect(()=>{
      console.log(conversations)
    },[conversations])
    if(conversations.length != 0){
      
      return (
        <List>
        {conversations.map((conversation)=>{
          
         
          return (
            <ListItem  key={conversation._id} onClick={()=>{setConversationId(conversation._id); setSelectedConversation(conversation)}}>
              <Wrapper>
                <Avatar sx={{height:'30px',width:'30px'}}>{conversation.name[0]}</Avatar>
                {conversation.name}
              </Wrapper>
              
              <StyledDeleteIcon onClick={()=>{deleteConversation(conversationId)}}/>
            </ListItem>
          )
        })}
        </List>
      )
    }
    else{
      return(
        <h3>No Conversations</h3>
      )
    }
}

export default UserList