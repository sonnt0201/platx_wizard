'use client'

import { DevicesManager, IDevice } from "@/models/client"
import { ISchedule, SchedulerAPIsClient } from "@/models/client/Schedule";
import { Button, createTheme, Divider, IconButton, LinearProgress, Paper, Snackbar, Stack, ThemeProvider, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react"
import { SchedulesList } from "./SchedulesList";

import { themeConstant } from "@/app/theme";
import { ScheduleCreatorDialog } from "./ScheduleCreatorDialog";
import DeleteIcon from '@mui/icons-material/Delete';
import { AddCircleRounded, BorderColor } from "@mui/icons-material";
/**
 * After choose a device from scheduler main page, user go into this page.
 * 
 * This page is for displaying and configuring the schedule list for a chosen device
 * @param deviceId 
 * 
 * @returns 
 */
export const DeviceScheduler = ({ deviceId }: { deviceId: string }) => {

    const [device, setDevice] = useState<IDevice>();
    const [loading, setLoading] = useState<boolean>(false);

    const [schedulesList, setSchedulesList] = useState<ISchedule[]>([])

    const [noti, setNoti] = useState<string>("");

    /**
     * if creating schedule dialog is open
     */
    const [displayCreateScheduleDialog, setDisplayCreateScheduleDialog] = useState<boolean>(false);




    useEffect(() => {
        fetchDeviceWithId(deviceId).then(() => fetchScheduleList())
    }, [deviceId])

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

        try {
            const list = await SchedulerAPIsClient.getSchedulesList(deviceId);

            setSchedulesList(list);
        } catch (e) {
            setSchedulesList([]);
        } finally {
            setLoading(false)

        }





    }

    const postDailySchedule = async (input: {
        control: string;
        hour: number;
        minute: number;
        second: number;
    }) => {
        setLoading(true)

        await SchedulerAPIsClient.postDailySchedule(deviceId, input);


        await fetchScheduleList()

        setLoading(false);

    }

    const postSchedule = async (input: Partial<Omit<ISchedule, "id">>) => {
        setLoading(true);

        try {
            await SchedulerAPIsClient.postSchedule(deviceId, input);
            await fetchScheduleList();

            setNoti("Schedules updated!")
        } catch (e) {

            setNoti("Error updating schedules")
            console.error(e);

        } finally {
            setLoading(false)
        }
    }


    const deleteSchedules = async (scheduleIDs: string[]) => {

        if (scheduleIDs.length === 0) {
            setNoti("No schedules selected!")
        }

        setLoading(true);

        try {

            await  SchedulerAPIsClient.deleteSchedules(deviceId, scheduleIDs)

             setNoti("Schedules deleted successfully!")

            await fetchScheduleList()

        }catch (e) {
            setNoti("Error deleting Schedules: " + (e as Error).message)
        } finally {
            setLoading(false);
        }
      







setLoading(false)
       

    }

    return (<ThemeProvider theme={createTheme(themeConstant)}>
        <Paper id="general wrapper" elevation={0}>
            {loading && <LinearProgress color="primary" />}


            <Typography color="primary" fontSize={"lg"} sx={{ fontWeight: "bolder", textAlign: "center", alignContent: 'center', marginY: 1, width: "100%" }}>
                Schedule List
            </Typography>

            <Paper elevation={2} id='control bar wrapper' sx={
                {
                    textAlign: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    margin: 1,
                    padding: 1,
                    // width: 'full-width', 
                }
            }>



                <Stack direction={"row"} spacing={2} id="control bar row stack" sx={{
                    borderColor: "gray"
                }}>





                    {/* <Divider orientation="vertical" flexItem /> */}

                    <Typography color="primary" sx={{ alignContent: 'center', fontWeight: "bold", paddingLeft: 2 }}>
                        Tools
                    </Typography>

                    <Divider orientation="vertical" variant="middle" flexItem />

                    {/* <Button color="secondary" variant="contained"
                        onClick={() => setDisplayCreateScheduleDialog(true)}
                    >

                        Add a schedule
                    </Button> */}

                    <Tooltip title="Add a schedule">

                        <Button 
                        onClick={() => setDisplayCreateScheduleDialog(true)}
                        startIcon={  <AddCircleRounded color="primary" />}
                        >

                          create
                        </Button>
                    </Tooltip>



                </Stack>




            </Paper>


            <ScheduleCreatorDialog

                open={displayCreateScheduleDialog}

                onCloseClick={() => setDisplayCreateScheduleDialog(false)}

                onSubmitSchedule={(input) => {
                    postSchedule(input)
                }}


            />

            <div className="m-1">
                <SchedulesList list={schedulesList} device={device}
                    onDeleteClick={(selected) => deleteSchedules(selected)}
                />

            </div>



        </Paper>

        <Snackbar
            id="snackbar to noti error"
            open={noti?.length > 0}
            autoHideDuration={6000}
            onClose={() => setNoti("")}
            message={noti}

        />
    </ThemeProvider>)

}

