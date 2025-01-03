'use client'

import { AuthCheck } from "@/components"
import { Scheduler } from "./Scheduler"

const Page = () => {


    // const deviceId = "device id goes here"

    return <>
        <AuthCheck />
        <Scheduler />
    </>
}


export default Page