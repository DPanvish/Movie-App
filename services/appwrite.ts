// track the searches made by a user

// The AppWrite SDK is used to interact with the Appwrite database
// "https://cloud.appwrite.io/console/organization-68a36d71000b28e4b405"

import {Client, Databases, ID, Query} from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID;

// Create a new Appwrite Client instance
const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

// Create a new Appwrite Databases instance
const database = new Databases(client)

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
}

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
}