'use client'

import { UserConstants } from "@/constants";
import axios from "axios";

const LocalKeyConstants = {
    TOKEN: "jwt_token",
    REFRESH_TOKEN: "refresh_token",
    USERNAME: "username"

}
const HTTP_AUTH_HEADER = "X-Authorization"




export interface IAuth {
    state: { username: string, token: string, refreshToken?: string },
    httpHeaderKey: string,
    login: (email: string, password: string) => Promise<
    {
        token: string | null,

        error: Error | null
    }>
    tokenInfo?: ITokenInfo
    logOut: () => void
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

    set state(value: { username: string, token: string, refreshToken?: string }) {
        localStorage.setItem(LocalKeyConstants.TOKEN, value.token);
        localStorage.setItem(LocalKeyConstants.USERNAME, value.username);
        if (value.refreshToken) localStorage.setItem(LocalKeyConstants.REFRESH_TOKEN, value.refreshToken);
    }

    get state() {

        const username = localStorage.getItem(LocalKeyConstants.USERNAME);
        const refreshToken = localStorage.getItem(LocalKeyConstants.REFRESH_TOKEN);
        const token = localStorage.getItem(LocalKeyConstants.TOKEN);

        if (username && token) {
            return {
                username: username,
                token: token,
                refreshToken: refreshToken ? refreshToken : undefined

            }
        }

        return {
            username: "",
            token: "",
            refreshToken: undefined
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

    logOut() {
        this.state = {
            username: "",
            token: "",
            refreshToken: ""
        }
        location.reload();
    }

    constructor() {


    }



}

// singleton instance
export const Auth = new AuthClass();
