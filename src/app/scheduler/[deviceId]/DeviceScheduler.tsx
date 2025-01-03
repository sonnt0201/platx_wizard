'use client'

import { DevicesManager, IDevice } from "@/models/client"
import { ISchedule, SchedulerAPIsClient } from "@/models/client/Schedule";
import { Button, createTheme, Divider, LinearProgress, Paper, Stack, ThemeProvider, Typography } from "@mui/material";
import { useEffect, useState } from "react"
import { SchedulesList } from "./SchedulesList";

import { themeConstant } from "@/app/theme";
import { ScheduleCreatorDialog } from "./ScheduleCreatorDialog";
/**
 * After choose a device from scheduler main page, user go into this page.
 * 
 * This page is for configuring the schedule list for a chosen device
 * @param deviceId 
 * 
 * @returns 
 */
export const DeviceScheduler = ({ deviceId }: { deviceId: string }) => {

    const [device, setDevice] = useState<IDevice>();
    const [loading, setLoading] = useState<boolean>(false);

    const [schedulesList, setSchedulesList] = useState<ISchedule[]>([])



    /**
     * if creating schedule dialog is open
     */
    const [displayCreateScheduleDialog, setDisplayCreateScheduleDialog] = useState<boolean>(false);




    useEffect(() => {
        fetchDeviceWithId(deviceId).then(() => fetchScheduleList())
    }, [])

    const fetchDeviceWithId = async (deviceId: string) => {



        setLoading(true);

        const ret = (await DevicesManager.all())

        if (ret.devices) {
            setDevice(ret.devices.find(device => device.id.id === deviceId))

        } else {
            console.error(ret.error)
        }

        setLoading(false);

    }


    /**
     * Fetch schedule list of chosen device from DAEMON
     */
    const fetchScheduleList = async () => {

        setLoading(true);

        const list = await SchedulerAPIsClient.getSchedulesList(deviceId);

        setSchedulesList(list);



        setLoading(false)

    }

    const postDailySchedule = async (input: {
        control: string;
        hour: number;
        minute: number;
        second: number;
    }) => { 
        setLoading(true)

        await SchedulerAPIsClient.postDailySchedule(deviceId, input);

        
       await  fetchScheduleList()
        
       setLoading(false);
         
    }


    return (<ThemeProvider theme={createTheme(themeConstant)}>
        <Paper >
            {loading && <LinearProgress color="primary" />}

            <Paper elevation={2} id='control bar wrapper' sx={
                {
                    textAlign: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    // width: 'full-width', 
                }
            }>


                <Stack direction={"row"} spacing={2} id="control bar row stack">
                    <Typography color="secondary.dark" sx={{ alignContent: 'center' }}>
                        {device?.id.id}
                    </Typography>

                    <Divider orientation="vertical" flexItem />

                    <Typography color="primary" sx={{ fontWeight: "bolder", alignContent: 'center' }}>
                        {device?.name}
                    </Typography>
                    <Divider orientation="vertical" flexItem />

                    <Button color="secondary" variant="contained"
                        onClick={() => setDisplayCreateScheduleDialog(true)}
                    >

                        Add a schedule
                    </Button>
                </Stack>




            </Paper>


            <ScheduleCreatorDialog
                open={displayCreateScheduleDialog}

                onCloseClick={() => setDisplayCreateScheduleDialog(false)}

                onSubmitDailySchedule={(input) => {
                    postDailySchedule(input)
                }}
            />

            <SchedulesList list={schedulesList} />


        </Paper>
    </ThemeProvider>)

}

