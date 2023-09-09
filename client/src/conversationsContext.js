import {createContext,useContext,useState} from 'react'

export const ConversationsContext = createContext()

export const ConversationsProvider = ({children})=>{
    const [conversations,setConversations] = useState([])
    const [conversationId,setConversationId] = useState('')
    const [selectedConversation,setSelectedConversation] = useState({})
   
    return(
    <ConversationsContext.Provider value={{ conversations, setConversations, conversationId,setConversationId, selectedConversation, setSelectedConversation }}>
      {children}
    </ConversationsContext.Provider>
    )
}