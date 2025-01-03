'use client'

import { DevicesManager, IDevice } from "@/models/client"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from "react";
import {  Stack } from "@mui/material";
export const DeviceSelector = ({ onDeviceSelected, notiLoading }: {
    onDeviceSelected?: (value?: IDevice) => void,
    notiLoading?: (loading: boolean) => void
}) => {


    const [selectedDevice, setSelectedDevice] = useState<IDevice>();
    const [allDevices, setAllDevices] = useState<IDevice[]>([]);
    
    useEffect(() => {
        updateAllDevices();
    }, [])

    useEffect(() => {
        if (onDeviceSelected) onDeviceSelected(selectedDevice);
        console.log("selected device: ", selectedDevice)
    }, [selectedDevice])

    const updateAllDevices = async () => {
        if (notiLoading) notiLoading(true);
        const list = await DevicesManager.all();
        console.log(list)
        setAllDevices(list.devices);

        if (notiLoading) notiLoading(false);
    }



    return (
        <Stack direction={"row"} minWidth={120}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Device</InputLabel>
                <Select
                    key={"0"}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedDevice?.id.id || ''}
                    label="Device"
                    onChange={(event: SelectChangeEvent) => {
                        const value = event.target.value as string;

                        setSelectedDevice(allDevices?.find(device => device.id.id === value));
                    }}
                >
                    {
                        (allDevices.length > 0) && allDevices?.map((device, index) => <MenuItem key={index} value={device.id.id || ''}>{device.name}</MenuItem>)
                    }

                </Select>
                
            </FormControl>
            {/* <CircularProgress /> */}
        </Stack>

        

    )
}