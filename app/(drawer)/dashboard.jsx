import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Importing Expo Router for navigation

export default function UserDashboard() {
  const router = useRouter();

  // Mock data representing a typical customer profile
  const userProfile = {
    name: "Alhaji Musa",
    type: "Wholesale Partner",
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      
      {/* Welcome Banner */}
      <View className="bg-black p-6 rounded-b-2xl flex-row justify-between items-center shadow-md">
        <View>
          <Text className="text-gray-400 text-xs font-medium">Welcome back,</Text>
          <Text className="text-white text-2xl font-bold mt-0.5">{userProfile.name}</Text>
          <View className="bg-neutral-800 px-2 py-0.5 rounded mt-2 self-start">
            <Text className="text-gray-200 text-xs font-semibold">{userProfile.type}</Text>
          </View>
        </View>
        <Ionicons name="person-circle-outline" size={52} color="#FFFFFF" />
      </View>

      {/* Main Navigation Grid */}
      <View className="p-4 space-y-3">
        <View className="flex-row space-x-3">
          {/* Track Orders Button Card */}
          <TouchableOpacity 
            onPress={() => router.push('/orders')} 
            className="bg-white flex-1 p-6 rounded-xl border border-gray-200 items-center justify-center shadow-sm active:bg-gray-50"
          >
            <Ionicons name="receipt-outline" size={26} color="#000000" />
            <Text className="text-sm font-bold text-black mt-2">Track Orders</Text>
          </TouchableOpacity>

          {/* My Profile Button Card */}
          <TouchableOpacity 
            onPress={() => router.push('/profile')} 
            className="bg-white flex-1 p-6 rounded-xl border border-gray-200 items-center justify-center shadow-sm active:bg-gray-50"
          >
            <Ionicons name="person-outline" size={26} color="#000000" />
            <Text className="text-sm font-bold text-black mt-2">My Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions / Shortcuts */}
      <Text className="text-base font-bold text-black px-4 mt-4">Quick Actions</Text>
      <View className="flex-row p-4 space-x-3 mb-8">
        <TouchableOpacity 
          onPress={() => router.push('/shop')}
          className="flex-1 flex-row items-center justify-center bg-white border border-black py-3.5 rounded-lg space-x-2 active:bg-gray-50"
        >
          <Ionicons name="cart-outline" size={18} color="#000000" />
          <Text className="text-black font-semibold text-sm">Browse Fabrics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-white border border-black py-3.5 rounded-lg space-x-2 active:bg-gray-50">
          <Ionicons name="chatbubbles-outline" size={18} color="#000000" />
          <Text className="text-black font-semibold text-sm">WhatsApp Support</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}