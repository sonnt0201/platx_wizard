
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { Stack } from '@mui/material';

/**
 * Form as Dialog to create a new Scheduler
 * 
 * Just a form, give api to create callback for UI events (button clicks, close, etc ..)
 * 
 * No APIs callings here
 */
export const ScheduleCreatorDialog = ({
    onSubmitDailySchedule,
    open,
    onCloseClick,
}: {
    onSubmitDailySchedule?: (config: { control: string, hour: number, minute: number, second: number }) => void
    open: boolean;
    onCloseClick?: () => void

}) => {

    const [dailyScheduleInput, setDailyScheduleInput] = useState<{ control: string, hour: number, minute: number, second: number }>({
        control: "",
        hour: 0,
        minute: 0,
        second: 0,

    })

    return (
        <Dialog
            open={open}
            onClose={() => {
                if (onCloseClick) onCloseClick();
            }}
           
        >
            <DialogTitle>Add a new Daily Schedule</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Add a new schedule for this device. Input your schedule time and control label.
                </DialogContentText>

                <Stack direction={"row"} spacing={2}>

                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="control"
                        name="control"
                        label="Control Label (on, off, etc..)"
                        type="text"
                        // fullWidth
                        variant="standard"

                        value={dailyScheduleInput.control}

                        onChange={(e) => {
                            setDailyScheduleInput(prev => {

                                return {
                                    ...prev,
                                    control: e.target.value
                                }
                            })
                        }}

                    />

                    <TextField


                        margin="dense"
                        id="hour"
                        name="hour"
                        label="Hour"
                        type="number"
                        // fullWidth
                        variant="standard"

                        value={dailyScheduleInput.hour}

                        onChange={(e) => {
                            setDailyScheduleInput(prev => {

                                return {
                                    ...prev,
                                    hour: Number(e.target.value)
                                }
                            })
                        }}
                    />



                    <TextField


                        margin="dense"
                        id="minute"
                        name="minute"
                        label="Minute"
                        type="number"
                        // fullWidth
                        variant="standard"

                        value={dailyScheduleInput.minute}

                        onChange={(e) => {
                            setDailyScheduleInput(prev => {

                                return {
                                    ...prev,
                                    minute: Number(e.target.value)
                                }
                            })
                        }}

                    />


                </Stack>




            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    if (onCloseClick) onCloseClick();
                }}>Cancel</Button>
                <Button onClick={() => {
                    if (onSubmitDailySchedule) onSubmitDailySchedule(dailyScheduleInput);
                    if (onCloseClick) onCloseClick();
                }}>ADD SCHEDULE</Button>
            </DialogActions>
        </Dialog>
    )
}