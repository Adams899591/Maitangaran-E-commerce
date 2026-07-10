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

export default function SuccessScreen() {
  const router = useRouter();
  // Safely extract the invoiceID passed from the Checkout screen params
  const { invoiceID } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}
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
            Your payment was processed successfully via Paystack. Your package will be on its way soon.
          </Text>

          {/* INVOICE CARD INFO */}
          {/* {invoiceID && (
            <View className="bg-gray-50 border border-gray-100 rounded-2xl p-5 w-full mt-8 flex-row justify-between items-center">
              <View>
                <Text className="text-gray-400 text-[10px] font-black uppercase tracking-wider">
                  Invoice Reference
                </Text>
                <Text className="text-black text-base font-bold mt-0.5 select-text">
                  #{invoiceID}
                </Text>
              </View>
              <View className="bg-zinc-200 px-2.5 py-1 rounded-md">
                <Text className="text-zinc-700 text-[10px] font-bold uppercase tracking-wide">
                  Not Paid
                </Text>
              </View>
            </View>
          )} */}
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