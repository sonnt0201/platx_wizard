'use client'

import { UserConstants } from "@/constants";
import axios from "axios";

const enum LocalKeyConstants {
    TOKEN = "jwt_token",
    REFRESH_TOKEN = "refresh_token",
    USERNAME = "username"

}
const HTTP_AUTH_HEADER = "X-Authorization"

interface IAuthState {
    username: string,
    token: string,
    refreshToken: string
}

const EMPTY_AUTH_STATE: IAuthState = {
    username: "",
    token: "",
    refreshToken: ""

}


export interface IAuth {



    state: IAuthState,
    httpHeaderKey: string,
    login: (email: string, password: string) => Promise<
        {
            token: string | null,

            error: Error | null
        }>
    tokenInfo?: ITokenInfo
    logOut: () => void
}


export enum AuthError {
    RUN_ON_SERVERSIDE,
    UNAUTHORIZED,
    TOKEN_EXPIRED,
    UNKNOWN

}

export interface ITokenInfo {

    sub: string; // Subject, typically the user email
    userId: string; // User ID
    scopes: ("TENANT_ADMIN"| "CUSTOMER_USER")[]; // Array of scopes/roles
    sessionId: string; // Session ID
    exp: number; // Expiration time (Unix timestamp in seconds)
    iss: string; // Issuer
    iat: number; // Issued at time (Unix timestamp in seconds)
    enabled: boolean; // Indicates if the user is enabled
    isPublic: boolean; // Indicates if the user is public
    tenantId: string; // Tenant ID
    customerId: string; // Customer ID

}

class AuthClass implements IAuth {

    set state(value: { username: string, token: string, refreshToken: string }) {

        if (typeof window === "undefined") return;

        localStorage.setItem(LocalKeyConstants.TOKEN, value.token);
        localStorage.setItem(LocalKeyConstants.USERNAME, value.username);
        if (value.refreshToken) localStorage.setItem(LocalKeyConstants.REFRESH_TOKEN, value.refreshToken);
    }

    get state() {

        if (typeof window === "undefined") return EMPTY_AUTH_STATE;

        const username = localStorage.getItem(LocalKeyConstants.USERNAME);
        const refreshToken = localStorage.getItem(LocalKeyConstants.REFRESH_TOKEN);
        const token = localStorage.getItem(LocalKeyConstants.TOKEN);

        if (username && token && refreshToken) {
            return {
                username: username,
                token: token,
                refreshToken: refreshToken

            }
        }

        return {
            username: "",
            token: "",
            refreshToken: ""
        }


    }

    get httpHeaderKey() { return HTTP_AUTH_HEADER }

    async login(email: string, password: string): Promise<
        {
            token: string | null,

            error: Error | null
        }> {
        const url = UserConstants.THINGSBOARD_HOST + "/api/auth/login"
        console.log(url)

        try {
            const res = await axios.post(url, {
                username: email,
                password: password
            })

            if (res.status === 200) {
                const data = res.data;
                console.log(res.data);

                this.state = {
                    username: email,
                    token: data.token,
                    refreshToken: data.refreshToken
                }

                return {
                    token: this.state.token,

                    error: null
                }

            } else {
                return {
                    token: null,

                    error: Error(res.status.toString())
                }
            }


        } catch (e) {
            console.log((e as Error).message);
            return {
                token: null,


                error: e as Error
            }
        }

    }

    get tokenInfo() {

       

        const token = localStorage.getItem(LocalKeyConstants.TOKEN);
        if (!token) return undefined;
        try {
            const [, payload] = token.split('.');
            const info = JSON.parse(atob(payload)) as ITokenInfo;

            return info;
        } catch (e) {
            console.error((e as Error).message);
            return undefined
        }
    }

    get refreshTokenInfo() {
        const token = localStorage.getItem(LocalKeyConstants.REFRESH_TOKEN);
        if (!token) return undefined;
        try {
            const [, payload] = token.split('.');
            const info = JSON.parse(atob(payload)) as ITokenInfo;

            return info;
        } catch (e) {
            console.error((e as Error).message);
            return undefined
        }
    }

    logOut() {
        this.state = {
            username: "",
            token: "",
            refreshToken: ""
        }
        window.location.replace("/login");
    }

    clearAuth() {
        this.state = {
            username: "",
            token: "",
            refreshToken: ""
        }
    }

    shouldDoLogin():boolean {

        if (!this.state 
            || !this.state.username 
            || !this.state.token 
            || !this.state.refreshToken) return true;

        if (this.isExpired(this.state.refreshToken)) return true;

        return false;

        
    }

    shouldDoRefreshToken(): boolean {
        return (
            this.state.refreshToken !== undefined
            && this.state.refreshToken !== ""
            && this.isExpired(this.state.token) 
            && !this.isExpired(this.state.refreshToken)
        )
    }

    async doRefreshToken(): Promise<{
        error?: AuthError,
        state?: IAuthState,
    }> {
        if (typeof window === "undefined") return { error: AuthError.RUN_ON_SERVERSIDE }

        const refreshToken = this.state.refreshToken
        if (!refreshToken || this.isExpired(refreshToken)) {

            return { error: AuthError.TOKEN_EXPIRED }
        }

        // do refresh
        try {
            const url = UserConstants.THINGSBOARD_HOST + `/api/auth/token`
            const res = await axios.post(url, { refreshToken: refreshToken });
            if (res.status === 200) {
                const data = res.data;
                console.log(res.data);



                this.state = {
                    username: this.state.username,
                    token: data.token,
                    refreshToken: data.refreshToken
                }

                return {
                    state: this.state
                }

            }

            //else: error handle
            
            return {

                error: AuthError.UNAUTHORIZED
            }
        } catch (err) {

            console.log((err as Error).message);
            
            return {
                error: AuthError.UNKNOWN
            }
        }


    }


    isExpired(token: string): boolean {
        const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        return decoded.exp < currentTime;
    }



    constructor() {
        // this.state = EMPTY_AUTH_STATE;

    }




}


/**
 * get thingsboard auth token, auto refresh token if needed.
 * 
 * @returns token as string 
 */
export async  function getTBToken (): Promise<string> {
  
    if (typeof window === "undefined") return "";

    if (Auth.shouldDoLogin()) { // should do login

        console.log("Logging in for you ...");


            window.location.replace("/login")

            

            // check if error when login
            return "";
            

        } else if (Auth.shouldDoRefreshToken()) { // if shouldnt login but refresh token

            console.log("Refresh token for you...");

            const ret = await Auth.doRefreshToken();


            // in case error happens
            if (ret.error ||  !ret.state) {
                console.error("Cannot refresh token, may be because of the TB server.");

               

                return "";

            }

            console.log("Refresh token successfully")

            return ret.state?.token
            
        } else {

            return Auth.state?.token || ""

        }
    
}

export const postWithAuth = async (endpoint: string,
    payload: object,
    headers?: object
) => axios.post(
    UserConstants.THINGSBOARD_HOST + endpoint,
    payload,

    {
        headers: {
            "X-Authorization": `Bearer ${await getTBToken()}`,
            ...headers
        }
    }
)

/**
 * Built on top of axios
 * 
 * Send post request with Auth header to configured thingsboard server 
 * @param endpoint : endpoint only etc: /api/v1/devices 
 * @param headers 
 * @returns Promise of response object
 */
export const getWithAuth = async (endpoint: string,
    headers?: object
) => axios.get(
    UserConstants.THINGSBOARD_HOST + endpoint,
    {
        headers: {
            "X-Authorization": `Bearer ${await getTBToken()}`,
            ...headers
        }
    }
)


// singleton instance
export const Auth = new AuthClass();
