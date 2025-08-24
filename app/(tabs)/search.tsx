import {ActivityIndicator, FlatList, Image, StyleSheet, Text, View} from 'react-native'
import React, {useEffect, useState} from 'react'
import {images} from "@/constants/images";
import MovieCard from "@/components/MovieCard";
import useFetch from "@/services/useFetch";
import {fetchMovies} from "@/services/api";
import {useRouter} from "expo-router";
import {icons} from "@/constants/icons";
import SearchBar from "@/components/SearchBar";


const Search = () => {

    const [searchQuery, setSearchQuery] = useState("");

    const {data: movies, loading, error, refetch: loadMovies, reset} = useFetch(() => fetchMovies({query: searchQuery}));

    // The below code is used to search the movies
    useEffect(() => {
        const timeoutId = setTimeout( async() => {
            // If the search query is not empty then load the movies else reset the movies
            if(searchQuery.trim()){
                await loadMovies();
            }else{
                reset();
            }
        }, 500);

        return () => clearTimeout(timeoutId);

    }, [searchQuery])

    return (
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode="cover"/>

            {/*
                FlatList in React Native is a core component used for efficiently rendering large, scrollable lists of data.
                ListHeaderComponent is used to render a component at the top of the list.
                ListEmptyComponent is used to render a component when the list is empty.
            */}
            <FlatList
                data={movies}
                renderItem={({item}) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                className="px-5"
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: "center",
                    gap: 16,
                    marginVertical: 16,
                }}
                contentContainerStyle={{paddingBottom: 100}}
                ListHeaderComponent={
                    <>
                        <View className="w-full flex-row justify-center mt-20 items-center">
                            <Image source={icons.logo} className="w-12 h-10" />
                        </View>

                        <View className="my-5">
                            <SearchBar
                                placeholder="Search movies ..."
                                value={searchQuery}
                                onChangeText={(text: string) => setSearchQuery(text)}
                            />
                        </View>

                        {/*If the movie is loading then show the activity indicator else show the movies.*/}
                        {loading && (
                            <ActivityIndicator size="large" color="#0000ff" className="my-3" />
                        )}

                        {/*If the movie is loading then show the activity indicator else show the movies.*/}
                        {error && (
                            <Text className="text-red-500 pax-5 my-3">
                                Error: {error?.message}
                            </Text>
                        )}

                        {/*If the movie is not loading and not error then show the movies*/}
                        {!loading && !error && searchQuery.trim() && (movies?.length ?? 0) > 0 && (
                            <Text className="text-white">
                                Search Results for{" "}
                                <Text className="text-accent">{searchQuery}</Text>
                            </Text>
                        )}
                    </>
                }
                ListEmptyComponent={
                    !loading && !error ? (
                        <View className="mt-10 pax-5">
                            <Text className="text-white text-gray-500">
                                {searchQuery.trim() ? "No results found" : "Search for movies to see results"}
                            </Text>
                        </View>
                    ) : null
                }
            />
        </View>
    )
}
export default Search
const styles = StyleSheet.create({})
