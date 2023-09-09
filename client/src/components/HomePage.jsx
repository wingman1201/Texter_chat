import React, { useEffect,useContext,useState } from 'react'
import styled from 'styled-components'
import {Avatar,IconButton,Menu,MenuItem} from '@mui/material'
import useDebounce from '../hooks/useDebounce'
import UserList from './UserList'
import ChatBox from './ChatBox'
import SearchUser from './SearchUser'
import { UserContext } from '../UserContext'
import { ConversationsContext } from '../conversationsContext'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { redirect, useNavigate } from 'react-router-dom'
import api from '../api'

const Page = styled.div`
  margin:auto;
  display: flex;
  height:100vh;
  font-family:Victor Mono;
  width:80vw;
  
  display:flex;
  background: #0F2027;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right,#232526, #414345);
  background: linear-gradient(to bottom right,#232526, #414345); 
  @media screen and (max-width:720px){
    width:100%;
  }
`
const SideBar = styled.div`
  width:40%;
  height:100%;
  display:flex;
  flex-direction:column;
  border-right: 3px solid rgba(0,0,0,0.1);



  @media screen and (max-width:720px){
  background: #0F2027;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #2C5364, #203A43, #0F2027);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom right,#232526, #414345); 
    width:70%;
    position: absolute;
    z-index:1000;
    transform: ${(props)=>( props.open? 'translateX(0%)': 'translateX(-100%)')};
    transition: all 0.5s ease-in-out;
  }
`
const User = styled.div`
  width:100%;
  display:flex;
  align-items:center;
  padding:10px;
  color:rgba(255,255,255,0.5);
  gap:20px;
  justify-content:flex-end;
`




const HomePage = () => {
  const {user,setUser,expired,setExpired} = useContext(UserContext)
  const {conversations,setConversations} = useContext(ConversationsContext)
  const [searchTerm , setSearchTerm]  = useState('')
  const [options,setOptions] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [openSlider,setOpenSlider] = useState(false)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  

  const handleClick = (event)=>{
      setAnchorEl(event.currentTarget)
  }
  const handleClose = () =>{
      setAnchorEl(null)
  }

  const handleSliderCLoseOpen = () =>{
    setOpenSlider(!openSlider)
    
  }
  const logout = () =>{
    localStorage.removeItem('user')
    setUser(null)
    handleClose()
  }

  const fetchUsers = async(value)=>{
    const token = JSON.parse(localStorage.getItem('user')).token  
    try{
        let response = await api.post('/search',{key:value},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        if(response && response.data){
            setOptions(response.data.map((user)=>({username:user.username,id:user._id})))
        }
    }catch(error){
        setOptions([])
    }
  }

  const debouncedSearchValue = useDebounce(searchTerm,1000)
    useEffect(()=>{
        console.log(debouncedSearchValue)
        fetchUsers(debouncedSearchValue)
        
    },[debouncedSearchValue])
    
   useEffect(()=>{
    console.log(options)
   },[options])

  const createConversation = async(receiverId)=>{
    const user = JSON.parse(localStorage.getItem('user'))
    try{
      const response = await api.post('/newConversation',{participants:[user.username,receiverId]},{
        headers : {
          Authorization:`Bearer ${user.token}`
        }
      })
      if(response.status === 201){
        console.log('conversation created',response.data)
        let name = response.data.newConversation.participants.find((name)=>name!==user.username)
        const newConversation = {...response.data.newConversation,name:name}
        setConversations([...conversations,newConversation])
      }else if(response.status === 409){
        console.log('conversation already exists')
      }
    }catch(error){
        console.log(error,'from create conversation')
    }
  }

  useEffect(()=>{
    if(expired){
      navigate('/login')
    }
  },[expired])

  useEffect(()=>{
    console.log(user)
  },[user])
  if(user!=null){

  return (
    
    <Page>
      <SideBar open = {openSlider}>
        <User>
          <Avatar>H</Avatar>
          
          {
            user?user.username:'hello'
          }
        <IconButton
        
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon sx={{color:'white'}}/>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style:{
            maxHeight:35*3.5,
            width:'15ch',
            backgroundColor:'black',
            color:'white',
          }
        }}
      >
        
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
        </User>
        <SearchUser searchTerm={searchTerm} setSearchTerm={setSearchTerm} options={options} onUserClick = {createConversation}/>
        <UserList conversations={conversations} myUsername={user?.username}/>
      </SideBar>
      <ChatBox username={user.username} handleMenuClick = {handleSliderCLoseOpen} />
    </Page>
    
  )
}
  else{
    
     navigate('/login')
  }
}

export default HomePage