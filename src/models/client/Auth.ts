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
    scopes: string[]; // Array of scopes/roles
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

        if (!window) return;

        localStorage.setItem(LocalKeyConstants.TOKEN, value.token);
        localStorage.setItem(LocalKeyConstants.USERNAME, value.username);
        if (value.refreshToken) localStorage.setItem(LocalKeyConstants.REFRESH_TOKEN, value.refreshToken);
    }

    get state() {

        if (!window) return EMPTY_AUTH_STATE;

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
        if (!window) return { error: AuthError.RUN_ON_SERVERSIDE }

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

// singleton instance
export const Auth = new AuthClass();
