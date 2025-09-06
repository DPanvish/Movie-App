import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React, {useEffect, useMemo, useState} from 'react'
import {router, useLocalSearchParams} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchMovieDetails} from "@/services/api";
import {icons} from "@/constants/icons";
import {isMovieSaved} from "@/services/appwrite";

// Movie interface is used to define the structure of the movie object. Which is present in the interface.ts
interface MovieInfoProps{
    label: string;
    value?: string | number | null;
}

// MovieInfo component is used to display the movie information
const MovieInfo = ({label, value}: MovieInfoProps) => {
    return(
        <View className="flex-col items-start justify-center mt-5">
            <Text className="text-light-200 font-normal text-sm">{label}</Text>
            <Text className="text-light-100 font-bold text-sm mt-2">{value || "N/A"}</Text>
        </View>
    );
}

// MovieDetails component is used to display the movie details
const MovieDetails = () => {

    // useLocalSearchParams is used to get the movie id from the url
    const {id} = useLocalSearchParams();

    // useMemo is used to memoize the movieId variable
    const movieId = useMemo(() => Number(id), [id]);

    // useFetch is used to fetch the movie details from the api
    const {data: movie, loading} = useFetch(() => fetchMovieDetails(id as string));

    const [saved, setSaved] = useState(false);
    const [busy, setBusy] = useState(false);

    // useEffect is used to check if the movie is saved in the database
    useEffect(() => {
        let mounted = true;
        (async() => {
            if(!movieId){
                return;
            }

            // Check if the movie is saved in the database
            const s = await isMovieSaved(movieId);

            // If the movie is saved in the database then set the saved state to true
            if(mounted){
                setSaved(s);
            }
        })();

        // Cleanup function to set the mounted state to false when the component unmounts
        return () => {
            mounted = false;
        };
    }, [movieId]);

    return (
        <View className="flex-1 bg-primary">
            <ScrollView contentContainerStyle={{paddingBottom: 80}}>
                <View>
                    <Image source={{uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`}} className="w-full h-[550px]"/>
                </View>

                <View className="flex-col items-start justify-center mt-5 px-5">
                    <Text className="text-white font-bold text-xl">{movie?.title}</Text>

                    <View className="flex-row items-center gap-x-1 mt-2">
                        <Text className="text-light-200 text-sm">{movie?.release_date?.split('-')[0]}</Text>
                        <Text className="text-light-200 text-sm">{movie?.runtime}mins</Text>
                    </View>

                    <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
                        <Image source={icons.star} className="size-4"/>
                        <Text className="text-white font-bold text-sm">{Math.round(movie?.vote_average ?? 0)}/10</Text>
                        <Text className="text-light-200 text-sm">({movie?.vote_count} votes)</Text>
                    </View>

                    <MovieInfo label="Overview" value={movie?.overview}/>
                    <MovieInfo label="Genres" value={movie?.genres?.map((genre) => genre.name).join(" - ") || "N/A"}/>

                    <View className="flex flex-row justify-between w-1/2">
                        <MovieInfo label="Budget" value={`$${movie?.budget ?? 0/ 1_000_000} million`}/>
                        <MovieInfo label="Revenue" value={`$${Math.round(movie?.revenue ?? 0/ 1_000_000)} million`}/>
                    </View>

                    <MovieInfo label="Production Companies" value={movie?.production_companies?.map((company) => company.name).join(" - ") || "N/A"}/>
                </View>
            </ScrollView>

            <TouchableOpacity className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-full py-3.5 flex flex-row items-center justify-center z-50" onPress={router.back}>
                <Image source={icons.arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor="#fff" />
                <Text className="text-white font-semibold text-base">Go back</Text>
            </TouchableOpacity>
        </View>
    )
}

export default MovieDetails
const styles = StyleSheet.create({})
