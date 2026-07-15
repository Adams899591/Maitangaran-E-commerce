import { Stack } from "expo-router";
import "../global.css"; // Note:    This should always be on your layout
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "./context/UserContext";
import { CartContext } from "./context/CartContext";
import { SafeAreaProvider} from "react-native-safe-area-context";

export default function RootLayout() {

    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);


  // Load user data from AsyncStorage when the app starts
  useEffect(() => {
    // Check for stored user data when the app starts
    const loadUser = async () => {
      try {
          const savedUser = await AsyncStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error("Failed to load user from storage", e);
      }
    };
    loadUser();
  }, [ ]);


  return (
  
    
    <UserContext.Provider value={{ user, setUser }}>
      <CartContext.Provider value={{ cartCount, setCartCount }}>
        <SafeAreaProvider> 
            <Stack screenOptions={{headerShown: false}} />
          </SafeAreaProvider>
      </CartContext.Provider>
    </UserContext.Provider>
   
  
  );
}
