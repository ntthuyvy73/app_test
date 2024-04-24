export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.thuyvy.aora_test",
    projectId: "6628bad4d950be58dfc9",
    databaseId: "6628bdd1d0a957e2c465",
    usersCollectionId: "6628be48e2ac995891e6",
    videosCollectionId: "6628be8073a64fd72761",
    storageId: "6628c18beef0d23912ae",
};

import { Client, Account, ID, Avatars, Databases } from "react-native-appwrite";
// Init your react-native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async ({ email, password, username }) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            }
        );
        return newUser;
    } catch (error) {
        console.log("====================================");
        console.log(error);
        console.log("====================================");
        throw new Error(error);
    }
};

export const signIn = async ({ email, password }) => {
    try {
        const session = await account.createEmailSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error);
    }
};
