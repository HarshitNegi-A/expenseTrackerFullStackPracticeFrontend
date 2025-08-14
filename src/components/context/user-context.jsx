import { createContext, useEffect, useState } from "react";

const UserContext=createContext({});

export const UserProvider=({children})=>{
    const [user,setUser]=useState(null)

    useEffect(()=>{
        const storedUser=localStorage.getItem("user");
        if(storedUser){
            setUser(JSON.parse(storedUser))
        }
    },[])

    const updateUser=(userData)=>{
        setUser(userData)
        localStorage.setItem("user",JSON.stringify(userData))
    }

    const cleanUser=()=>{
        setUser(null)
        localStorage.removeItem("user")
    }

    return(
        <UserContext.Provider value={{user,updateUser,cleanUser}}>{children}</UserContext.Provider>
    )

}


export default UserContext;