import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from 'axios';

// Custom component to display the Logo, Links, and Logout button
function CustomDrawerContent(props) {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // <--- Handled down below
  const { user, setUser } = useContext(UserContext);

  const token = user?.Token; 
 
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            try {
              const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/logout`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });

              // console.log(response);
              
              if (response.data.Success) {
                await AsyncStorage.removeItem('user');
                setUser(null); 
                router.replace('/login');
              }
            } catch (error) {
              console.log("Error during logout:", error);
              if (typeof setUser === 'function') {
                setUser(null);
              }
              router.replace('/login');
            }
          } 
        }
      ]
    );
  };

  return (
    <DrawerContentScrollView 
      {...props} 
      // Removed standard default safe paddings so our custom headers/footers control it precisely
      disableSafeArea
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* --- TOP INSET APPLIED HERE --- */}
      {/* Replaced marginTop: -4 with dynamic paddingTop to cleanly pad out the status bar */}
      <View style={[styles.logoContainer, { paddingTop: insets.top + 16 }]}>
        <Image 
          source={require('../../assets/images/icon.png')} 
          style={styles.logoImage} 
        />
        <Text style={styles.brandName}>Maitangaran</Text>
      </View>
      
      {/* Drawer navigation links */}
      <View style={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </View>

      {/* --- BOTTOM INSET APPLIED HERE --- */}
       {user && (
        <View style={[styles.logoutContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
       )}
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
      const ctx = useContext(UserContext) as any;
      const user = ctx?.user;  // help so the user dosent appear as red

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          header: () => <CustomHeader />,
          drawerStyle: {
            backgroundColor: '#FFFFFF',
          },
          drawerActiveTintColor: '#000000',
          drawerInactiveTintColor: '#6B7280',
          drawerLabelStyle: {
            marginLeft: 0,
            fontSize: 14,
            fontWeight: '600',
          },
          drawerItemStyle: {
            marginVertical: 4,
          },
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            title: 'Home',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: 'Account Profile',
            title: 'Account Profile',
            drawerItemStyle: { display: user ? 'flex' : 'none' }, 
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="orders"
          options={{
            drawerLabel: 'Order Ledger',
            title: 'Order Ledger',
            drawerItemStyle: { display: user ? 'flex' : 'none' },  
            drawerIcon: ({ color, size }) => (
              <Ionicons name="receipt-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="change-password"
          options={{
            drawerLabel: 'Change Password',
            title: 'Change Password',
            drawerItemStyle: { display: user ? 'flex' : 'none' },
            drawerIcon: ({ color, size }) => (
              <Ionicons name="lock-closed-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="about-us"
          options={{
            drawerLabel: 'About Us',
            title: 'About Us',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="business-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="contact-us"
          options={{
            drawerLabel: 'Contact Us',
            title: 'Contact Us',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="mail-outline" size={size} color={color} />
            ),
          }}
        />

        {/* Hidden Screens */}
        <Drawer.Screen name="signup" options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="single-product" options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="checkout" options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="order-details" options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="success" options={{ drawerItemStyle: { display: "none" } }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    marginBottom: 10,
    alignItems: 'center',
  },
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoutContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6', 
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444', 
    marginLeft: 12,
  },
});
