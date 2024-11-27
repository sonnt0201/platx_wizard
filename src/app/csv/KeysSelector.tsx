'use client'

import { DevicesManager, IDevice } from "@/models/client"
import { Checkbox, FormControlLabel, FormGroup, Stack } from "@mui/material";
import { useEffect, useState } from "react";

export const KeysSelector = ({
    device,
    startTs,
    endTs,
    onSelectedKeysChanged
}: {

    device: IDevice,
    startTs: number,
    endTs: number,
    onSelectedKeysChanged?: (values: string[]) => void
}) => {

    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set<string>([]));
    const [allKeys, setAllKeys] = useState<string[]>([]);

    useEffect(() => {
        updateAllKeysList();
    }, [device, startTs, endTs])

    useEffect(() => {
       if (onSelectedKeysChanged) onSelectedKeysChanged([...selectedKeys])
    },[selectedKeys])

    const updateAllKeysList = async () => {
        const list = await DevicesManager.timeseriesKeys(device, startTs, endTs);
        if (!list.error) setAllKeys(list.keys);


    }

    return <><FormGroup>


        <Stack direction={"row"}>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
            {
                allKeys.map((val, index) =>
                    <FormControlLabel
                        key={index}
                        checked={selectedKeys?.has(val)}
                        control={<Checkbox onChange={(_, checked) => {
                            setSelectedKeys(prev => {
                                const updated = new Set(prev);
                                if (checked) {
                                    updated.add(val);
                                } else {
                                    updated.delete(val);
                                }

                                return updated;
                            })
                        }} />}
                        label={val}

                    />)
            }
        </Stack>

    </FormGroup></>
}