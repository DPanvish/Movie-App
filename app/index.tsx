import { Text, View } from "react-native";

// For styling install the below packages
// npm install nativewind tailwindcss react-native-reanimated react-native-safe-area-context

// To initialize tailwindcss config file
// npx tailwindcss init


export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
        <Text className="text-5xl text-dark-200 font-bold">Welcome!</Text>
    </View>
  );
}
