"use Server"

import { Account, Avatars, Client, Databases, Storage } from "appwrite"
import { appwriteConfig } from "./config"
import { cookies } from "next/headers"
// import { get } from "http"

//----------SESSION CLIENT----------//
export const createSessionClient = async () => {
    const client = new Client()
       .setEndpoint(appwriteConfig.endpointUrl)
       .setProject(appwriteConfig.projectId)

    const session = (await cookies()).get("appwrite-session")
    
    if(!session ||  !session.value) throw new Error("No session ");

    client.setSession(session.value);

    return{
        get account() {
            return new Account(client);
        },
        get database() {
            return new Databases(client)
        }
    }
}

//----------ADMIN----------//
export const createAdminClient = async() => {
        const client = new Client()
       .setEndpoint(appwriteConfig.endpointUrl)
       .setProject(appwriteConfig.projectId)
       .setDevKey(appwriteConfig.secretKey) //---makes error----//

    return{
        get account() {
            return new Account(client);
        },
        get database() {
            return new Databases(client)
        },
        get storage(){
            return new Storage(client);
        },
        get avatar(){
            return new Avatars(client);
        }
    }
}
