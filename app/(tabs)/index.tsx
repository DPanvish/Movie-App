import { Text, View } from "react-native";
import {Link} from "expo-router";

// For styling install the below packages
// npm install nativewind tailwindcss react-native-reanimated react-native-safe-area-context

// To initialize tailwindcss config file
// npx tailwindcss init

// () is called groups in react native
// for example  app/root/home.tsx is shown as /root/home
// but app/(root)/home.tsx is shown as /home
// This allows to hide the additional segments in the url

// [] is used to pass the url params to the file and change the file name dynamically

// (tabs) modify the bottom navigation of the app

// For changing the Icon, Name of the app go to app.json
// In app.json we can change the Icon, Name, ......

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
        <Text className="text-5xl text-dark-200 font-bold">Welcome!</Text>

    </View>
  );
}
