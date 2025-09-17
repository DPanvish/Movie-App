// This screen manages user authentication and profile info with sign in/up and sign out actions.
import {Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import React, {useMemo, useState} from 'react'
import {icons} from "@/constants/icons";
import {useRouter} from "expo-router";
import useFetch from "@/services/useFetch";
import {getCurrentUser, migrateDeviceSavedToUser, signIn, signOut, signUp} from "@/services/appwrite";
import {images} from "@/constants/images";

const Profile = () => {
    // To navigate between screens
    const router = useRouter();

    // To get the current user from the database
    const {data: user, loading, refetch} = useFetch(getCurrentUser);

    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [busy, setBusy] = useState(false);

    // useMemo is used to memoize the initials variable
    const initials = useMemo(() => (user?.name || user?.email || "?")
        .split(" ")
        .map(part => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(), [user]);

    // The below auth function is used to sign in or sign up the user
    const doAuth = async () => {
        try{
            setBusy(true);

            if(mode === "signin"){
                await signIn(email.trim(), password);
            }else{
                await signUp(email.trim(), password, name.trim());
            }

            await migrateDeviceSavedToUser().catch(() => {});
            await refetch();

            setEmail("");
            setPassword("");
            setName("");
        }catch(error){
            console.log("Error signing in: ", error);
        }finally{
            setBusy(false);
        }
    };

    // The below signOut function is used to sign out the user
    const doSignOut = async() => {
        try{
            setBusy(true);
            await signOut();
            await refetch();
        }catch(error){
            console.log("Error signing out: ", error);
        }finally{
            setBusy(false);
        }
    }

    return (
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className="absolute w-full z-0" />

            <ScrollView
                className="flex-1 px-5"
                contentContainerStyle={{minHeight: "100%", paddingBottom: 40}}
            >
                <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
                <Text className="text-white text-xl font-bold mb-6">Profile</Text>

                {/* Authenticated View */}
                {!!user && (
                    <View>
                        <View className="flex-row items-center bg-dark-100 rounded-xl p-4 mb-5">
                            <View className="w-12 h-12 rounded-full bg-accent items-center justify-center mr-3">
                                <Text className="text-white font-bold">{initials}</Text>
                            </View>

                            <View className="flex-1">
                                {/* @ts-ignore */}
                                <Text className="text-white font-semibold" numberOfLines={1}>{user.name || "Unnamed"}</Text>
                                <Text className="text-light-200 text-xs" numberOfLines={1}>{user.email}</Text>
                            </View>
                        </View>

                        <View className="bg-dark-100 rounded-xl p-4 mb-5">
                            <Text className="text-white font-semibold mb-2">Account</Text>
                            <Text className="text-light-200 text-xs">User ID: {user.id}</Text>
                            {!!user.registration && (
                                <Text className="text-light-200 text-xs mt-1">Joined: {new Date(user.registration).toLocaleDateString()}</Text>
                            )}
                        </View>

                        <TouchableOpacity
                            className="bg-accent rounded-full py-3.5 items-center mb-3"
                            onPress={() => router.push("/(tabs)/saved" as any)}
                        >
                            <Text className="text-white font-semibold">View Saved Movies</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-dark-100 rounded-full py-3.5 items-center"
                            onPress={doSignOut}
                        >
                            <Text className="text-white font-semibold">Sign out</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Guest View */}
                {!user && (
                    <View>
                        <Text className="text-white mb-4">Sign in to save movies and sync accross devices.</Text>

                        {mode === "signup" && (
                            <TextInput
                                placeholder="Name"
                                placeholderTextColor="#9ca3af"
                                value={name}
                                onChangeText={setName}
                                className="bg-dark-100 text-white rounded-xl px-4 py-3 mb-3"
                                autoCapitalize="words"
                            />
                        )}

                        <TextInput
                            placeholder={"Email"}
                            placeholderTextColor="#9ca3af"
                            value={email}
                            onChangeText={setEmail}
                            className="bg-dark-100 text-white rounded-xl px-4 py-3 mb-3"
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />

                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#9ca3af"
                            value={password}
                            onChangeText={setPassword}
                            className="bg-dark-100 text-white rounded-xl px-4 py-3 mb-4"
                            secureTextEntry
                        />

                        <TouchableOpacity
                            disabled={busy}
                            className="bg-accent rounded-full py-3.5 items-center mb-3"
                            onPress={doAuth}
                        >
                            <Text className="text-white font-semibold">{mode === "signin" ? "Sign in" : "Create account"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={busy}
                            className="bg-dark-100 rounded-full py-3.5 items-center"
                            onPress={() => setMode((m => (m === "signin" ? "signup" : "signin")))}
                        >
                            <Text className="text-white font-semibold">
                                {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}
export default Profile
const styles = StyleSheet.create({})
