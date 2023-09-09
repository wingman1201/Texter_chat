import React, { useContext,useState } from 'react'
import styled from 'styled-components'
import {Avatar,IconButton,Menu,MenuItem} from '@mui/material'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const MessagesContainer = styled.div`
    width:100%;
    display:flex;
    padding:10px;
    align-items:center;
    gap:5px;
    justify-content:${props=>(props.issent?'flex-start':'flex-end')};
`
const Message_ = styled.div`
    max-width:48%;
    background:${props=>(props.issent?'rgba(0,0,0,0.1)':'linear-gradient(to right,#673ab7, #512da8)')};
    display:flex;
    flex-wrap:wrap;
    backdrop-filter:brightness(20%);
    color:rgba(255,255,255,0.8);
    font-size:0.8rem;
    font-family:Victor Mono;
    padding:10px;
    border-radius:${props=>(props.issent?'0px 10px 10px 10px':'10px 0px 10px 10px')} ;
`
const StyledMedia = styled.img`
  border-radius:5px;
  padding:2px;
  height:15rem;
  width:13rem;
  object-fit:cover;

  @media screen and (max-width:700px){
    height: 10rem;
    width:8rem;
  }
`

const Message = ({item, username, deleteMessage}) => {
    const [anchorEl, setAnchorEl] = useState(null)
   
    const open = Boolean(anchorEl)

    const handleClick = (event)=>{
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () =>{
        setAnchorEl(null)
    }

    const deleteMessageAndClose = (id) =>{
        deleteMessage(id)
        handleClose()
    }
  return (
    <MessagesContainer  key={item._id} issent={(item.sender===username?true:false)}>
        {item.file?<StyledMedia onClick={handleClick} src={`http://localhost:8000/uploads/${item.file}`}/>
        :<Message_ onClick={handleClick} issent = {(item.sender===username?true:false)}>{item.content}</Message_>}
        <Menu
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style:{
            display:'flex',
            margin:'none',
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'black',
            color:'red',
            boxShadow:'none',
            padding:'none',
            fontSize:'1rem',
            height:'2rem',
          }
        }}
      >
        <MenuItem onClick={()=>{deleteMessageAndClose(item._id)}}><DeleteOutlineOutlinedIcon style={{fontSize:'1rem'}}/></MenuItem>
        
      </Menu>                    
    </MessagesContainer>
  )
}

export default Message