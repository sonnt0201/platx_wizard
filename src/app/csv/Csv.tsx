'use client'

import { ThemeProvider } from "@emotion/react"
import { Box, Button, createTheme, LinearProgress, Paper, Stack, TextField, Tooltip } from "@mui/material"
import { themeConstant } from "../theme"

import { useEffect, useState } from "react";
import { DevicesManager, IDevice } from "@/models/client";
import { DeviceSelector } from "./DeviceSelector";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";
import { KeysSelector } from "./KeysSelector";
import { CsvTool } from "@/utils/CsvTool";

export const Csv = () => {

    const [device, setDevice] = useState<IDevice>()
    const [startTime, setStartTime] = useState<dayjs.Dayjs>(); // dayjs
    const [endTime, setEndTime] = useState<dayjs.Dayjs>();
    const [sampleTime, setSampleTime] = useState<number>(1000);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        console.log("time: ", startTime?.valueOf());
    }, [startTime])


    const exportCsv = async () => {
       
        if (device && startTime && endTime && selectedKeys) {
            setLoading(true)

            const result = await DevicesManager.timeseriesValues(
                device,
                startTime?.valueOf(),
                endTime.valueOf(),
                selectedKeys
            )

            const csv = new CsvTool(
                result.data,
                selectedKeys,
                sampleTime
            )



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


    return <ThemeProvider theme={createTheme(themeConstant)}>

        Csv goes here
        <Paper elevation={3} sx={{ padding: 1 }} key={"on-top-tool-box"} >
            <Stack direction="row" spacing={2}>

                <DeviceSelector onDeviceSelected={(value) => setDevice(value)} 
                   notiLoading={(value) => setLoading(value)}
                    />
                <LocalizationProvider dateAdapter={AdapterDayjs}>

                    <DateTimePicker label="Start time" onChange={(value) => {
                        if (value) setStartTime(value)

                    }} />
                    <DateTimePicker label="End time" onChange={(value) => {
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

                        value={sampleTime}
                        onChange={e => setSampleTime(Number(e.target.value))}
                    // className="w-50%"
                    />
                </Tooltip>
                
                {/* export button */}
                <Button color="secondary" variant="contained" className="!my-1"
                    onClick={exportCsv}
                    disabled={loading || (!selectedKeys) || (selectedKeys.length === 0)}
                >Export CSV</Button>

            </Stack>
        </Paper>

        {loading && <LinearProgress color="secondary"  />}
        {device
            && startTime
            && endTime
            && <KeysSelector
                device={device}
                startTs={startTime.valueOf()}
                endTs={endTime.valueOf()}
                onSelectedKeysChanged={(keys) => setSelectedKeys(keys)} 
                notiLoading={(val) => setLoading(val)}
                />}
    </ThemeProvider>
}