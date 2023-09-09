import React, { useContext } from 'react'
import {useState,useEffect} from 'react'
import styled from 'styled-components'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import { TextField, Button} from '@mui/material'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext'
import io from 'socket.io-client'
import Typewriter from 'typewriter-effect'
import {toast, ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"

const Page = styled.div`
    width:100vw;
    height:100vh;
    background: linear-gradient(to bottom left, #000000, #434343);
    display:flex;
    align-items:center;
    color:white;

    @media screen and (max-width:720px){
        justify-content:center;
        align-items:center;
        flex-direction:column;
        padding:10px;
    }
`
const StyledBox = styled(Box)`
    width: 25%;
    height:100%;
    
    display:flex;
    gap:1rem;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    padding:10px;
    background:white;

    @media screen and (max-width:720px){
        width:90%;
        height:60%;
        min-height:40%;
        order:2;
    }
`
const StyledTextField = styled(TextField)`
    width:100%;
    color:black;
`
const StyledButton = styled(Button)`
    width:100%;
    height:3.5rem;
    color:white;
`
const StyledParagraph = styled.p`
    font-size:1rem;
    color:black;
    width:100%;
    text-align:center;
`
const Header = styled.div`
    display:flex;
    width:100%;
    align-items:center;
    justify-content:center;
    font-weight:400;
    font-size:1.5rem;
    color:black;
`

const HeroTextContainer = styled.div`
    width:100%;
    justify-content:center;
    display:flex;
    flex-direction:column;
    align-items:center;
    padding:10px;
    color:white;
`
const HeroText = styled.h1`
    font-family: 'Victor Mono', monospace;
    font-size:6rem;
    background: -webkit-linear-gradient(to right, #24C6DC, #333);
    background: linear-gradient(to right, #24C6DC, #514A9D);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media screen and (max-width:720px){
    font-size:4rem;
  }

`



const Login = () => {
    const socket = io('http://localhost:8000')
    const {setUser,user} = useContext(UserContext)
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const Navigate = useNavigate()
    const handleSubmit = async(e)=>{
        e.preventDefault()
        try{
            const res = await api.post('/login',{username,password})
            if(res.status === 200){
                const userData = res.data
                setUser(userData)
                socket.emit('userConnected',username)
                localStorage.setItem('user',JSON.stringify(userData))
                Navigate('/')
            }else{
                console.log('no user found in handleSubmit at login.jsx')
            }
        }catch(err){
            console.log(err)
            toast(err.response.data.error)
        }
    }

    
  return (
    <Page>
        <StyledBox>
            <Header>Sign in</Header>
            <StyledTextField label="Username" onChange={(e)=>{setUsername(e.target.value)}}/>
            <StyledTextField  label="Password" type='password' onChange={(e)=>{setPassword(e.target.value)}}/>
            <StyledButton variant="contained" sx={{backgroundColor:'black'}} onClick={handleSubmit}>SIGN IN</StyledButton>
            <StyledParagraph>Not a user? <Link to={'/register'}>Register</Link> here</StyledParagraph>
        </StyledBox>
        <HeroTextContainer>
            <HeroText>Texter</HeroText>
            <Typewriter
                
                options={{
                    strings:['Welcome to texter!','Login to start chatting..'],
                    autoStart:true,
                    loop:false,
                    pauseFor:1500,
                    skipAddStyles:true,
                    wrapperClassName:'typewriterText'
                }}
            />
        </HeroTextContainer>
        <ToastContainer style={{color:'red'}}/>
    </Page>
  )
}

export default Login