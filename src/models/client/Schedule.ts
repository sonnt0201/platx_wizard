import axios from 'axios';

import { UserConstants } from '@/constants';

/**
 * IoT Platform X DAEMON - interfaces and model
 * 
 * Service -> Scheduler interfaces
 * 
 */


export interface ISchedule {

    /**
     * In milliseconds, the next scheduled time
     * 
     * If current timestamp is equal or greater than incoming timestamp, scheduled event must be fired
     * and the next incoming timestamp must be set, depend on repeat time
     */
    incomingTime: number;

    /**
     * period of schedule in milliseconds
     * if equal to 0, the scheduled event is called only one time
     */
    repeatTime: number;


    /**
        * - The number of times the schedule will repeat.
        * - Each time the deadline passes, `repeatCount` decreases by 1.
        * - If `repeatCount` is `-1`, the schedule repeats indefinitely.
     */
    repeatCount: number;

    id: string;

    /**
     * name for the event that happened when the time come
     */
    control: string;
}

/**
 * name of attribute key for thingsboard
 */
export const SchedulesAttributeKey = "_schedules"

export enum MillisecondsOption {
    ONE_MIN = 1000 * 60,
    ONE_DAY = 1000 * 60 * 60 * 24,
    ONE_HOUR = 1000 * 60 * 60,
    ONE_WEEK = 1000 * 60 * 60 * 24 * 7,
}

export type ControlLabel = string;


export const SchedulerAPIsClient = {
    getSchedulesList: async (deviceId: string) => {
        let  list : ISchedule[] = [];

        const url = UserConstants.DAEMON_HTTP_API_HOST + `/service/scheduler/${deviceId}`

        list = (await axios.get(url)).data as ISchedule[]

        console.log({
            target: "SchedulerAPIsClient.getSchedulesList",
            schedulesList: list
        })

        return list
    } ,

    /**
     * Post to create new daily schedule
     * 
     * Post to DAEMON
     * 
     */
    postDailySchedule: async (deviceId: string, input: {
        control: string,
        hour: number,
        minute: number,
        second: number
    }) => {
      

        const url = UserConstants.DAEMON_HTTP_API_HOST + `/service/scheduler/${deviceId}/daily`

        const res = (await axios.post(url, input))

        console.log({
            target: "SchedulerAPIsClient.postDailySchedule",
            schedulesList: res.status
        })

       
    } ,

    /**
     * Post to create a custom schedule
     */
    postSchedule: async (deviceId: string, options: Partial<Omit<ISchedule, "id">>) => {
        const url = UserConstants.DAEMON_HTTP_API_HOST + `/service/scheduler/custom/${deviceId}`

        const res = (await axios.post(url, options))

        console.log({
            target: "SchedulerAPIsClient.postDailySchedule",
            schedulesList: res.status
        })
    },

    /**
     * Send http request to Delete a schedule
     */
    deleteSchedules: async (deviceId: string, scheduleIDs: string[]) => {
        const url = UserConstants.DAEMON_HTTP_API_HOST + `/service/scheduler/${deviceId}/schedule-ids/${scheduleIDs.join('+')}`

        const res = (await axios.delete(url))

        console.log({
            target: "SchedulerAPIsClient.postDailySchedule",
            schedulesList: res.status
        })
    },

    /**
     * send http request to Edit a schedule with new options
     * 
     
     * 
     * @param deviceId 
     * @param scheduleID 
     * @param options 
     * @throws Error if failed
     */
    editSchedule: async (deviceId: string, scheduleID: string, options: Partial<Omit<ISchedule, "id">>) => {
    
    
        const url = UserConstants.DAEMON_HTTP_API_HOST + `/service/scheduler/${deviceId}/schedule-id/${scheduleID}`

        const res = (await axios.put(url, options))

        console.log({
            target: "SchedulerAPIsClient.editSchedule",
            schedulesList: res.status
        })
    }

    

}