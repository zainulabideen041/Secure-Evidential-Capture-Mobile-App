import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";

export default function Index() {
  // const { isAuthenticated } = useSelector((state) => state.auth);
  // const router = useRouter();

  // useEffect(()=>{
  //   if(isAuthenticated==="false")
  // },[isAuthenticated])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <ActivityIndicator size="large" color="white" />
    </View>
  );
}
