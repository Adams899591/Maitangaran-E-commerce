import React from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Safely extract the invoiceID passed from the Checkout screen params
  const { invoiceID } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center', paddingBottom: insets.bottom + 24  }}
      >
        {/* SUCCESS ICON & HEADERS */}
        <View className="items-center my-auto">
          {/* Animated/Pulse Ring Effect Wrapper */}
          <View className="bg-emerald-50 p-6 rounded-full mb-6">
            <View className="bg-emerald-500 p-5 rounded-full shadow-sm">
              <Feather name="check" size={40} color="#FFFFFF" />
            </View>
          </View>

          <Text className="text-3xl font-black tracking-tighter text-black text-center mb-2">
            Order Placed!
          </Text>
          <Text className="text-sm text-gray-500 font-medium text-center px-6 leading-5">
                Your order was placed successfully! We'll start processing your package right away.
          </Text>
        </View>

        {/* BOTTOM BUTTONS AREA */}
        <View className="mt-auto gap-3">
          {/* PRIMARY BUTTON: CONTINUE SHOPPING */}
          <TouchableOpacity 
            onPress={() => router.push("/(tabs)/home")} // Clears checkout stack history and goes back home
            className="w-full py-4 rounded-xl bg-black active:opacity-90 flex-row justify-center items-center"
          >
            <Feather name="shopping-bag" size={16} color="#FFFFFF" className="mr-2" />
            <Text className="text-xs font-black tracking-widest uppercase text-white">
              Continue Shopping
            </Text>
          </TouchableOpacity>

          {/* SECONDARY BUTTON: VIEW ORDER STATUS / HISTORY */}
          <TouchableOpacity 
            onPress={() => router.push('/orders')} // Adjust this route path to your order history screen if needed
            className="w-full py-3.5 rounded-xl border border-gray-200 bg-white active:opacity-70 flex-row justify-center items-center"
          >
            <Text className="text-xs font-black tracking-widest uppercase text-gray-700">
              Track My Order
            </Text>
          </TouchableOpacity>

          <Text className="text-[10px] text-center text-gray-400 font-medium mt-2 px-4 leading-4">
            A receipt and order confirmation summary has been sent to your registered email address.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}