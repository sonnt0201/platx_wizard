import { UserConstants } from "@/constants";
import { Auth, IAuth } from "./Auth";
import axios from "axios";

export interface IDevice {

    id: {
        entityType: string,
        id: string
    };

    tenantId: {
        entityType: string,
        id: string
    };
    customerId: {
        entityType: string,
        id: string
    };
    name: string,
    type: string,
    label: string,
    deviceProfileId: {
        entityType: string,
        id: string
    };

    customerTitle: string,
    customerIsPublic: false,
    deviceProfileName: string,
    active: false,

    [index: string]: string | Object



}

export interface ITimeSeriesRes {
    [index: string]: ITsValuePair[];
}

export interface ITsValuePair {
    ts: number;
    value: number | string | Array<number>;
}

class DevicesClass {

    //dependency
    private _Auth?: IAuth = Auth;

    async all(): Promise<{ devices: IDevice[], error?: Error }> {
        const url = UserConstants.THINGSBOARD_HOST
            + `/api/customer/${this._Auth?.tokenInfo?.customerId}/deviceInfos?pageSize=10&page=0&sortProperty=createdTime&sortOrder=DESC`;

        try {
            const res = await axios.get(url, {
                headers: {
                    "X-Authorization": "Bearer " + this._Auth?.state.token
                }
            })


            if (res.status === 200) {
                return { devices: res.data.data as IDevice[] }
            } else {
                return { devices: [], error: new Error(res.status.toString()) }
            }
        } catch (e) {
            return { devices: [], error: e as Error }
        }

    }

    async timeseriesKeys(device: IDevice, startTs: number, endTs: number): Promise<{ keys: string[], error?: Error }> {
        const url = UserConstants.THINGSBOARD_HOST
            + `/api/plugins/telemetry/DEVICE/${device.id.id}/values/timeseries?startTs=${startTs}&endTs=${endTs}`



        try {
            const res = await axios.get(url, {
                headers: {
                    "X-Authorization": "Bearer " + this._Auth?.state.token
                }
            })


            if (res.status === 200) {
                return { keys: Object.keys(res.data) }
            } else {
                return { keys: [], error: new Error(res.status.toString()) }
            }
        } catch (e) {
            return { keys: [], error: e as Error }
        }

    }

    async timeseriesValues(device: IDevice, startTs: number, endTs: number, keys: string[]): Promise<{ data: ITimeSeriesRes, error?: Error }> {
        const url = UserConstants.THINGSBOARD_HOST
            + `/api/plugins/telemetry/DEVICE/${device.id.id}/values/timeseries?startTs=${startTs}&endTs=${endTs}&keys=${keys.join(',')}`

        try {
            const res = await axios.get(url, {
                headers: {
                    "X-Authorization": "Bearer " + this._Auth?.state.token
                }
            })


            if (res.status === 200) {
                return { data: res.data }
            } else {
                return { data: {}, error: new Error(res.status.toString()) }
            }
        } catch (e) {
            return { data: {}, error: e as Error }
        }
    }

}

// singleton
export const DevicesManager = new DevicesClass()

