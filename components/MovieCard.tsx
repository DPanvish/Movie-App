// This component shows a compact movie tile with poster, title, rating, and year that links to details.
import {View, Text, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import {Link} from "expo-router";
import {icons} from "@/constants/icons";

// Movie interface defines the structure of movie props passed into this card.

// TO DO: Use other objects of Movie and design your own movie card

const MovieCard = ({id, poster_path, title, vote_average, release_date}: Movie) => {
    return (
        // Clickable link to the movie details page

        <Link href={`/movies/${id}`} asChild>

            {/*TouchableOpacity is used to make the card clickable*/}
            {/*To make the card clickable we need to add onPress prop*/}
            {/*We can add onPress={() => console.log("Movie clicked")}*/}

            <TouchableOpacity className="w-[30%]">
                {/*Movie Image*/}
                <Image
                    source={{
                        uri: poster_path
                            ? `https://image.tmdb.org/t/p/w500${poster_path}`
                            : "https://placehold.co/600x400/1a1a1a/ffffff.png"
                    }}

                    className="w-full h-52 rounded-lg"
                    resizeMode="cover"
                />

                {/*Movie Title*/}
                {/*
                    number of lines is used to limit the number of lines to be displayed in the text component.
                    If the text is longer than the number of lines, it will be truncated with an ellipsis.
                */}
                <Text className="text-white text-sm font-bold mt-2" numberOfLines={1}>{title}</Text>

                {/*Movie rating*/}
                <View className="flex-row items-center justify-start gap-x-1">
                    <Image source={icons.star} className="size-4" />
                    <Text className="text-xs text-white font-bold uppercase">{Math.round(vote_average / 2)}</Text>
                </View>

                {/*Mopvie release date and type*/}
                <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-light-300 font-medium mt-1">{release_date?.split('-')[0]}</Text>
                    <Text className="text-xs font-medium text-light-300 uppercase">Movie</Text>
                </View>
            </TouchableOpacity>
        </Link>
    )
}
export default MovieCard
