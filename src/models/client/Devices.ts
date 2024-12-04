import { UserConstants } from "@/constants";
import { Auth, IAuth } from "./Auth";
import axios, { AxiosError } from "axios";
import { ClientError } from "./ClientErrorBase";

//tb device info
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

    [index: string]: string | boolean | object



}

// tb device credentials

export interface IDeviceCredentials {
    id: {
        id: string;
    };
    createdTime: number;
    deviceId: {
        entityType: string;
        id: string;
    };
    credentialsType: string;
    credentialsId: string;
    credentialsValue: null;
    version: number;
}


export interface ITimeSeriesRes {
    [index: string]: ITsValuePair[];
}

export interface ITsValuePair {
    ts: number;
    value: number | string | Array<number>;
}




// auth as dependency, used for tb api operations, tb api call and other tool to migrate device infor
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


    // credentials of thingsboard device
    async getCredentials(device: IDevice): Promise<{
        error?: ClientError
        credentials?: IDeviceCredentials

    }> {
        const url = UserConstants.THINGSBOARD_HOST + `/api/device/${device.id.id}/credentials`
        try {
            const res = await axios.get(url, {
                headers: {
                    "X-Authorization": "Bearer " + this._Auth?.state.token
                }
            });

            // success
            if (res.status === 200) {
                return {
                    credentials: res.data as IDeviceCredentials
                }
            }

            // if not success, no data
            return {
                error: ClientError.UNKNOWN
            }


        } catch (e) {
            console.error(e);
            if ((e as AxiosError).response) {
                const res = (e as AxiosError).response;

                switch (res?.status) {
                    case 404: return {
                        error: ClientError.HTTP_NOT_FOUND
                    }

                    case 400: return {
                        error: ClientError.HTTP_BAD_REQUEST
                    }

                    default: return {
                        error: ClientError.UNKNOWN
                    }

                }

            } else {
                return {
                    error: ClientError.NETWORK_CONN
                }
            }

        }
    }


    // get shared attribute of thingsboard devices
    async getSharedAttribute<valueType>(deviceCredentialas: IDeviceCredentials, key: string): Promise<{
        values?: valueType,
        error?: ClientError
    }> {
        if (deviceCredentialas.credentialsType !== `ACCESS_TOKEN`) return {
            error: ClientError.WRONG_TYPE
        }
        const url = UserConstants.THINGSBOARD_HOST + `/api/v1/${deviceCredentialas.credentialsId}/attributes?sharedKeys=${key}`



        try {
            const res = await axios.get(url, {
                headers: {
                    "X-Authorization": "Bearer " + this._Auth?.state.token
                }
            });

            // valid response
            if (res.status === 200) {
                if (!res.data.shared[key]) return {
                    error: ClientError.HTTP_BAD_REQUEST
                }


                // success
                return { values: res.data.shared[key] as valueType }

            }

            // if not success, no data
            return {
                error: ClientError.UNKNOWN
            }


        } catch (e) {
            console.error(e);
            if ((e as AxiosError).response) {
                const res = (e as AxiosError).response;

                switch (res?.status) {
                    case 404: return {
                        error: ClientError.HTTP_NOT_FOUND
                    }

                    case 400: return {
                        error: ClientError.HTTP_BAD_REQUEST
                    }

                    default: return {
                        error: ClientError.UNKNOWN
                    }

                }

            } else {
                return {
                    error: ClientError.NETWORK_CONN
                }
            }

        }


    }

}

// singleton
export const DevicesManager = new DevicesClass()

