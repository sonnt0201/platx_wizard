import { ISchedule } from "@/models/client/Schedule"
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import dayjs from "dayjs";

import duration from "dayjs/plugin/duration"


dayjs.extend(duration);

/**
 * Table to show schedule list
 */
export const SchedulesList = ({
    list
}: {
    list: ISchedule[]
}) => {

    /**
     * Display repeat time in readable format
     */
    // const repeatTimeText = (row: ISchedule) => {
    //     let text = "";
    //     let durationMillisec = row.repeatTime;


    //   text +=  (durationMillisec > MillisecondsOption.ONE_DAY) ? durationMillisec / MillisecondsOption.ONE_DAY + " days " : "";

    //   text +=   durationMillisec / MillisecondsOption.ONE_HOUR + " hours";

    

    //   return text;
        
    // }


    return (<TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead >
                <TableRow>
                    <TableCell>Schedule ID</TableCell>
                    <TableCell>Next Timeout</TableCell>
                    <TableCell >Control</TableCell>
                    <TableCell >Repeat Time</TableCell>

                </TableRow>
            </TableHead>
            <TableBody>
                {list.map((row) => (
                    <TableRow
                        key={row.id}
                    // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="td" scope="row" width={"30%"}>
                            {row.id}
                        </TableCell>
                        <TableCell>{dayjs(row.incomingTime).format("HH:mm:ss DD/MM/YYYY")}</TableCell>
                        <TableCell>{row.control}</TableCell>
                        <TableCell >{}</TableCell>
                        {/* <TableCell align="right">{row.protein}</TableCell> */}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>)


}