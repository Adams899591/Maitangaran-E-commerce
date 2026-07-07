import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";


export default function Index() {
  const router =  useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity  onPress={() => router.push("/(drawer)/(tabs)/home")}>
            <Text >Edit app/index.tsx to edit this screen.  </Text>
      </TouchableOpacity>
      <TouchableOpacity  onPress={() => router.push("/screen/single-product")}>
            <Text >Edit app/index.tsx to edit this screen.  </Text>
      </TouchableOpacity>
     
    </View>
  );
}




// import React, { useEffect, useRef } from "react";
// import {
//   View,
//   SafeAreaView,
//   StatusBar,
//   Text,
//   Animated,
// } from "react-native";

// export default function HomeScreen() {
//   const scale = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(scale, {
//           toValue: 1.08,
//           duration: 700,
//           useNativeDriver: true,
//         }),
//         Animated.timing(scale, {
//           toValue: 1,
//           duration: 700,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, []);

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <StatusBar
//         barStyle="dark-content"
//         backgroundColor="#FFFFFF"
//       />

//       <View className="flex-1 items-center justify-center">
//         <Animated.View
//           style={{ transform: [{ scale }] }}
//           className="w-28 h-28 rounded-full bg-black items-center justify-center"
//         >
//           <Text className="text-white text-4xl font-bold">
//             S
//           </Text>
//         </Animated.View>

//         <Text className="text-3xl font-bold text-black mt-8">
//           ShopEase
//         </Text>

//         <Text className="text-gray-500 mt-3">
//           Please wait...
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// }