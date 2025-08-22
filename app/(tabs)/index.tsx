import {Image, ScrollView, Text, View} from "react-native";
import {Link} from "expo-router";
import {images} from "@/constants/images";
import {icons} from "@/constants/icons";
import SearchBar from "@/components/SearchBar";

// Home Page

/* Some of the Instructions*/
// For styling install the below packages
// npm install nativewind tailwindcss react-native-reanimated react-native-safe-area-context
//
// To initialize tailwindcss config file
// npx tailwindcss init
//
// () is called groups in react native
// for example  app/root/home.tsx is shown as /root/home
// but app/(root)/home.tsx is shown as /home
// This allows to hide the additional segments in the url
//
// [] is used to pass the url params to the file and change the file name dynamically
//
// (tabs) modify the bottom navigation of the app
//
// For changing the Icon, Name of the app go to app.json
// In app.json we can change the Icon, Name, ......

export default function Index() {
  return (
    <View className="flex-1 bg-primary">
        <Image source={images.bg} className="absolute w-full z-0"/>

        {/*To add the scroll effect we to type all the content inside the ScrollView. It is similar to view but scroll is added*/}
        {/*showVerticalScrollIndicator={false} hides the scrollbar*/}
        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{minHeight: "100%", paddingBottom: 10}}>
            <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

            <View className="flex-1 mt-5">
                <SearchBar />
            </View>
        </ScrollView>
    </View>
  );
}
