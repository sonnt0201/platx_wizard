'use client'

import { createTheme, LinearProgress, Paper, Stack, ThemeProvider } from "@mui/material"

import { themeConstant } from "../theme"
import DevicesTables from "@/components/DevicesTable"
import { DevicesManager, IDevice } from "@/models/client"
import { useEffect, useState } from "react"

export const Scheduler = () => {


    const [loading, setLoading] = useState<boolean>(false)

    // all devices of customer
    const [devices, setDevices] = useState<IDevice[]>([])

    useEffect(() => {
        updateAllDevices();
    }, [])


    /**
     * Fetch all devices of customer
     * 
     * Assign result to `devices` state
     */
    const updateAllDevices = async () => {
        setLoading(true);
        const ret = await DevicesManager.all()

        if (ret.devices) {
            setDevices(ret.devices)
        } else {
            console.error(ret.error)
        }

        setLoading(false);

    }

    return (
        <ThemeProvider theme={createTheme(themeConstant)}>
            {loading && <LinearProgress color="primary" />}

            <Paper id="wrapper for table" sx={{margin: 2}} >

                <Stack id={"Wrapper"} direction={"column"}>

                    <DevicesTables rows={devices} 
                    onRowClick={(row) => {
                        console.log(row)

                        window.location.replace(`scheduler/${row.id.id}`)

                    }}
                    />

                </Stack>
            </Paper>


        </ThemeProvider>

    )
}