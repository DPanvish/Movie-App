import { Stack } from "expo-router";
import "./globals.css"

// This file is for the layout of the whole app

export default function RootLayout() {
  return <Stack>

    {/* This is to hides the route groups header (tabs) in the (tabs)*/}
    <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
    />

    {/* This is to hide the header in the movie details page*/}
    <Stack.Screen
      name="movie/[id]"
      options={{ headerShown: false }}
    />
  </Stack>;
}
