import React,{useEffect,useState} from 'react'

const useDebounce = (value,delay=1000) => {
    const [debouncedValue,setDebouncedValue] = useState(value)
    const [loading,setLoading] = useState(false)
    useEffect(()=>{
        setLoading(true)
        const id = setTimeout(()=>{
            setDebouncedValue(value);
            
        },delay)

        return ()=>{        
            clearTimeout(id)
            setLoading(false)
        }
    },[value,delay])
  return debouncedValue
  
}

export default useDebounce