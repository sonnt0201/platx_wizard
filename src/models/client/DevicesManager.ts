import { UserConstants } from "@/constants";
import { Auth, IAuth } from "./Auth";
import axios, { AxiosError } from "axios";
import { ClientError } from "./ClientErrorBase";

/**
 * Represents the structure of a ThingsBoard device.
 */
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
    name: string;
    type: string;
    label: string;
    deviceProfileId: {
        entityType: string,
        id: string
    };
    customerTitle: string;
    customerIsPublic: false;
    deviceProfileName: string;
    active: false;
    [index: string]: string | boolean | object;
}

/**
 * Represents the credentials structure of a ThingsBoard device.
 */
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

/**
 * Represents the structure of time-series response from ThingsBoard.
 */
export interface ITimeSeriesRes {
    [index: string]: ITsValuePair[];
}

/**
 * Represents a key-value pair in ThingsBoard time-series data.
 */
export interface ITsValuePair {
    ts: number;
    value: number | string | Array<number>;
}

/**
 * Manages ThingsBoard device-related operations, including fetching devices,
 * time-series data, device credentials, and shared attributes.
 */
class DevicesClass {
    // Dependency for authentication
    private _Auth?: IAuth = Auth;

    /**
     * Fetches all devices for the authenticated user.
     * @returns A promise resolving to a list of devices or an error.
     */
    async all(): Promise<{ devices: IDevice[], error?: Error }> {

        let url = ""

        if (Auth.tokenInfo?.scopes[0] === "TENANT_ADMIN") {
            url = UserConstants.THINGSBOARD_HOST
            + `/api/tenant/devices?pageSize=10&page=0&sortProperty=createdTime&sortOrder=DESC`;

            
        } else { // customer user
            url = UserConstants.THINGSBOARD_HOST
            + `/api/customer/${this._Auth?.tokenInfo?.customerId}/devices?pageSize=10&page=0&sortProperty=createdTime&sortOrder=DESC`;

        }

      

        try {
            const res = await axios.get(url, {
                headers: {
                    "X-Authorization": "Bearer " + this._Auth?.state.token
                }
            });

            if (res.status === 200) {
                return { devices: res.data.data as IDevice[] };
            } else {
                return { devices: [], error: new Error(res.status.toString()) };
            }
        } catch (e) {
            return { devices: [], error: e as Error };
        }
    }

    /**
     * Fetches time-series keys for a specific device within a given time range.
     * @param device - The device for which time-series keys are retrieved.
     * @param startTs - The start timestamp.
     * @param endTs - The end timestamp.
     * @returns A promise resolving to a list of time-series keys or an error.
     */
    async timeseriesKeys(device: IDevice, startTs: number, endTs: number): Promise<{ keys: string[], error?: Error }> {
        const url = UserConstants.THINGSBOARD_HOST
            + `/api/plugins/telemetry/DEVICE/${device.id.id}/values/timeseries?startTs=${startTs}&endTs=${endTs}`;

        try {
            const res = await axios.get(url, {
                headers: {
                    "X-Authorization": "Bearer " + this._Auth?.state.token
                }
            });

            if (res.status === 200) {
                return { keys: Object.keys(res.data) };
            } else {
                return { keys: [], error: new Error(res.status.toString()) };
            }
        } catch (e) {
            return { keys: [], error: e as Error };
        }
    }

    /**
     * Fetches time-series values for a device based on keys within a time range.
     * @param device - The device for which time-series data is retrieved.
     * @param startTs - The start timestamp.
     * @param endTs - The end timestamp.
     * @param keys - The list of keys to retrieve values for.
     * @returns A promise resolving to time-series data or an error.
     */
    async timeseriesValues(device: IDevice, startTs: number, endTs: number, keys: string[]): Promise<{ data: ITimeSeriesRes, error?: Error }> {
        const url = UserConstants.THINGSBOARD_HOST
            + `/api/plugins/telemetry/DEVICE/${device.id.id}/values/timeseries?startTs=${startTs}&endTs=${endTs}&keys=${keys.join(',')}`;

        try {
            const res = await axios.get(url, {
                headers: {
                    "X-Authorization": "Bearer " + this._Auth?.state.token
                }
            });

            if (res.status === 200) {
                return { data: res.data };
            } else {
                return { data: {}, error: new Error(res.status.toString()) };
            }
        } catch (e) {
            return { data: {}, error: e as Error };
        }
    }

    /**
     * Fetches credentials of a ThingsBoard device.
     * @param device - The device whose credentials are fetched.
     * @returns A promise resolving to the device credentials or an error.
     */
    async getCredentials(device: IDevice): Promise<{
        error?: ClientError;
        credentials?: IDeviceCredentials;
    }> {
        const url = UserConstants.THINGSBOARD_HOST + `/api/device/${device.id.id}/credentials`;

        try {
            const res = await axios.get(url, {
                headers: {
                    "X-Authorization": "Bearer " + this._Auth?.state.token
                }
            });

            if (res.status === 200) {
                return { credentials: res.data as IDeviceCredentials };
            }

            return { error: ClientError.UNKNOWN };
        } catch (e) {
            console.error(e);

            if ((e as AxiosError).response) {
                const res = (e as AxiosError).response;
                switch (res?.status) {
                    case 404: return { error: ClientError.HTTP_NOT_FOUND };
                    case 400: return { error: ClientError.HTTP_BAD_REQUEST };
                    default: return { error: ClientError.UNKNOWN };
                }
            } else {
                return { error: ClientError.NETWORK_CONN };
            }
        }
    }

    /**
     * Fetches shared attributes of a ThingsBoard device based on a key.
     * @param deviceCredentialas - The device credentials to authenticate the request.
     * @param key - The key of the shared attribute to retrieve.
     * @returns A promise resolving to the shared attribute value or an error.
     */
    async getSharedAttribute<valueType>(deviceCredentialas: IDeviceCredentials, key: string): Promise<{
        values?: valueType;
        error?: ClientError;
    }> {
        if (deviceCredentialas.credentialsType !== `ACCESS_TOKEN`) {
            return { error: ClientError.WRONG_TYPE };
        }

        const url = UserConstants.THINGSBOARD_HOST + `/api/v1/${deviceCredentialas.credentialsId}/attributes?sharedKeys=${key}`;

        try {
            const res = await axios.get(url, {
                headers: {
                    "X-Authorization": "Bearer " + this._Auth?.state.token
                }
            });

            if (res.status === 200) {
                if (!res.data.shared[key]) {
                    return { error: ClientError.HTTP_BAD_REQUEST };
                }

                return { values: res.data.shared[key] as valueType };
            }

            return { error: ClientError.UNKNOWN };
        } catch (e) {
            console.error(e);

            if ((e as AxiosError).response) {
                const res = (e as AxiosError).response;
                switch (res?.status) {
                    case 404: return { error: ClientError.HTTP_NOT_FOUND };
                    case 400: return { error: ClientError.HTTP_BAD_REQUEST };
                    default: return { error: ClientError.UNKNOWN };
                }
            } else {
                return { error: ClientError.NETWORK_CONN };
            }
        }
    }
}

// Singleton instance of DevicesClass
export const DevicesManager = new DevicesClass();
