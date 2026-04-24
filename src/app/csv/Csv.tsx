'use client'

import { ThemeProvider } from "@emotion/react"
import { Alert, Box, Button, createTheme, LinearProgress, Paper, Snackbar, Stack, TextField, Tooltip } from "@mui/material"
import { themeConstant } from "../theme"

import { useEffect, useState } from "react";
import { DevicesManager, IDevice } from "@/models/client";
import { DeviceSelector } from "./DeviceSelector";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";
import { KeysSelector } from "./KeysSelector";
import { CsvTool } from "@/app/csv/CsvTool";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { GridColDef } from "@mui/x-data-grid";
import DatasetIcon from '@mui/icons-material/Dataset';
import { ClientError } from "@/models/client/ClientErrorBase";

/** Monitor for CSV Tool service as a thingsboard device with _tbx_prefix */
const SERVICE_MONITOR_DEVICE_NAME = "_tbx_CsvTool"
// type TimeFormat = "readable" | "timestamp"

export const Csv = () => {

    // selected device
    const [device, setDevice] = useState<IDevice>()

    // start time of csv records
    const [startTime, setStartTime] = useState<dayjs.Dayjs>(); // dayjs
    const [endTime, setEndTime] = useState<dayjs.Dayjs>(); // end time of csv records 
    const [sampleTime, setSampleTime] = useState<number>(1000); // sample time of device, fetch from server or choose optionally
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]); // keys to export, keys of timeserires values, etc: pir array has top, right, left, ... keys

    /** temporary save key that invalid (no timeseries data found for those keys)  */
    const [, setInvalidKeys] = useState<string[]>([]);

    const [dataColDefs, setDataColDefs] = useState<unknown[]>([]); // columns for data grid
    const [dataGridRows, setDataGridRows] = useState<unknown[]>([]); // rows for data grid

    const [notification, setNotification] = useState<INotification>();

    // if widget is loading or not, common for all components
    const [loading, setLoading] = useState<boolean>(false);

    const [serviceMonitor, setServiceMonitor] = useState<IDevice>();
    // const [timeFormat, setTimeFormat] = useState<TimeFormat>("readable");

    useEffect(() => {
        console.log("time: ", startTime?.valueOf());
    }, [startTime])

    useEffect(() => {
        // console.log(Auth.tokenInfo)

        createServiceMonitor();
    }, [])

    useEffect(() => {
        updateSampleTime()
    }, [device])

    useEffect(() => {
        pingServiceMonitor();
    }, [serviceMonitor])

    /** Monitor for CSV Tool service as a thingsboard device with _tbx_prefix */
    const createServiceMonitor = async () => {

        const result = await DevicesManager.createNewDevice({
            name: SERVICE_MONITOR_DEVICE_NAME,
            label: SERVICE_MONITOR_DEVICE_NAME,
            description: "[Private Internal] Monitor device for IoT Platform Extension's CSV Tool feature",
        })

        if (result.error === ClientError.HTTP_BAD_REQUEST) {
            console.log("Monitor device already created, skip")
        }


    }

    /** Just noti "hey, someone access this service!" */
    const pingServiceMonitor = async () => {
        if (!serviceMonitor) return;
        const monitorCred = await DevicesManager.getCredentials(serviceMonitor);


        const pingContent =  {
                agent: navigator.userAgent,
                mode: process.env.NODE_ENV,
            }

        await DevicesManager.postTelemetry(
            monitorCred.credentials,
            "accessSession",
            pingContent
        )
    }

    const updateDataGridRows = async () => {
        if (device && startTime && endTime && selectedKeys) {
            setLoading(true)

            const result = await DevicesManager.timeseriesValues(
                device,
                startTime?.valueOf(),
                endTime.valueOf(),
                selectedKeys
            )

            // console.log("result.data: ", result.data)
            console.log("selectedKeys: ", selectedKeys)


            const csv = new CsvTool(
                result.data,
                selectedKeys,
                sampleTime
            )

            const dataGridRows = csv.toGridRowsData();
            const dataColDefs = csv.toGridColumnsDefinition();
            setDataGridRows(dataGridRows);
            setDataColDefs(dataColDefs);
            setInvalidKeys(csv.invalidKeys)
            setLoading(false);
            setNotification({
                severity: "success",
                timestamp: Date.now(),
                message: `Loaded ${dataGridRows.length} rows of ${selectedKeys.length} keys`
            })

        }
    }

    useEffect(() => {
        updateDataGridRows()
    }, [device, startTime, endTime, selectedKeys, sampleTime])

    const exportCsv = async () => {

        if (device && startTime && endTime && selectedKeys) {
            setLoading(true)

            setNotification({ message: `Exporting data of ${selectedKeys.length} keys...`, severity: "info", timestamp: Date.now() })

            const result = await DevicesManager.timeseriesValues(
                device,
                startTime?.valueOf(),
                endTime.valueOf(),
                selectedKeys
            )

            // console.log("result.data: ", result.data)
            console.log("selectedKeys: ", selectedKeys)

            const csv = new CsvTool(
                result.data,
                selectedKeys,
                sampleTime
            )

            //  console.log("csv string: ", csv.toCsvString())

            const csvString = csv.toCsvString();

            // create object and download
            const blob = new Blob([csvString], { type: 'text/csv' });

            const url = window.URL.createObjectURL(blob)

            // Creating an anchor(a) tag of HTML 
            const a = document.createElement('a')

            // Passing the blob downloading url  
            a.setAttribute('href', url)

            // Setting the anchor tag attribute for downloading 
            // and passing the download file name 
            a.setAttribute('download', `${startTime.valueOf()}-${endTime.valueOf()}.csv`);

            // Performing a download with click 
            a.click()

            setLoading(false);

        }

    }



    // fetch sample time of selected device from tb server
    const updateSampleTime: () => void = async () => {
        if (!device) return 0;
        const result = await DevicesManager.getCredentials(device)

        if (result.error) return 0;
        if (!result.credentials) return 0;

        try {
            const timeResult = await DevicesManager.getSharedAttribute<number>(result.credentials, "sampleTime");
            if (timeResult.error) return 0;

            if (timeResult.values) {
                setSampleTime(timeResult.values);
                return;
            }

        } catch (e) {
            console.error(e);
        }

        return 0;
    }

    const theme = createTheme({
        ...themeConstant,
        palette: {
          ...themeConstant.palette,
          mode: 'light',
        },
      });

    return (<ThemeProvider theme={theme}>


        <Paper elevation={3} sx={{ padding: 2, margin: 2 }} key={"on-top-tool-box"}   >

            <Stack direction={"column"} spacing={1}>

                <Stack direction="row" spacing={3} alignItems={"center"}>

                    <DeviceSelector onDeviceSelected={(value) => setDevice(value)}
                        notiLoading={(value) => setLoading(value)}
                        required
                        size="small"
                        onAllDevicesLoaded={(devices) => {
                            const monitor = devices.find(d => d.name === SERVICE_MONITOR_DEVICE_NAME);
                            if (monitor) setServiceMonitor(monitor);
                        }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>

                        <DateTimePicker label="Start time"

                            slotProps={{
                                textField: {
                                    size: "small", // 👈 makes the input smaller,
                                    required: true,
                                },
                            }}

                            onChange={(value) => {
                                if (value) setStartTime(value)

                            }} />
                        <DateTimePicker label="End time"
                            slotProps={{
                                textField: {
                                    size: "small", // 👈 makes the input smaller
                                    required: true,
                                },
                            }}
                            onChange={(value) => {
                                if (value) setEndTime(value)

                            }} />

                    </LocalizationProvider>

                    <Tooltip title="Time step between each telemetry value">
                        <TextField
                            id="outlined-number"
                            label="Sample time(ms)"
                            type="number"
                            slotProps={{
                                inputLabel: {
                                    shrink: true,

                                },
                            }}
                            size="small"

                            value={sampleTime}
                            onChange={e => setSampleTime(Number(e.target.value))}
                        // className="w-50%"
                        />
                    </Tooltip>
                    {/* export button */}
                    <Button color="secondary" variant="contained" className="!my-1"
                        onClick={exportCsv}
                        disabled={loading || (!selectedKeys) || (selectedKeys.length === 0)}

                        startIcon={<DatasetIcon />}
                    >Export CSV</Button>

                </Stack>

                <LinearProgress
                    color="primary"
                    sx={{
                        visibility: loading ? "visible" : "hidden",
                    }}
                />

                {device
                    && startTime
                    && endTime
                    && <KeysSelector
                        device={device}
                        // invalidKeys={invalidKeys}
                        startTs={startTime.valueOf()}
                        endTs={endTime.valueOf()}
                        onSelectedKeysChanged={(keys) => setSelectedKeys(keys)}
                        notiLoading={(val) => setLoading(val)}
                    />}
                {
                    (device && startTime && endTime && selectedKeys && !loading) &&
                    <Box sx={{ height: 450, width: '100%' }}>
                        <DataGrid
                            rows={dataGridRows || []}
                            columns={dataColDefs as GridColDef[] || []}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 20,
                                    },
                                },
                            }}
                            pageSizeOptions={[5]}
                            rowHeight={30}
                        // checkboxSelection
                        // disableRowSelectionOnClick
                        // editMode={"cell"}
                        />
                    </Box>
                }

                <Snackbar
                    open={notification !== undefined}
                    autoHideDuration={6000}
                    onClose={() => setNotification(undefined)}

                >
                    <Alert onClose={() => setNotification(undefined)}
                        severity={notification?.severity} sx={{ width: '100%' }}>
                        {notification?.message}
                    </Alert>
                </Snackbar>

            </Stack>
        </Paper>


    </ThemeProvider>)
}

