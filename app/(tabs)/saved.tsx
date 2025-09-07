import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import {icons} from "@/constants/icons";
import {useRouter} from "expo-router";
import useFetch from "@/services/useFetch";
import {deleteSavedMovie, listSavedMovies} from "@/services/appwrite";

const Saved = () => {
    const router = useRouter();

    // To get the saved movies from the database
    const {data: savedMovies, loading, error, refetch} = useFetch(listSavedMovies);

    const onOpenMovie = useCallback((movieId: number) => {
        router.push(`/movies/${movieId}` as any);
    }, [router]);

    const onDelete = useCallback(async (movieId: number) => {
        try{
            await deleteSavedMovie(movieId);
            await refetch();
        }catch(error){
            console.log("Error deleting movie: ", error);
        }
    }, [refetch])
    return (
        <View className="bg-primary flex-1 px-10">
            <View className="flex justify-center items-center flex-1 flex-col gap-5">
                <Image source={icons.save} className="size-10" tintColor="#fff" />
                <Text className="text-gray-500 text-base">Save</Text>
            </View>
        </View>
    )
}
export default Saved
const styles = StyleSheet.create({})
