'use client'

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IDevice } from '@/models/client';
import { grey } from '@mui/material/colors';
import { Typography } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: grey[100],
    // theme.palette.secondary.main,
    color: theme.palette.common.black,
    fontWeight: "bolder"
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: grey[50],
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));



export default function DevicesTables({
  rows,
  onRowClick,
  title
}: {
  rows: IDevice[],
  onRowClick?: (row: IDevice) => void,
  title?: string
}) {
  return (
    <TableContainer component={Paper} elevation={1}>
      {title && <Typography color="primary" fontSize={"lg"} sx={{ fontWeight: "bolder", textAlign: "center", alignContent: 'center', marginY: 1, width: "100%" }}>
        {title}
      </Typography>}
      <Table sx={{ minWidth: 700, }} aria-label="customized table">
        <TableHead>
          <TableRow sx={{ fontWeight: "bolder" }}>
            <StyledTableCell>Device ID</StyledTableCell>
            <StyledTableCell >Name</StyledTableCell>
            <StyledTableCell >Label</StyledTableCell>
            {/* <StyledTableCell >Profile Name</StyledTableCell> */}

          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id.id}

              sx={{
                cursor: onRowClick ? 'pointer' : '',

              }}

              onClick={() => {


                if (onRowClick) onRowClick(row)

              }




              }>
              <StyledTableCell width={"30%"} >
                {row.id.id}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row" >{row.name}</StyledTableCell>
              <StyledTableCell >{row.label}</StyledTableCell>
              {/* <StyledTableCell >{row.deviceProfileName}</StyledTableCell> */}

            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
