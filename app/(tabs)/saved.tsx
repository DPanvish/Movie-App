import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback} from 'react';
import {icons} from "@/constants/icons";
import {useRouter} from "expo-router";
import useFetch from "@/services/useFetch";
import {deleteSavedMovie, listSavedMovies} from "@/services/appwrite";
import {images} from "@/constants/images";

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
    }, [refetch]);

    const renderItem = ({item}: {item: SavedMovieDoc}) => (
        <TouchableOpacity
            className="flex-row items-center bg-dark-100 rounded-xl p-3 mb-3"
            onPress={() => onOpenMovie(item.movie_id)}
            activeOpacity={0.8}
        >
            {/* if the movie has poster_url then show the image else show the placeholder image */}
            {!!item.poster_url && (
                <Image source={{uri: item.poster_url}} className="w-14 h-20 rounded-lg mr-3" />
            )}

            <View className="flex-1">
                <Text numberOfLines={1} className="text-white font-semibold">{item.title}</Text>
                <Text className="text-light-200 text-xs mt-1">
                    Saved {new Date(item.createdAt).toLocaleDateString()}
                </Text>
            </View>

            <TouchableOpacity
                className="p-2"
                onPress={() => onDelete(item.movie_id)}
            >
                <Image source={icons.trash ?? icons.save} className="size-5" tintColor="#f87171" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View className="bg-primary flex-1">
            <Image source={images.bg} className="absolute w-full z-0"/>
            <FlatList
                data={savedMovies ?? []}
                renderItem={renderItem}
                keyExtractor={(item) => item.$id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ minHeight: "100%", paddingBottom: 24, paddingHorizontal: 20 }}
                refreshing={loading}
                onRefresh={refetch}
                ListHeaderComponent={(
                    <View>
                        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
                        <Text className="text-white text-xl font-bold mb-4">Saved Movies</Text>
                        {error && (
                            <Text className="text-red-400 mb-2">Failed to load saved movies</Text>
                        )}
                    </View>
                )}
                ListEmptyComponent={!loading ? (
                    <View className="flex-1 items-center mt-20">
                        <Image source={icons.save} className="size-8 mb-3" tintColor="#9ca3af" />
                        <Text className="text-gray-400">No saved movies yet</Text>
                    </View>
                ) : null}
            />
        </View>
    );
}
export default Saved
const styles = StyleSheet.create({})
