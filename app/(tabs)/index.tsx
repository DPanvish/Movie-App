import {ActivityIndicator, FlatList, Image, ScrollView, Text, View} from "react-native";
import {Link} from "expo-router";
import {images} from "@/constants/images";
import {icons} from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import {useRouter} from "expo-router";
import {use} from "react";
import useFetch from "@/services/useFetch";
import {fetchMovies} from "@/services/api";
import MovieCard from "@/components/MovieCard";

// Home Page

/* Some of the Instructions*/
// For styling install the below packages
// npm install nativewind tailwindcss react-native-reanimated react-native-safe-area-context

// To initialize tailwindcss config file
// npx tailwindcss init
//
// () is called groups in react native
// for example  app/root/home.tsx is shown as /root/home
// but app/(root)/home.tsx is shown as /home
// This allows to hide the additional segments in the url

// [] is used to pass the url params to the file and change the file name dynamically
//
// (tabs) modify the bottom navigation of the app
//
// For changing the Icon, Name of the app go to app.json
// In app.json we can change the Icon, Name, ......

export default function Index() {
    const router = useRouter();

    const {data: movies, loading: moviesLoading, error: moviesError} = useFetch(() => fetchMovies({query: ""}));

  return (
    <View className="flex-1 bg-primary">
        <Image source={images.bg} className="absolute w-full z-0"/>

        {/*To add the scroll effect we to type all the content inside the ScrollView. It is similar to view but scroll is added*/}
        {/*showVerticalScrollIndicator={false} hides the scrollbar*/}
        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{minHeight: "100%", paddingBottom: 10}}>
            <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

            {/*If the movie is loading then show the activity indicator else show the movies*/}/}
            {moviesLoading ? (
                <ActivityIndicator
                    size="large"
                    color="#000ff"
                    className="mt-10 self-center"
                />
            ) : moviesError ? (
                <Text>Error: {moviesError?.message}</Text>
            ) : (
                <View className="flex-1 mt-5">
                    <SearchBar
                        onPress={() => router.push("/search")}
                        placeholder="Search for a movie"
                    />

                    <>
                        <Text className="text-lg text-white font-bold mt-5 mb-3">Latest Movies</Text>

                        {/*
                            FlatList in React Native is a core component used for efficiently rendering large, scrollable lists of data.
                            It is designed to handle performance optimization by only rendering the items that are currently visible on the screen, a concept known as "virtualization."
                            This approach significantly improves performance and memory usage compared to rendering all list items at once, which can be problematic for long lists.
                            Key Props and Features:
                            1) data: An array of items to be rendered in the list. This is a mandatory prop.
                            2) renderItem: A function that takes an item from the data array and returns the React Native components to render for that item.
                            This is also a mandatory prop. It receives an object containing the item itself and its index.
                            3) keyExtractor: A function that takes an item and its index and returns a unique key for each item.
                            This is crucial for performance and proper list rendering, especially when items are added, removed, or reordered.
                            4) numColumn: number of columns in the list.
                            5) columnWrapperStyles: styling for the columns
                            6) scrollEnabled: scroll for the individual row
                            And soon there are many props.......
                        */}

                        {/*For more details refer this docs "https://reactnative.dev/docs/flatlist"*/}

                        <FlatList
                            data={movies}
                            renderItem={({item}) => (
                                // MoviesCard displays the info and image of the movie. item is each movie in movies array
                                // each item has different keys
                                <MovieCard {...item}/>
                            )}
                            keyExtractor={(item) => item.id.toString()}

                            numColumns={3}
                            columnWrapperStyle={{
                                justifyContent: "flex-start",
                                gap: 20,
                                padding: 5,
                                marginBottom: 10
                            }}
                            className="mt-2 pb-32"
                            scrollEnabled={false}
                        />
                    </>
                </View>
            )}


        </ScrollView>
    </View>
  );
}
