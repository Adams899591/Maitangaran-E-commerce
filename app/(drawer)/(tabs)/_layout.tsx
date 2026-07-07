import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
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
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          backgroundColor: "#FFFFFF",
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

      {/* 4. Order History */}
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "receipt" : "receipt-outline"} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />

      {/* 5. User Profile & Settings */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}