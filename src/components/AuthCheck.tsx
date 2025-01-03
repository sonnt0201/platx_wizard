'use client'


import { Auth, DevicesManager } from "@/models/client"
import { useEffect } from "react"

export const AuthCheck = ({
    onStartImplicitLogin,
    onFinishImplicitLogin
}: {
    onStartImplicitLogin?: () => void,
    onFinishImplicitLogin?: () => void
}) => {

    useEffect(() => {
       
        doImplicitLogin()
        

        printDevices();

    },[])

    const doImplicitLogin = async() => {

        if (onStartImplicitLogin) onStartImplicitLogin();

        if (!Auth.state.username
            || (Auth.state.refreshToken && Auth.isExpired(Auth.state.refreshToken))
        ) window.location.replace("/login");
        
        if (Auth.isExpired(Auth.state.token)) {
            const result = await Auth.doRefreshToken();
            if (result.error) {
                window.location.replace("/login");
            }
        }

      
        
        if (onFinishImplicitLogin) onFinishImplicitLogin();
       
    }

   

    const printDevices = async () => {
        const list = await DevicesManager.all();
        console.log(list)
    }

    return <>
   
    </>

}