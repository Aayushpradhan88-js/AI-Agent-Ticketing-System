"use Server"

import { createAdminClient } from "@/lib/appwrite/index"
import { appwriteConfig } from "../appwrite/config";
import { Query } from "appwrite";

const getUserByEmail = async(email: string) => {
    const{database} = await createAdminClient();

    const result = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        queries: [Query.equal(attribute : "email", email)]
    )
}

export const createAccount = async ({fullname, email} : {
    fullname: string,
    email: string
}) => {
    const existingUser = await getUserByEmail(email)
}