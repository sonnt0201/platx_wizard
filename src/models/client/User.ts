import { UserConstants } from "@/constants";
import axios from "axios";

import { Auth } from "./Auth";

export interface IUserInfo {
    id: IEntity;
    createdTime: number;
    tenantId: IEntity;
    customerId: IEntity;
    email: string;
    authority: "TENANT_ADMIN" | "CUSTOMER_USER" | "SYS_ADMIN"; // Assuming other roles could exist
    firstName?: string ;
    lastName?: string ;
  
    name: string;
    [index: string]: object | number | string | undefined
}

interface IEntity {
    entityType: string;
    id: string;
}



class UserClass {

    async current(): Promise<{info?: IUserInfo, error? :Error}> {
        const url = UserConstants.THINGSBOARD_HOST + "/api/auth/user";
        try {
            const res = await axios.get(url, {
                headers: {
                    "x-authorization": `Bearer ${Auth.state.token}`
                }
            }
            );
            if (res.status === 200) {

                return {
                    info: res.data as IUserInfo,

                }
            }

            return {
                
                error: new Error(res.status.toString())
            }
        } catch (err) {

            console.error((err as Error).message)
            return {
                error: (err as Error)
            }
        }


       
    }
}


// singleton
export const User = new UserClass();

