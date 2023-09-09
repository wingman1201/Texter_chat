import React,{useState,useEffect} from 'react'
import { Autocomplete,TextField } from '@mui/material'
import PhonelinkRingOutlinedIcon from '@mui/icons-material/PhonelinkRingOutlined';
import useDebounce from '../hooks/useDebounce'
import api from '../api'
import styled from 'styled-components'
import UserList from './UserList'
const SearchInput = styled.input`
    width:100%;
    outline:none;
    border-bottom:1px solid rgba(0,0,0,0.4);
    border-top:1px solid rgba(0,0,0,0.4);
    padding:15px;
    background:none;
    color:beige;
    font-size:1rem;
`
const SearchResultList = styled.div`
    width:100%;
    display:flex;
    flex-direction:column;
    position:absolute;
    gap:1px;
    top:100%;
    z-index:100;
`
const ListItem = styled.div`
    display:flex;
    width:100%;
    padding:10px;
    height:3rem;
    background:black;
    justify-content:space-between;
    padding-left:20px;
    color:white;
    align-items:center;
    gap:10px;

    :hover{
        cursor:pointer;
      }
`
const ConnectBtn = styled(PhonelinkRingOutlinedIcon)`

`

const SearchUser = ({searchTerm,setSearchTerm,options,onUserClick}) =>{
//     const user = JSON.parse(localStorage.getItem('user'))
//     const token = user.token
//     const [searchTerm , setSearchTerm]  = useState('')
//     const [options,setOptions] = useState([])
    

//     const fetchUsers = async(value)=>{
        
//         try{
//             let response = await api.post('/search',{key:value},{
//                 headers:{
//                     Authorization:`Bearer ${token}`
//                 }
//             })

//             if(response && response.data){
//                 setOptions(response.data.map((user)=>({username:user.username,id:user._id})))
//             }
//         }catch(error){
//             setOptions([])
//         }
//     }
//     const debouncedSearchValue = useDebounce(searchTerm,1000)
//     useEffect(()=>{
//         console.log(debouncedSearchValue)
//         fetchUsers(debouncedSearchValue)
        
//     },[debouncedSearchValue])
    
//    useEffect(()=>{
//     console.log(options)
//    },[options])
  
    return(
        <div style={{position:'relative'}}>
            <SearchInput placeholder='Search User' onBlur={()=>{setSearchTerm('')}} onChange={(e)=>setSearchTerm(e.target.value)} value={searchTerm}/>
            
            <SearchResultList>
                {
                   
                    options.map((option)=>{
                        return(<ListItem key={option.id} onClick={()=>{onUserClick(option.username)}}>{option.username}<ConnectBtn style={{fontSize:'1rem'}}/></ListItem>)
                    })
                }
            </SearchResultList>
            
        </div>
    )
}

export default SearchUser