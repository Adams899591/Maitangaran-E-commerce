import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { UserContext } from '../context/UserContext';

export default function UserDashboard() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  console.log("Current User Data:", user);
  


  const userProfile = {
    name: user?.Customer?.CustomerName,
    type: user?.Customer?.Email,
  };

  return (
    <ScrollView className="flex-1 bg-zinc-50" showsVerticalScrollIndicator={false}>
      
      {/* PREMIUM WELCOME HERO BANNER */}
      <View 
        className="bg-zinc-950 px-6 pt-8 pb-8 rounded-b-[32px] flex-row justify-between items-center"
        style={{ elevation: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}
      >
        <View className="flex-1 pr-4">
          <Text className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">Account Hub</Text>
          <Text className="text-white text-2xl font-black mt-1 tracking-tight">{userProfile.name}</Text>
          <View className="bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full mt-3 self-start">
            <Text className="text-zinc-300 text-[10px] font-bold uppercase tracking-wider">{userProfile.type}</Text>
          </View>
        </View>
        <View className="bg-zinc-900 p-1 rounded-full border border-zinc-800">
          <Ionicons name="person-circle-outline" size={56} color="#FFFFFF" />
        </View>
      </View>

      {/* EDITORIAL INTERACTIVE NAVIGATION MATRIX */}
      <View className="px-5 pt-6">
        <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 pl-1">Navigation Matrix</Text>
        
        {/* Home Action Card */}
        <TouchableOpacity 
          onPress={() => router.push('/home')} 
          className="bg-white border border-zinc-100 rounded-2xl p-5 mb-3 flex-row items-center justify-between shadow-sm shadow-zinc-200/40 active:bg-zinc-50/50"
        >
          <View className="flex-row items-center flex-1 pr-3">
            <View className="p-3 bg-zinc-950 rounded-xl shadow-sm shadow-zinc-950/10">
              <Feather name="home" size={18} color="white" />
            </View>
            <View className="ml-4">
              <Text className="text-sm font-bold text-zinc-900 tracking-tight">Main Showroom</Text>
              <Text className="text-xs text-zinc-400 mt-0.5">Return to the storefront landing</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={16} color="#a1a1aa" />
        </TouchableOpacity>

        {/* Track Orders Action Card */}
        <TouchableOpacity 
          onPress={() => router.push('/orders')} 
          className="bg-white border border-zinc-100 rounded-2xl p-5 mb-3 flex-row items-center justify-between shadow-sm shadow-zinc-200/40 active:bg-zinc-50/50"
        >
          <View className="flex-row items-center flex-1 pr-3">
            <View className="p-3 bg-zinc-950 rounded-xl shadow-sm shadow-zinc-950/10">
              <Feather name="package" size={18} color="white" />
            </View>
            <View className="ml-4">
              <Text className="text-sm font-bold text-zinc-900 tracking-tight">Track Orders</Text>
              <Text className="text-xs text-zinc-400 mt-0.5">Review history, invoices & distribution</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={16} color="#a1a1aa" />
        </TouchableOpacity>

        {/* My Cart Action Card */}
        <TouchableOpacity 
          onPress={() => router.push('/cart')} 
          className="bg-white border border-zinc-100 rounded-2xl p-5 mb-3 flex-row items-center justify-between shadow-sm shadow-zinc-200/40 active:bg-zinc-50/50"
        >
          <View className="flex-row items-center flex-1 pr-3">
            <View className="p-3 bg-zinc-950 rounded-xl shadow-sm shadow-zinc-950/10">
              <Feather name="shopping-cart" size={18} color="white" />
            </View>
            <View className="ml-4">
              <Text className="text-sm font-bold text-zinc-900 tracking-tight">My Cart Allocation</Text>
              <Text className="text-xs text-zinc-400 mt-0.5">Manage your pending fabrics checkout</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={16} color="#a1a1aa" />
        </TouchableOpacity>

        {/* My Profile Action Card */}
        <TouchableOpacity 
          onPress={() => router.push('/profile')} 
          className="bg-white border border-zinc-100 rounded-2xl p-5 mb-6 flex-row items-center justify-between shadow-sm shadow-zinc-200/40 active:bg-zinc-50/50"
        >
          <View className="flex-row items-center flex-1 pr-3">
            <View className="p-3 bg-zinc-950 rounded-xl shadow-sm shadow-zinc-950/10">
              <Feather name="user" size={18} color="white" />
            </View>
            <View className="ml-4">
              <Text className="text-sm font-bold text-zinc-900 tracking-tight">My Profile</Text>
              <Text className="text-xs text-zinc-400 mt-0.5">Modify shipping logistics & settings</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={16} color="#a1a1aa" />
        </TouchableOpacity>
      </View>

      {/* QUICK CONNECTIONS FOOTER */}
      <View className="px-5 mb-10">
        <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 pl-1">Quick Desk</Text>
        <View className="flex-row gap-3">
          <TouchableOpacity 
            onPress={() => router.push('/search')}
            className="flex-1 flex-row items-center justify-center bg-white border border-zinc-200/80 py-4 rounded-xl gap-2 active:bg-zinc-50 shadow-sm shadow-zinc-200/30"
          >
            <Feather name="sliders" size={14} color="#18181b" />
            <Text className="text-zinc-950 font-bold text-xs uppercase tracking-wider">Browse Fabrics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push('/contact-us')} className="flex-1 flex-row items-center justify-center bg-white border border-zinc-200/80 py-4 rounded-xl gap-2 active:bg-zinc-50 shadow-sm shadow-zinc-200/30">
            <Ionicons name="logo-whatsapp" size={15} color="#18181b" />
            <Text className="text-zinc-950 font-bold text-xs uppercase tracking-wider">Concierge Line</Text>
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
}

