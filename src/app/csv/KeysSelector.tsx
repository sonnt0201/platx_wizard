'use client'

import { DevicesManager, IDevice } from "@/models/client"
import { Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";

export const KeysSelector = ({
    device,
    startTs,
    endTs,
    invalidKeys,
    onSelectedKeysChanged,
    notiLoading
}: {
    device: IDevice,
    startTs: number,
    endTs: number,
    invalidKeys?: string[],
    onSelectedKeysChanged?: (values: string[]) => void,
    notiLoading?: (loading: boolean) => void
}) => {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [allKeys, setAllKeys] = useState<string[]>([]);

    useEffect(() => {
        updateAllKeysList();
    }, [device, startTs, endTs]);

    useEffect(() => {
        if (onSelectedKeysChanged) onSelectedKeysChanged(selectedKeys);
    }, [selectedKeys]);

    const updateAllKeysList = async () => {
        if (notiLoading) notiLoading(true);
        const list = await DevicesManager.timeseriesKeys(device, startTs, endTs);
        if (!list.error) setAllKeys(list.keys);
        if (notiLoading) notiLoading(false);
    };

    return (
        <Stack direction="row" flexWrap="wrap" gap={1}>
            <ToggleButtonGroup
                value={selectedKeys}
                onChange={(_, newSelected) => {
                    setSelectedKeys(newSelected);
                }}
                aria-label="keys selector"
            >
                {allKeys.map((val, index) => (
                    <ToggleButton
                        key={index}
                        value={val}
                        aria-label={val}
                        disabled={invalidKeys?.includes(val)}
                        sx={{
                            textTransform: "none", // keep original text
                            px: 2,
                            py: 1,
                        }}
                    >
                        {val}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Stack>
    );
};
