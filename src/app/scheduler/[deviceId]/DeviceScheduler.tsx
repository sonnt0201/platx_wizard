'use client'

import { DevicesManager, IDevice } from "@/models/client"
import { ISchedule, SchedulerAPIsClient } from "@/models/client/Schedule";
import { Button, createTheme, Divider, LinearProgress, Paper, Snackbar, Stack, ThemeProvider, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react"
import { SchedulesList } from "./SchedulesList";

import { themeConstant } from "@/app/theme";
import { ScheduleCreatorDialog } from "./ScheduleCreatorDialog";

import { AddCircleRounded, EditNoteRounded, RemoveRedEye, VisibilityOffRounded } from "@mui/icons-material";
/**
 * After choose a device from scheduler main page, user go into this page.
 * 
 * This page is for displaying and configuring the schedule list for a chosen device
 * @param deviceId 
 * 
 * @returns 
 */
export const DeviceScheduler = ({ deviceId }: { deviceId: string }) => {

    //  { BEGIN : COMPONENT STATES}

    const [device, setDevice] = useState<IDevice>();
    const [loading, setLoading] = useState<boolean>(false);

    const [schedulesList, setSchedulesList] = useState<ISchedule[]>([])

    const [noti, setNoti] = useState<string>("");




    /**
     * if creating schedule dialog is open
     */
    const [displayCreateScheduleDialog, setDisplayCreateScheduleDialog] = useState<boolean>(false);


    /**
    * Editable to enable/disable edit mode - also enable/disable edit button
    * 
    * Editable as `true` when only one schedule is selected, false otherwise
    */
    const [editable, setEditable] = useState<boolean>(false);


    /**
     * If edit schedule dialog is open
     */
    const [displayEditScheduleDialog, setDisplayEditScheduleDialog] = useState<boolean>(false);

    /**
     * Receive selected schedules from child list
     */
    const [selected, setSelected] = useState<readonly (string | number)[]>([]);

    /**
     * Show device ID or not
     */
    const [showID, setShowID] = useState<boolean>(false);


    // { END: COMPONENT STATES }    


    // {BEGIN: COMPONENT EFFECTS}

    useEffect(() => {
        fetchDeviceWithId(deviceId).then(() => fetchScheduleList())
    }, [deviceId])


    /**
    * When selected schedule is only one, enable edit mode
    */
    useEffect(() => {
        if (selected.length === 1) {
            setEditable(true)
        } else {
            setEditable(false)
        }
    }, [selected])


    // { END: COMPONENT EFFECTS}



    // {BEGIN: COMPONENT FUNCTIONS}

    /**
     * call api to fetch device
     * 
     * @param deviceId 
     */
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
            console.error(e);
            setSchedulesList([]);
        } finally {
            setLoading(false)

        }

    }

    // const postDailySchedule = async (input: {
    //     control: string;
    //     hour: number;
    //     minute: number;
    //     second: number;
    // }) => {
    //     setLoading(true)

    //     await SchedulerAPIsClient.postDailySchedule(deviceId, input);


    //     await fetchScheduleList()

    //     setLoading(false);

    // }

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

            await SchedulerAPIsClient.deleteSchedules(deviceId, scheduleIDs)

            setNoti("Schedules deleted successfully!")

            await fetchScheduleList()

        } catch (e) {
            setNoti("Error deleting Schedules: " + (e as Error).message)
        } finally {
            setLoading(false);
        }

        setLoading(false)

    }

    const editSchedule = async (scheduleID: string, options: Partial<Omit<ISchedule, "id">>) => {
        setLoading(true);

        try {
            await SchedulerAPIsClient.editSchedule(deviceId, scheduleID, options);
            await fetchScheduleList();

            setNoti("Schedules updated!")
        } catch (e) {

            setNoti("Error updating schedules")
            console.error(e);

        } finally {
            setLoading(false)
        }

    }
    // {END: COMPONENT FUNCTIONS}

    // {BEGIN: COMPONENT RENDER}
    return (<ThemeProvider theme={createTheme(themeConstant)}>
        <Paper id="general wrapper" elevation={0}>
            {loading && <LinearProgress color="primary" />}


            <Typography color="primary" fontSize={"lg"} sx={{ fontWeight: "bolder", textAlign: "center", alignContent: 'center', marginY: 1, width: "100%" }}>
                SCHEDULE LIST
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



                <Stack direction={"row"} spacing={1} id="control bar row stack" sx={{
                    borderColor: "gray"
                }}>






                    <Tooltip title="Add a schedule">

                        <Button
                            onClick={() => setDisplayCreateScheduleDialog(true)}
                            startIcon={< AddCircleRounded color="primary" />}
                        >

                            new
                        </Button>
                    </Tooltip>

                    <Divider orientation="vertical" flexItem />

                    <Tooltip title={editable ? "Edit selected schedule" : "Select a schedule first"}>
                        <span>
                              <Button
                            onClick={() => setDisplayEditScheduleDialog(true)}
                            startIcon={< EditNoteRounded color="primary" />}
                            disabled={!editable}
                        >

                            Edit
                        </Button>
                        </span>
                      
                    </Tooltip>

                    <Divider orientation="vertical" flexItem />

                    <Tooltip title={showID ? "Hide device ID" : "Show device ID"}>

                        <Button
                            onClick={() => setShowID(!showID)}
                            startIcon={!showID ? < RemoveRedEye color="primary" /> : <VisibilityOffRounded color="primary" />}
                            // disabled={!editable}
                        >

                            Device ID
                            {/* {!showID ? `device ID`: "hide"} */}
                        </Button>
                    </Tooltip>

                   {showID && <Typography color="primary" fontSize={"md"} sx={{ fontWeight: "bolder" , alignContent: "center"}}>
                       Device:  {deviceId}
                    </Typography>}

                </Stack>




            </Paper>


            <ScheduleCreatorDialog

                open={displayEditScheduleDialog}

                onCloseClick={() => {
                    setDisplayCreateScheduleDialog(false);
                    setDisplayEditScheduleDialog(false);

                }}



                onSubmitSchedule={(input) => {

                    // if in create mode, post schedule
                    if (displayCreateScheduleDialog) {
                        postSchedule(input)
                    }

                    // if in edit mode, post edit
                    if (displayEditScheduleDialog) {
                        editSchedule(selected[0].toString(), input)
                    }


                }
                }

                placeHolder={displayEditScheduleDialog ? schedulesList.find(schedule => schedule.id == selected[0].toString()) : undefined}


            />

            <div className="m-1">
                <SchedulesList list={schedulesList} device={device}
                    onDeleteClick={(selected) => deleteSchedules(selected)}
                    onSelectedRowsChanged={(selected) => {



                        setSelected(selected)
                    }}

                    onReloadClick={() => fetchScheduleList()}
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

