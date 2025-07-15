"use server"

import { createAdminClient } from "@/lib/appwrite/index"
import { appwriteConfig } from "../appwrite/config";
import { Query, ID } from "appwrite";

const getUserByEmail = async(email: string) => {
    const{database} = await createAdminClient();

    const result = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        queries: [Query.equal(attribute:"email", value: [email])],
    )

    return result.total>0 ? result.documents[0] : null
}

//-----handle error-----//
const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
}
 
//-----Sendling OTP VERIFICATION-----//
const sendEmailOTP = async({email} : {email : string}) => {
    const {account} = await createAdminClient();

    try{
        const session = await account.createEmailToken(ID.unique(), email)

        return session.userId;
    }
    catch(error){
        handleError(error, message:"FAILED TO SEND EMAIL OTP")
    };
};

export const createAccount = async ({fullname, email} : {
    fullname: string,
    email: string
}) => {
    const existingUser = await getUserByEmail(email);

    const accountId = await sendEmailOTP({email} : {email});
    if(!accountId) {
        throw new Error(message: "FAILED TO SEND OTP");
         
        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            data: {
                fullname,
                email,
                avatar,
                accountId
            }
        )
    }
};