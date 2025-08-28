import { Stack } from "expo-router";
import "./globals.css"
import {StatusBar} from "react-native";

// This file is for the layout of the whole app

export default function RootLayout() {
  return(
      <>
          {/* This is to hide the status bar in the whole app*/}
          <StatusBar hidden={true}/>
          <Stack>

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
          </Stack>
      </>
    );
}
