
// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   ImageBackground,
//   Animated,
//   StatusBar,
//   Easing,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";

// export default function Index() {
//   const router = useRouter();

//   const [count, setCount] = useState(100);

//   const fade = useRef(new Animated.Value(0)).current;
//   const scale = useRef(new Animated.Value(0.9)).current;
//   const bar = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fade, {
//         toValue: 1,
//         duration: 1200,
//         useNativeDriver: true,
//       }),

//       Animated.spring(scale, {
//         toValue: 1,
//         friction: 5,
//         useNativeDriver: true,
//       }),

//       Animated.timing(bar, {
//         toValue: 100,
//         duration: 3000,
//         easing: Easing.linear,
//         useNativeDriver: false,
//       }),
//     ]).start();

//     let value = 100;

//     const interval = setInterval(() => {
//       value--;

//       setCount(value);

//       if (value <= 0) {
//         clearInterval(interval);

//         setTimeout(() => {
//           router.replace("/(drawer)/home");
//         }, 10000);
//       }
//     }, 30);

//     return () => clearInterval(interval);
//   }, []);

//   const width = bar.interpolate({
//     inputRange: [0, 100],
//     outputRange: ["0%", "100%"],
//   });

//   return (
//     <ImageBackground
//       source={{
//         // uri: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200",
//         uri: "https://images.unsplash.com/photo-1513094735237-8f2714d57c13?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       }}
//       resizeMode="cover"
//       style={{ flex: 1 }}
//     >
//       <StatusBar barStyle="light-content" />

//       <LinearGradient
//         colors={[
//           "rgba(0,0,0,0.75)",
//           "rgba(0,0,0,0.55)",
//           "rgba(0,0,0,0.90)",
//         ]}
//         style={{
//           flex: 1,
//           justifyContent: "space-between",
//           paddingHorizontal: 25,
//           paddingTop: 80,
//           paddingBottom: 60,
//         }}
//       >
//         <Animated.View
//           style={{
//             opacity: fade,
//             transform: [{ scale }],
//             alignItems: "center",
//           }}
//         >
//           <Text
//             style={{
//               color: "#fff",
//               fontSize: 34,
//               fontWeight: "900",
//               letterSpacing: 2,
//             }}
//           >
//             MAITANGARAN
//           </Text>

//           <Text
//             style={{
//               color: "#ddd",
//               marginTop: 10,
//               letterSpacing: 3,
//               fontSize: 13,
//             }}
//           >
//             Premium Fabrics Collection
//           </Text>
//         </Animated.View>

//         <Animated.View
//           style={{
//             opacity: fade,
//             alignItems: "center",
//           }}
//         >
//           <Text
//             style={{
//               color: "#fff",
//               fontSize: 90,
//               fontWeight: "900",
//             }}
//           >
//             {count}
//           </Text>

//           <Text
//             style={{
//               color: "#ddd",
//               letterSpacing: 5,
//               marginTop: -8,
//             }}
//           >
//             %
//           </Text>

//           <Text
//             style={{
//               color: "#fff",
//               marginTop: 25,
//               fontSize: 15,
//               letterSpacing: 2,
//             }}
//           >
//             Loading Collection...
//           </Text>
//         </Animated.View>

//         <View>
//           <View
//             style={{
//               height: 4,
//               backgroundColor: "rgba(255,255,255,0.25)",
//               borderRadius: 10,
//               overflow: "hidden",
//             }}
//           >
//             <Animated.View
//               style={{
//                 width,
//                 height: 4,
//                 backgroundColor: "#fff",
//               }}
//             />
//           </View>

//           <Text
//             style={{
//               color: "#bbb",
//               textAlign: "center",
//               marginTop: 18,
//               letterSpacing: 3,
//               fontSize: 11,
//             }}
//           >
//             Luxury • Elegance • Quality
//           </Text>
//         </View>
//       </LinearGradient>
//     </ImageBackground>
//   );
// }



import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Animated,
  StatusBar,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  // Change this to any duration you want (milliseconds)
  const LOADING_TIME = 10000; // 10 seconds
  const START_COUNT = 100;

  const [count, setCount] = useState(START_COUNT);

  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const bar = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),

      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),

      Animated.timing(bar, {
        toValue: 100,
        duration: LOADING_TIME,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();

    let value = START_COUNT;

    const interval = setInterval(() => {
      value--;

      setCount(value);

      if (value <= 0) {
        clearInterval(interval);

        router.replace("/(drawer)/home");
      }
    }, LOADING_TIME / START_COUNT);

    return () => clearInterval(interval);
  }, []);

  const width = bar.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1513094735237-8f2714d57c13?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      }}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[
          "rgba(0,0,0,0.75)",
          "rgba(0,0,0,0.55)",
          "rgba(0,0,0,0.90)",
        ]}
        style={{
          flex: 1,
          justifyContent: "space-between",
          paddingHorizontal: 25,
          paddingTop: 80,
          paddingBottom: 60,
        }}
      >
        {/* Header */}
        <Animated.View
          style={{
            opacity: fade,
            transform: [{ scale }],
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 34,
              fontWeight: "900",
              letterSpacing: 2,
            }}
          >
            MAITANGARAN
          </Text>

          <Text
            style={{
              color: "#ddd",
              marginTop: 10,
              letterSpacing: 3,
              fontSize: 13,
            }}
          >
            Premium Fabrics Collection
          </Text>
        </Animated.View>

        {/* Countdown */}
        <Animated.View
          style={{
            opacity: fade,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 90,
              fontWeight: "900",
            }}
          >
            {count}
          </Text>

          <Text
            style={{
              color: "#ddd",
              letterSpacing: 5,
              marginTop: -8,
            }}
          >
            %
          </Text>

          <Text
            style={{
              color: "#fff",
              marginTop: 25,
              fontSize: 15,
              letterSpacing: 2,
            }}
          >
            Loading Collection...
          </Text>
        </Animated.View>

        {/* Progress Bar */}
        <View>
          <View
            style={{
              height: 4,
              backgroundColor: "rgba(255,255,255,0.25)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <Animated.View
              style={{
                width,
                height: 4,
                backgroundColor: "#fff",
              }}
            />
          </View>

          <Text
            style={{
              color: "#bbb",
              textAlign: "center",
              marginTop: 18,
              letterSpacing: 3,
              fontSize: 11,
            }}
          >
            Luxury • Elegance • Quality
          </Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}