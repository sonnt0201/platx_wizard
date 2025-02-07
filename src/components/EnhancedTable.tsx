/**
 * 2/2025 by Thai-Son Nguyen
 * 
 * Highly reusable table component based on React + TypeScript + MUI Component
 * 
 */

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';

/**
 * Define columns' headers for table
 */
interface Column<T> {
  /**
   * ID for column header, also `key` props of the generic Data Type
   */
  keyMap: keyof T;

  /**
   * Alias name to be displayed as header
   */
  label: string;
  /**
   * If data of column is numeric
   */
  numeric?: boolean;

  /**
   * Function to format column value before displayed
   * 
   * @param value  Column value type, also type for property of `keyMap`
   */
  formatDisplay?: <ColType>(value: T[keyof T]) => string | number;
}

interface GenericTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  title: string;
  onSelectedRowsChanged?: (selected: readonly (string | number)[]) => void;
  onDeleteClick?: (selected: readonly (string | number)[]) => void,

}

export default function EnhancedTable<T extends { id: string | number }>({
  columns,
  rows,
  title,
  onSelectedRowsChanged,
  onDeleteClick,

}: GenericTableProps<T>) {
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof T | ''>('');
  const [selected, setSelected] = React.useState<readonly (string | number)[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string | number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly (string | number)[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  /**
   * Reset `seleted` when `rows` change.
   * 
   * When rows (also table data) changes (notified by parent), `selected`
   * must be reset to `[]` in case old seleted rows are kept
   */
  React.useEffect(() => {
    setSelected([])
  },[rows])

  /**
   * Noti changes of selected rows to parent component
   */
  React.useEffect(() => {
    onSelectedRowsChanged?.(selected)
  }, [selected])


  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar>
          <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div">
            {title}
          </Typography>
          {selected.length > 0 ? (
            <Tooltip title="Delete">
              <IconButton onClick={() => onDeleteClick?.(selected)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Filter list">
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} size={dense ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < rows.length}
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={String(column.keyMap)}
                    align={column.numeric ? 'right' : 'left'}
                    sortDirection={orderBy === column.keyMap ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === column.keyMap}
                      direction={orderBy === column.keyMap ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, column.keyMap)}
                    >
                      {column.label}
                      {orderBy === column.keyMap ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.sort((a, b) => {
                if (!orderBy) return 0;

                if (typeof a[orderBy] === 'number' && typeof b[orderBy] === 'number') {
                  if (order === 'asc'

                  ) return (a[orderBy] - b[orderBy]);
                  else return (b[orderBy] - a[orderBy])
                }


                if (typeof a[orderBy] === 'string' && typeof b[orderBy] === 'string') {
                   return order === 'asc' ? (a[orderBy].localeCompare(b[orderBy])) : (b[orderBy].localeCompare(a[orderBy]));
                  
                }

                return 0;

              }).map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" checked={isItemSelected} />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell key={String(column.keyMap)} align={column.numeric ? 'right' : 'left'}>
                        {column.formatDisplay ? column.formatDisplay(row[column.keyMap]) as React.ReactNode : row[column.keyMap] as React.ReactNode}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
    </Box>
  );
}
