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
    ONE_DAY = 1000 * 60 * 60 * 24,
    ONE_HOUR = 1000 * 60 * 60,
    ONE_WEEK = 1000 * 60 * 60 * 24 * 7
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


}