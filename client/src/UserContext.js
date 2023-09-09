import { createContext,useState,useEffect } from "react";
import api from './api'

export const UserContext = createContext({})

export const ProviderUser = ({children}) =>  {
    const [user,setUser] = useState(null)
    const [expired,setExpired] = useState(false)
    useEffect(()=>{
        const data = localStorage.getItem('user')
        if(data){
            const parseData = JSON.parse(data)
            setUser(parseData)
            api.defaults.headers.common['Authorization'] = `Bearer ${parseData.token}`
        }
        
    },[])
    
    return (
        <UserContext.Provider value = {{user,setUser,expired,setExpired}}>
            { children }
        </UserContext.Provider>
    )
}



