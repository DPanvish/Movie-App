import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {Tabs} from "expo-router";


// This file is for the layout of the all the tabs

const _Layout = () => {
    return (
        <Tabs>
            {/*This hides the main header of index.tsx file in the tabs*/}
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false,
                }}
            />

            {/*This hides the main header of profile.tsx file in the tabs*/}
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                }}
            />

            {/*This hides the main header of saved.tsx file in the tabs*/}
            <Tabs.Screen
                name="saved"
                options={{
                    title: "Saved",
                    headerShown: false,
                }}
            />

            {/*This hides the main header of search.tsx file in the tabs*/}
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    headerShown: false,
                }}
            />
        </Tabs>
    )
}
export default _Layout
const styles = StyleSheet.create({})
