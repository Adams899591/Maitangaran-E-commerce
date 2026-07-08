import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native'; // Removed useState from here!
import { Feather, Ionicons } from '@expo/vector-icons';

export default function AboutUsScreen() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setEmail('');
      Alert.alert("Success", "Thank you for subscribing to our newsletter!");
    }, 1500);
  };

  const openWhatsApp = (phone: string) => {
    Linking.openURL(`whatsapp://send?phone=${phone.replace(/\s+/g, '')}`);
  };

  const openDialer = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`);
  };

  return (
    <ScrollView 
      className="flex-1 bg-slate-50/50" 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={{ padding: 20 }}
    >
      {/* EDITORIAL HERO TITLE */}
      <View className="mt-2 mb-6">
        <Text className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Maitangaran Textiles</Text>
        <Text className="text-3xl font-black tracking-tighter text-slate-900 mt-1 leading-9">
          Nigeria’s Premier Textile Destination
        </Text>
        <Text className="text-sm text-slate-500 font-normal mt-3 leading-6">
          A division of A.A. Maitangaran & Sons Ltd. We have proudly served customers across Nigeria with premium quality fabrics for decades.
        </Text>
      </View>

      {/* BRANDS BANNER */}
      <View 
        className="bg-white border border-slate-100 rounded-2xl p-5 mb-6"
        style={{ elevation: 2, shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
      >
        <Text className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-2">Licensed Global Distributor For</Text>
        <Text className="text-sm font-semibold text-slate-800 tracking-tight leading-5">
          Getzner • Excelsior • Filtex • HC Germany • Bauer • Hollandaise
        </Text>
      </View>

      {/* MISSION SECTION */}
      <View className="mb-6">
        <Text className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">Our Core Mission</Text>
        <View className="border-l-2 border-slate-900 pl-4 py-1">
          <Text className="text-base font-medium italic text-slate-700 leading-6">
            "To provide the finest textiles and unmatched customer service across Nigeria by offering genuine products, transparent pricing, and reliable nationwide delivery."
          </Text>
        </View>
      </View>

      {/* WHY CHOOSE US CARDS */}
      <View className="mb-6">
        <Text className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">Premium Selection</Text>
        
        <View 
          className="flex-row items-start bg-white border border-slate-100 rounded-2xl p-4 mb-3"
          style={{ elevation: 2, shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
        >
          <View className="p-2.5 bg-slate-50 rounded-xl mr-4">
            <Feather name="shield" size={18} color="#0f172a" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-slate-900">100% Authenticity Guaranteed</Text>
            <Text className="text-xs text-slate-400 mt-1 leading-4">Authorized distributors for premium African brocades, luxury shirting, and premium laces.</Text>
          </View>
        </View>

        <View 
          className="flex-row items-start bg-white border border-slate-100 rounded-2xl p-4"
          style={{ elevation: 2, shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
        >
          <View className="p-2.5 bg-slate-50 rounded-xl mr-4">
            <Feather name="truck" size={18} color="#0f172a" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-slate-900">Nationwide Logistics</Text>
            <Text className="text-xs text-slate-400 mt-1 leading-4">Serving both wholesale and retail pipelines safely across all Nigerian states.</Text>
          </View>
        </View>
      </View>

      {/* OUR LOCATIONS ACCOUNTS */}
      <View className="mb-6">
        <Text className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">Our Operations Layout</Text>
        
        {/* Kano HQ */}
        <View 
          className="bg-white border border-slate-100 rounded-2xl p-4 mb-3"
          style={{ elevation: 2, shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
        >
          <View className="flex-row justify-between items-center mb-1.5">
            <Text className="text-sm font-bold text-slate-900">Kano (Head Office)</Text>
            <View className="bg-slate-100 px-2 py-0.5 rounded-full">
              <Text className="text-[9px] font-bold text-slate-700 uppercase tracking-wide">HQ</Text>
            </View>
          </View>
          <Text className="text-xs text-slate-500 leading-5">
            4 Fagge Ta Kudu, A.A. Maitangaran House, Opposite Kwari Market, Kano State.
          </Text>
        </View>

        {/* Abuja Branch */}
        <View 
          className="bg-white border border-slate-100 rounded-2xl p-4"
          style={{ elevation: 2, shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
        >
          <Text className="text-sm font-bold text-slate-900 mb-1.5">Abuja Showroom</Text>
          <Text className="text-xs text-slate-500 leading-5">
            Suite 19, Nürnberger Plaza, Beside Rockview Hotel, Adetokunbo Ademola Crescent, Wuse II, Abuja.
          </Text>
        </View>
      </View>

      {/* DIRECT HUB GET IN TOUCH */}
      <View className="mb-6">
        <Text className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">Direct Contact Channels</Text>
        
        <View 
          className="border border-slate-100 rounded-2xl overflow-hidden bg-white"
          style={{ elevation: 2, shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
        >
          {/* Kano Call */}
          <TouchableOpacity onPress={() => openDialer('+2348032838463')} className="flex-row items-center justify-between p-4 border-b border-slate-50 active:bg-slate-50">
            <View className="flex-row items-center">
              <Feather name="phone" size={16} color="#64748b" />
              <Text className="text-xs font-semibold text-slate-700 ml-3">Call Kano HQ</Text>
            </View>
            <Text className="text-xs text-slate-400 font-mono">+234 803 283 8463</Text>
          </TouchableOpacity>

          {/* Kano WhatsApp */}
          <TouchableOpacity onPress={() => openWhatsApp('+2348032959574')} className="flex-row items-center justify-between p-4 border-b border-slate-50 active:bg-slate-50">
            <View className="flex-row items-center">
              <Ionicons name="logo-whatsapp" size={16} color="#16a34a" />
              <Text className="text-xs font-semibold text-slate-700 ml-3">WhatsApp Kano</Text>
            </View>
            <Text className="text-xs text-emerald-600 font-medium">Chat Online</Text>
          </TouchableOpacity>

          {/* Abuja WhatsApp */}
          <TouchableOpacity onPress={() => openWhatsApp('+2348065498720')} className="flex-row items-center justify-between p-4 border-b border-slate-50 active:bg-slate-50">
            <View className="flex-row items-center">
              <Ionicons name="logo-whatsapp" size={16} color="#16a34a" />
              <Text className="text-xs font-semibold text-slate-700 ml-3">WhatsApp Abuja</Text>
            </View>
            <Text className="text-xs text-emerald-600 font-medium">Chat Online</Text>
          </TouchableOpacity>

          {/* Corporate Email */}
          <TouchableOpacity onPress={() => Linking.openURL('mailto:mtextile70@yahoo.com')} className="flex-row items-center justify-between p-4 active:bg-slate-50">
            <View className="flex-row items-center">
              <Feather name="mail" size={16} color="#64748b" />
              <Text className="text-xs font-semibold text-slate-700 ml-3">Email Support</Text>
            </View>
            <Text className="text-xs text-slate-400 font-mono">mtextile70@yahoo.com</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* NEWSLETTER SUBSCRIPTION FOOTER */}
      <View className="bg-slate-900 rounded-2xl p-5 mb-8">
        <Text className="text-white text-base font-bold tracking-tight">Subscribe to our Newsletter</Text>
        <Text className="text-slate-400 text-xs font-normal mt-1">Get updates on new seasonal fabric collections and insider drops.</Text>
        
        <View className="mt-4 flex-row items-center bg-slate-800 rounded-xl px-3 border border-slate-700/50">
          <TextInput
            placeholder="Your email address"
            placeholderTextColor="#64748b"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isSubscribing}
            className="flex-1 text-white text-xs py-3 font-normal"
          />
          <TouchableOpacity 
            onPress={handleSubscribe}
            disabled={isSubscribing}
            className="bg-white px-4 py-2 rounded-lg active:opacity-90"
          >
            {isSubscribing ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <Text className="text-slate-950 text-[11px] font-bold uppercase tracking-wider">Join</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}