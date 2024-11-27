'use client'


import { Auth, DevicesManager, User } from "@/models/client"
import { useEffect } from "react"

export const AuthCheck = () => {

    useEffect(() => {
        if (!Auth.state.username) window.location.replace("/login");

        printDevices();

    },[])

    const printUser = async () => {
       const current = await User.current();

       console.log(current);
    }

    const printDevices = async () => {
        const list = await DevicesManager.all();
        console.log(list)
    }

    return <>
    checking auth
    </>

}