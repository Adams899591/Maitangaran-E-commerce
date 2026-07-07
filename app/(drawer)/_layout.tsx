import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import { Ionicons } from '@expo/vector-icons';

// Custom component to display the Logo and Name at the top of the drawer
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.logoContainer}>
        {/* Replace the source uri with your local asset path if needed, e.g., require('../assets/logo.png') */}
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500' }} 
          style={styles.logoImage} 
        />
        <Text style={styles.brandName}>Maitangaran</Text>
      </View>
      {/* This renders your actual drawer navigation links (like 'Home') right below the header */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        // Injecting our custom header content here
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        
        screenOptions={{
          // Use our custom header across all drawer screens
          header: () => <CustomHeader />,

          // --- Professional Drawer Styling ---
          drawerStyle: {
            backgroundColor: '#FFFFFF', // White background for the drawer list area
          },
          drawerActiveTintColor: '#000000', // Black for active item
          drawerInactiveTintColor: '#6B7280', // Gray for inactive items
          drawerLabelStyle: {
            marginLeft: 0, // Kept at 0 so icon and text don't overlap
            fontSize: 14,
            fontWeight: '600',
          },
          drawerItemStyle: {
            marginVertical: 4, // Add some space between items
          },
        }}
      >
        {/* Main entry point which is your tab layout */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            title: 'Home',
            drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          }}
        />

        {/* Login Screen */}
        <Drawer.Screen
          name="login"
          options={{
            drawerLabel: 'Login',
            title: 'Login',
            drawerIcon: ({ color, size }) => <Ionicons name="log-in-outline" size={size} color={color} />,
          }}
        />

        {/* Sign Up Screen */}
        <Drawer.Screen
          name="signup"
          options={{
            drawerLabel: 'Sign Up',
            title: 'Sign Up',
            drawerIcon: ({ color, size }) => <Ionicons name="person-add-outline" size={size} color={color} />,
          }}
        />

        {/* Sign Up Screen */}
        <Drawer.Screen
          name="single-product"
          options={{
            drawerItemStyle: {
              display: "none"
            }
          }}
        />

      </Drawer>
    </GestureHandlerRootView>
  );
}

// Minimal styles to keep things clean and professional
const styles = StyleSheet.create({
  logoContainer: {
    padding: 20,
    backgroundColor: '#000000', // Added black background to the image section
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937', // Darker subtle line to match the black header
    marginTop: -4, // Counteract internal scrollview padding to align nicely at the top
    marginBottom: 10,
    alignItems: 'center', // Centers logo and text
  },
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: 30, // Makes it a clean circle
    marginBottom: 10,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF', // Changed to white for high contrast against the black section
  },
});