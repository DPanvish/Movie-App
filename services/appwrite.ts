// track the searches made by a user

// The AppWrite SDK is used to interact with the Appwrite database
// "https://cloud.appwrite.io/console/organization-68a36d71000b28e4b405"

import {Client, Databases, ID, Query, Account, Models} from "react-native-appwrite";
import * as Application from "expo-application";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID;
const SAVED_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_TABLE_ID;

// Optional: provide a simple per-device id if no auth is in use
const DEVICE_ID = Application.getAndroidId?.() || Application.getIosIdForVendorAsync?.()?.toString?.() || "unknown-device";


/*
* This function is used to update the search count in the database
* It takes the search query and the movie object as parameters
* It then checks if a record of that search has already been stored in the database
* If a record is found, it increments the searchCount field
* If no record is found, it creates a new document in the database with the searchCount field set to 1
* The movie object is used to create a new document in the database with the following fields:
* searchTerm: The search query
* movie_id: The ID of the movie
* count: The number of times the search query was used
* title: The title of the movie
*/
export const updateSearchCount = async(query: string, movie: Movie) => {
    try{
        // @ts-ignore
        const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.equal("searchTerm", query),
        ])

        // check if a record of that search has already been stored
        // if a document is found increment the searchCount field
        // if no document is founrd create a new document in App Database with the searchCount field set to 1
        if(result.documents.length > 0){
            // This is the existing record which stored in the database and we need to update the searchCount field
            // result.documents[0] is the existing record or first record in the result.documents array (First movie in the result)
            const existingMovie = result.documents[0];

            // @ts-ignore
            await database.updateDocument(DATABASE_ID,
                TABLE_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count + 1,
                }
            )
        }else{
            // @ts-ignore
            await database.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
                searchTerm: query,
                movie_id: movie.id,
                count: 1,
                title: movie.title,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
        }
    }catch(error){
        console.log(error);
        throw error;
    }
};

/*
* This function is used to get the trending movies from the database
* It takes no parameters
* It returns a promise that resolves to an array of TrendingMovie objects
* The TrendingMovie interface is defined in the app/types.ts file
* The TrendingMovie interface has the following properties:
* title: string
* poster_url: string
* count: number
* movie_id: string
*  searchTerm: string
*/
export const getTrendingMovies = async(): Promise<TrendingMovie[] | undefined> => {
    try{
        // @ts-ignore
        const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.limit(5),
            Query.orderDesc('count'),
        ])

        return result.documents as unknown as TrendingMovie[];
    }catch (error){
        console.log(error);
        return undefined;
    }
};


// Create a new Appwrite Client instance
/*
* This function is used to create a new Appwrite Client instance
* It takes no parameters
* It returns a new instance of the Appwrite Client class
* The Appwrite Client class is used to interact with the Appwrite database
* The Appwrite Client class has the following properties:
* endpoint: string
* project: string
* database: Databases
* account: Account
* models: Models
*/
const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

// Create a new Appwrite Databases instance
/*
* This function is used to create a new Appwrite Databases instance
* It takes the Appwrite Client instance as a parameter
* It returns a new instance of the Appwrite Databases class
* The Appwrite Databases class is used to interact with the Appwrite database
* The Appwrite Databases class has the following properties:
* endpoint: string
* project: string
* database: Databases
*/

const database = new Databases(client);

// Create a new Appwrite Account instance
/*
* This function is used to create a new Appwrite Account instance
* It takes the Appwrite Client instance as a parameter
* It returns a new instance of the Appwrite Account class
* The Appwrite Account class is used to interact with the Appwrite account
* The Appwrite Account class has the following properties:
* endpoint: string
 */

const account = new Account(client);

// get the current user
export const getCurrentUser = async() : Promise<AppUser | null> => {
    try{
        // get the current user
        const user = await account.get();

        return{
            id: user.$id,
            name: user.name,
            email: user.email,
            emailVerification: (user as any).emailVerification,
            registration: (user as any).registration,
        };
    }catch(error){
        console.log(error); // not logged in
        return null;
    }
}

// sign up
export const signUp = async(email: string, password: string, name?: string) => {
    // Create an account then create session (auto-login)
    // create an account
    await account.create(ID.unique(), email, password, name ?? email.split("@")[0]);

    // create a session
    await account.createEmailPasswordSession(email, password);
    return getCurrentUser();
};


// sign in
export const signIn = async (email: string, password: string) => {
    // Create an account then create session (auto-login)
    await account.createEmailPasswordSession(email, password);
    return getCurrentUser();
};


// sign out
// delete all sessions for the current user
// this will log the user out of all devices
export const signOut = async() => {
    try{
        await account.deleteSessions();
    }catch(error){
        console.log(error);
    }
};


// require user to be logged in
// if the user is not logged in, throw an error
// this is used to ensure that the user is logged in before performing an action
const requireUser = async() => {
    const user = await getCurrentUser();

    if(!user){
        const error: any = new Error("AUTH REQUIRED");
        error.code = "AUTH_REQUIRED";
        throw error;
    }

    return user;
}



// save a movie to the database
/*
* This function is used to save a movie to the database
* It takes a movie object as a parameter
* It returns a promise that resolves to a SavedMovieDoc object
* The SavedMovieDoc interface is defined in the app/types.ts file
* The SavedMovieDoc interface has the following properties:
* movie_id: number
* title: string
* poster_url: string
* created_at: number
* device_id: string
*/
export const saveMovie = async(movie: {id: number, title: string, poster_path?: string | null}) => {

    // require user to be logged in
    const user = await requireUser();

    try{
        const poster_url = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "";

        // The existing variable is used to check if the movie is already saved
        // @ts-ignore
        const existing = await database.listDocuments(DATABASE_ID, SAVED_TABLE_ID, [
            Query.equal("movie_id", movie.id),
            Query.equal("user_id", user.id),
            Query.limit(1),
        ]);

        if(existing.documents.length > 0){
            return existing.documents[0] as unknown as SavedMovieDoc;
        }

        // The doc variable is used to create a new document in the database
        // @ts-ignore
        const doc = await database.createDocument(DATABASE_ID, SAVED_TABLE_ID, ID.unique(), {
            movie_id: movie.id,
            title: movie.title,
            poster_url,
            created_at: Date.now(),
            user_id: user.id,
        });

        return doc as unknown as SavedMovieDoc;
    }catch(error){
        console.log(error);
        throw error;
    }
};


// delete a movie from the database
/*
* This function is used to delete a movie from the database
* It takes a movieId as a parameter
* It returns a promise that resolves to a boolean value
* The movieId parameter is the ID of the movie to be deleted
* The function first checks if the movie is already saved in the database
* If the movie is found, it deletes the document from the database
* If the movie is not found, it returns false
* The function uses the database.listDocuments method to retrieve the documents from the database
* The function uses the database.deleteDocument method to delete the document
* The function returns a promise that resolves to a boolean value
*/

export const deleteSavedMovie = async(movieId: number) => {

    // require user to be logged in
    const user = await requireUser();

    try{
        // check if the movie is already saved in the database
        // @ts-ignore
        const res = await database.listDocuments(DATABASE_ID, SAVED_TABLE_ID, [
            Query.equal("movie_id", movieId),
            Query.equal("user_id", user.id),
            Query.limit(1),
        ]);

        if(res.documents.length === 0){
            return false;
        }

        // delete the document from the database
        // @ts-ignore
        await database.deleteDocument(DATABASE_ID, SAVED_TABLE_ID, res.documents[0].$id);
        return true;
    }catch(error){
        console.log(error);
        throw error;
    }
};


// check if a movie is saved in the database
/*
* This function is used to check if a movie is saved in the database
* It takes a movieId as a parameter
* It returns a promise that resolves to a boolean value
* The movieId parameter is the ID of the movie to be checked
* The function first checks if the movie is already saved in the database
* If the movie is found, it returns true
* If the movie is not found, it returns false
* The function uses the database.listDocuments method to retrieve the documents from the database
*/

export const isMovieSaved = async(movieId: number): Promise<boolean> => {

    // require user to be logged in
    const user = await requireUser();

    try{
        // @ts-ignore
        const res = await database.listDocuments(DATABASE_ID, SAVED_TABLE_ID, [
            Query.equal("movie_id", movieId),
            Query.equal("user_id", user.id),
            Query.limit(1),
        ]);

        return res.documents.length > 0;
    }catch(error){
        console.log(error);
        throw error;
    }
};

// list all saved movies
/*
* This function is used to list all saved movies from the database
* It takes no parameters
* It returns a promise that resolves to an array of SavedMovieDoc objects
* The SavedMovieDoc interface is defined in the app/types.ts file
* The SavedMovieDoc interface has the following properties:
* movie_id: number
* title: string
* poster_url: string
 */

export const listSavedMovies = async(): Promise<SavedMovieDoc[] | undefined> => {

    // require user to be logged in
    const user = await requireUser();

    try{
        // @ts-ignore
        const res = await database.listDocuments(DATABASE_ID, SAVED_TABLE_ID, [
            Query.equal("user_id", user.id),
            Query.orderDesc('created_at'),
        ]);

        return res.documents as unknown as SavedMovieDoc[];
    }catch(error){
        console.log(error);
        return [];
    }
};


// migrate device saved to user
/*
* This function is used to migrate device saved to user
* It takes no parameters
* It returns a promise that resolves to a number
* The number returned is the number of documents migrated
* The function first checks if the user is logged in
* If the user is not logged in, it returns 0
* If the user is logged in, it retrieves all documents from the SAVED_TABLE_ID collection
* For each document, it checks if the device_id matches the current device ID
*/

export const migrateDeviceSavedToUser = async() => {
    const user = await getCurrentUser();

    if(!user){
        return 0;
    }

    // @ts-ignore
    const res = await database.listDocuments(DATABASE_ID, SAVED_TABLE_ID, [
        Query.equal("device_id", DEVICE_ID),
    ]);

    let moved = 0;

    for(const doc of res.documents){
        try{
            // @ts-ignore
            await database.updateDocument(DATABASE_ID, SAVED_TABLE_ID, doc.$id, {
                user_id: user.id,
            });

            moved++;
        }catch(error){
            console.log(error);
        }

        return moved;
    }
}