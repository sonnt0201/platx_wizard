
import { Suspense } from "react"
import { DeviceScheduler } from "./DeviceScheduler"
// import { useRouter } from 'next/router'

// import { createTheme } from "@mui/material"
// import { themeConstant } from "@/app/theme"




const Page = async ({
    params
}: {
    params: Promise<{ deviceId: string }>
}) => {

    // const router = useRouter()

    // if (router.isFallback) {
    //     return <div>Loading...</div>
    // }

    const deviceId = (await params).deviceId

    if (deviceId) {
        return <>
            {/* <h1>{deviceId}</h1> */}
            <Suspense fallback={<>Loading...</>}>
                <DeviceScheduler deviceId={deviceId} />
            </Suspense>




        </>
    } 

    return <>loading...</>


}

export default Page