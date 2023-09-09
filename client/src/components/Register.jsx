import React,{useState}from 'react'
import styled from 'styled-components'
import api from '../api'
import Box from '@mui/material/Box'
import { TextField, Button } from '@mui/material'
import { Link } from 'react-router-dom'
const Page = styled.div`
    width:100vw;
    height:100vh;
    background: linear-gradient(to bottom left, #000000, #434343);
    display:flex;
    justify-content:center;
    align-items:center;
    color:white;
`
const StyledBox = styled(Box)`
    width: 40vw;
    display:flex;
    gap:1rem;
    flex-direction:column;
    padding:10px;
    background:white;

    @media screen and (max-width:600px){
        width:90%;
        min-height:40%;
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

const Register = () => {
    const [username , setUsername] = useState('')
    const [password,setPassword ]=useState('');
    const [email,setEmail] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    const register = async()=>{
        try{
            const response = await api.post('/register',{username,email,password})
            console.log(response.data,'login now')
        }catch(error){
            console.log(error)
        }
    }

  return (
    <Page>
        <StyledBox>
            <Header>Register</Header>
            <StyledTextField label="Enter Username" onChange={(e)=>{setUsername(e.target.value)}}/>
            <StyledTextField label="Enter Email" onChange={(e)=>{setEmail(e.target.value)}}/>
            <StyledTextField label="Password" onChange={(e)=>{setPassword(e.target.value)}}/>
            <StyledTextField label="Confirm Password"/>
            <StyledButton variant='contained' sx={{backgroundColor:'black'}} onClick={register}>REGISTER</StyledButton>
        </StyledBox>
    </Page>
  )
}

export default Register