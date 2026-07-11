import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // 1. Import hook

export default function TabLayout() {
  const insets = useSafeAreaInsets(); // 2. Initialize insets

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Minimalist Black & White Theme Styling
        tabBarActiveTintColor: "#000000",   // Active tab color
        tabBarInactiveTintColor: "#9CA3AF", // Inactive tab color (Gray 400)
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",        // Subtle gray top border
          backgroundColor: "#FFFFFF",
          // 3. Dynamic heights and paddings using insets
          height: 64 + insets.bottom,
          paddingBottom: 10 + insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: -0.2,
        },
      }}
    >
      {/* 1. Home Screen */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />

      {/* 2. Search & Discovery */}
      <Tabs.Screen
        name="search"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "search" : "search-outline"} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />

      {/* 3. Cart Management */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "bag-handle" : "bag-handle-outline"} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />

      {/* 4. Login */}
      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "log-in" : "log-in-outline"} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}