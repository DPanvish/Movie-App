import {Image, StyleSheet, Text, View} from 'react-native'
import React, {useMemo, useState} from 'react'
import {icons} from "@/constants/icons";
import {useRouter} from "expo-router";
import useFetch from "@/services/useFetch";
import {getCurrentUser, signIn} from "@/services/appwrite";

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

    const doAuth = async () => {
        try{
            setBusy(true);

            if(mode === "signin"){
                await signIn(email.trim(), password);
            }
        }catch(error){
            console.log("Error signing in: ", error);
        }
    }

    return (
        <View className="bg-primary flex-1 px-10">
            <View className="flex justify-center items-center flex-1 flex-col gap-5">
                <Image source={icons.person} className="size-10" tintColor="#fff" />
                <Text className="text-gray-500 text-base">Profile</Text>
            </View>
        </View>
    )
}
export default Profile
const styles = StyleSheet.create({})
