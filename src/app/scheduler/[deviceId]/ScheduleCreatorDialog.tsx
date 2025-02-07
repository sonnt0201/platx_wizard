
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, Select, Stack, Switch } from '@mui/material';
import { ISchedule, MillisecondsOption } from '@/models/client/Schedule';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ms from 'ms';

/**
 * Supported controls to create for scheduler
 */
const ControlsList: string[] = [
    "on",
    "off",
    "load-on",
    "load-off"
]


/**
 * Form as Dialog to create a new Scheduler
 * 
 * Just a form, give api to create callback for UI events (button clicks, close, etc ..)
 * 
 * No APIs callings here
 */
export const ScheduleCreatorDialog = ({
    onSubmitSchedule,
    open,
    onCloseClick,
}: {
    onSubmitSchedule?: (options: Partial<Omit<ISchedule, 'id'>>) => void
    open: boolean;
    onCloseClick?: () => void

}) => {

    const [inputOptions, setInputOptions] = useState<Partial<Omit<ISchedule, 'id'>>>({
        incomingTime: 0,
        repeatTime: MillisecondsOption.ONE_DAY,
        repeatCount: 1,
        control: ""
    })

    const [repeatIndefinitely, setRepeatIndefinitely] = useState<boolean>(false);

    /**
        * if repeatIndefinitely, set repeatCount as -1, 
        * if repeatIndefinitely is toggled off, set repeatCount to 0 (default value)
    
    */
    useEffect(() => {
        if (repeatIndefinitely) setInputOptions(prev => {

            const out = {
                ...prev,
                repeatCount: -1
            }

            return out
        }); else setInputOptions(prev => {

            const out = {
                ...prev,
                repeatCount: 1
            }

            return out
        })
    }, [repeatIndefinitely])

    return (
        <Dialog
            maxWidth={"sm"}
            fullWidth={true}
            open={open}
            onClose={() => {
                if (onCloseClick) onCloseClick();
            }}
            sx={{
                marginBottom: 20
            }}
        >
            <DialogTitle>Add a new Schedule</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Input your schedule time and control label.
                </DialogContentText>
                {/* <Divider /> */}
                <Stack direction={"column"} spacing={6}   sx={{ flexWrap: 'wrap', margin: 2 }}>

                    <Stack id="first row of input" direction={"row"} spacing={2} useFlexGap
                        sx={{ flexWrap: 'wrap', margin: 2 }}>



                        <FormControl id="wrapper:control" className='w-3/12 ' >
                            <InputLabel id="label for control">Control</InputLabel>
                            <Select
                                size='medium'
                                labelId="selector:control"
                                id="demo-simple-select"
                                value={inputOptions.control || ""}
                                label="Control"
                                onChange={(e) => {
                                    const newInput: Partial<Omit<ISchedule, 'id'>> = {
                                        ...inputOptions,
                                        control: e.target.value
                                    };

                                    setInputOptions(newInput)
                                }}
                            >
                                {
                                    ControlsList.map((control) => <MenuItem value={control} key={control}>{control}</MenuItem>)
                                }
                            </Select>
                        </FormControl>

                        <FormControl className='w-5/12' >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>

                                <DateTimePicker label="Next Due Time" onChange={(value) => {
                                    if (value) {
                                        const newInput: Partial<Omit<ISchedule, 'id'>> = {
                                            ...inputOptions,
                                            incomingTime: value.valueOf()
                                        }

                                        setInputOptions(newInput);
                                    }



                                }} />
                            </LocalizationProvider>
                        </FormControl>



                        <FormControl className='w-3/12'>
                            <InputLabel id="demo-simple-select-label" >Period</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={inputOptions ? inputOptions.repeatTime : MillisecondsOption.ONE_DAY}
                                label="Period"
                                onChange={(e) => {
                                    const newInput: Partial<Omit<ISchedule, 'id'>> = {
                                        ...inputOptions,
                                        repeatTime: Number(e.target.value)
                                    };

                                    setInputOptions(newInput)
                                }}
                            >

                                {Object.values(MillisecondsOption) // get all keys and values of enum
                                    .filter(v => typeof v === "number") // filter, just keep numeric values
                                    .sort((a, b) => (a - b)) // sort by time ascending order
                                    .map(value =>
                                        <MenuItem value={value} key={value} >{ms(value, { long: true })}</MenuItem>)}


                            </Select>
                        </FormControl>



                    </Stack>

                    <Stack direction={"row"} spacing={2}>



                        <FormControlLabel

                            control={<Switch
                                checked={repeatIndefinitely}

                                onChange={(_, checked) => {
                                    // console.log(checked)
                                    setRepeatIndefinitely(checked)

                                }}
                            />}

                            label="Repeat Indefinitely" />

                        <TextField
                            disabled={repeatIndefinitely}
                            id="outlined-number"
                            label="Occurrences Limit"
                            type={repeatIndefinitely? "text": "number"}
                            value={repeatIndefinitely? "NONE" :inputOptions.repeatCount}
                            onChange={(e) => {
                               if (!repeatIndefinitely) setInputOptions(prev => {
                                    const out = {
                                        ...prev,
                                        repeatCount: Number(e.target.value)
                                    }

                                    return out;
                                })
                            }}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                                htmlInput: { min: 0,  step: 1 }
                            }}

                           

                        />
                    </Stack>
                </Stack>





            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    if (onCloseClick) onCloseClick();
                }}>Cancel</Button>
                <Button onClick={() => {
                    if (onSubmitSchedule) onSubmitSchedule(inputOptions);
                    if (onCloseClick) onCloseClick();
                }}>ADD SCHEDULE</Button>
            </DialogActions>
        </Dialog>
    )
}