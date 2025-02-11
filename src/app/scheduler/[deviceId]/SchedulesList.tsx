import { ISchedule } from "@/models/client/Schedule"
import * as React from 'react';

import TableContainer from '@mui/material/TableContainer';

import Paper from '@mui/material/Paper';
import dayjs from "dayjs";
// import ms from "ms";
import duration from "dayjs/plugin/duration"
import ms from "ms";
import EnhancedTable from "@/components/EnhancedTable";
import { IDevice } from "@/models/client";


dayjs.extend(duration);

/**
 * Table to show schedule list
 */
export const SchedulesList = ({
    list,
    device,
    onDeleteClick,
    onSelectedRowsChanged,
    onReloadClick
}: {
    list: ISchedule[],
    device?: IDevice,
    /**
     * Notify parent when delete button is clicked
     * @param selected string array as list of selected devices' ids to be deleted
    
     */
    onDeleteClick?: (selected: string[]) => void,
    onSelectedRowsChanged?: (selected: readonly (string | number)[]) => void,
    onReloadClick?: () => void
}) => {

    
    return (<TableContainer component={Paper}>
        <EnhancedTable<ISchedule> 
        
        title={device? device.name : ""}

        columns={[
            {
                keyMap: "id",
                label: "Schedule ID",

            },
            {
                keyMap: "incomingTime",
                label: "Next Deadline",
                formatDisplay: (value) => {
                    return dayjs(value).format("HH:mm:ss DD/MM/YYYY")
                },
            },
            {
                keyMap: "repeatTime",
                label: "Period",
                formatDisplay: (val) => {
                    if (typeof val === 'number') return ms(val, {
                        long: true
                    })

                    return ""
                },

            },
            {
                keyMap: "repeatCount",
                label: "Remaining Counts",
                formatDisplay: (val) => {

                    if (typeof val === 'number') {
                        return val >= 0 ? val : "Indefinite"
                    }

                    return "Type Error"

                }
            },
            {
                keyMap: "control",
                label: "Control"
            }
        ]}

            rows={list} 
        //   label = {"Schedules"}
        onDeleteClick={(selected) => {

            const selectedStr = selected.map(s => s.toString())
            
            onDeleteClick?.(selectedStr)
            // console.log("Deleting: ",selected )
        }}

        onSelectedRowsChanged={(selected) => {
            console.log("Selected: ",selected)

            onSelectedRowsChanged?.(selected)
        }}

        onReloadClick={() => {
            onReloadClick?.()
        }}
        />


    </TableContainer>)


}