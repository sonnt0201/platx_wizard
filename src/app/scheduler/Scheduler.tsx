'use client'

import { createTheme, LinearProgress, Paper, Stack, ThemeProvider, Typography } from "@mui/material"

import { themeConstant } from "../theme"
import DevicesTables from "@/components/DevicesTable"
import { DevicesManager, IDevice } from "@/models/client"
import { useEffect, useState } from "react"
import { DeviceScheduler } from "./[deviceId]/DeviceScheduler"

export const Scheduler = () => {


    const [loading, setLoading] = useState<boolean>(false)

    // all devices of customer
    const [devices, setDevices] = useState<IDevice[]>([])

    const [selectedDeviceID, setSelectedDeviceID] = useState<string>();

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

            <Paper id="outside wrapper for all" sx={{ margin: 2 }} elevation={0}>




                <Stack id={"Wrapper for all"} direction={"row"} spacing={2}>

                    {/* <Paper id = "wrapper for device table" elevation={0} > */}


                      
                        <div className={`${selectedDeviceID ? 'w-5/12' : `w-screen`}`}>
                        <DevicesTables
                        
                        title="DEVICES"

                        rows={devices}
                            onRowClick={(row) => {
                                console.log(row)

                                setSelectedDeviceID(row.id.id)
                                // window.location.replace(`scheduler/${row.id.id}`)

                            }}
                        />
                        </div>
                     

                    {/* </Paper> */}



                    {selectedDeviceID && <DeviceScheduler deviceId={selectedDeviceID} />}

                </Stack>
            </Paper>


        </ThemeProvider>

    )
}