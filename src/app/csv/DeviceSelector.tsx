'use client'

import { DevicesManager, IDevice } from "@/models/client"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
export const DeviceSelector = ({ onDeviceSelected, notiLoading, size = "medium", required = false,
    onAllDevicesLoaded
 }: {
    
    onDeviceSelected?: (value?: IDevice) => void,
    notiLoading?: (loading: boolean) => void,
    size?: "small" | "medium",
    required?: boolean,

    /**
     * mounted when all devices are fetched from thingsboard instance
     * @param devices All devices (even those hidden ones)
     * @returns 
     */
    onAllDevicesLoaded?: (devices: IDevice[]) => void,
}) => {


    const [selectedDevice, setSelectedDevice] = useState<IDevice>();
    const [allDevices, setAllDevices] = useState<IDevice[]>([]);

     const [open, setOpen] = useState(true); // 👈 control menu state


    useEffect(() => {
        updateAllUserDevices();
    }, [])

    useEffect(() => {
        if (onDeviceSelected) onDeviceSelected(selectedDevice);
        console.log("selected device: ", selectedDevice)
    }, [selectedDevice])

    const updateAllUserDevices = async () => {
        if (notiLoading) notiLoading(true);
        const list = (await DevicesManager.all())
        
        if (onAllDevicesLoaded && !list.error) onAllDevicesLoaded(list.devices);

        const visibleDevices = list.devices.filter(device => !device.name?.startsWith("_tbx_"));
        
        console.log(list)

        setAllDevices(visibleDevices);

        if (notiLoading) notiLoading(false);
    }



    return (
        <Stack direction={"row"} minWidth={120}>
            <FormControl fullWidth size={size} required={required}>
                <InputLabel id="demo-simple-select-label" color="success">Device</InputLabel>
                <Select
                    key={"0"}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedDevice?.id.id || ''}
                    label="Device"
                    autoFocus
                    open={open}                     // 👈 controlled open
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    onChange={(event: SelectChangeEvent) => {
                        const value = event.target.value as string;

                        setSelectedDevice(allDevices?.find(device => device.id.id === value));
                    }}

                    color="success"
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