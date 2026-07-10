import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Imported for redirection if needed
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

// Custom component to display the Logo, Links, and Logout button
function CustomDrawerContent(props) {
  const router = useRouter();
 

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: () => {
            // Add your logout state/auth clearing logic here
            console.log("User logged out");
            // Example: router.replace('/login');
          } 
        }
      ]
    );
  };

  return (
    // Changing the contentContainerStyle lets us flex grow the menu so the logout button sits neatly at the bottom
    <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500' }} 
          style={styles.logoImage} 
        />
        <Text style={styles.brandName}>Maitangaran</Text>
      </View>
      
      {/* This renders your actual drawer navigation links (like 'Home') */}
      <View style={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </View>

      {/* --- LOGOUT BUTTON AT THE BOTTOM --- */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
   const { user, setUser } = useContext(UserContext);
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
          name="dashboard"
          options={{
            drawerLabel: 'Dashboard',
            title: 'Dashboard',
            // This dynamically hides the row item from the sidebar menu if user is falsey
            drawerItemStyle: { display: user ? 'flex' : 'none' },
            drawerIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: 'Account Profile',
            title: 'Account Profile',
            drawerItemStyle: { display: user ? 'flex' : 'none' }, // hide this screen if the user is not login
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
            drawerItemStyle: { display: user ? 'flex' : 'none' },  // hide this screen if the user is not login
            drawerIcon: ({ color, size }) => (
              <Ionicons name="receipt-outline" size={size} color={color} />
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
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    padding: 20,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    marginTop: -4,
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
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6', // Subtle divider row right above logout
    marginBottom: 10,
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
    color: '#EF4444', // Red text color for semantic destructive action
    marginLeft: 12,
  },
});

