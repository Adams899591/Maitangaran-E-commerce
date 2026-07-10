import React, { useState, useEffect, useRef } from 'react';
import {  View,  Text,  ScrollView, Dimensions, StatusBar } from 'react-native';

import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // <-- Added MaterialCommunityIcons for gesture icons
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeSearchBar from "../../components/Home/HomeSearchBar";
import PromotionalBanners from "../../components/Home/PromotionalBanners";
import CategorySlider from "../../components/Home/CategorySlider";
import CategoryShowcase from "../../components/Home/CategoryShowcase";
import FeaturedProducts from "../../components/Home/FeaturedProducts";
import TrendingNow from "../../components/Home/TrendingNow";
import OurProducts from "../../components/Home/OurProducts";


const { width } = Dimensions.get('window');

// Reusable Section Header Component showing visual horizontal cues  =>  Swipe
function SectionHeader({ title, showSwipeIndicator = false, rightElement = null }) {
  return (
    <View className="px-4 mb-4 flex-row justify-between items-center">
      <Text className="text-lg font-black tracking-tight text-black">{title}</Text>
      
      {rightElement ? (
        rightElement
      ) : showSwipeIndicator ? (
        <View className="flex-row items-center bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
          <MaterialCommunityIcons name="gesture-swipe-horizontal" size={14} color="#9CA3AF" />
          <Text className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-wider">Swipe</Text>
          <Feather name="arrow-right" size={10} color="#9CA3AF" className="ml-0.5" />
        </View>
      ) : null}
    </View>
  );
}

// Centered Empty State helper that preserves layout height => No Match
function EmptySectionState({ message, heightClass = "h-44" }) {
  return (
    <View style={{ width: width - 32 }} className={`mx-4 bg-gray-50 border border-gray-100 rounded-2xl items-center justify-center p-6 ${heightClass}`}>
      <Ionicons name="information-circle-outline" size={26} color="#9CA3AF" />
      <Text className="text-gray-400 text-xs font-medium mt-2 text-center tracking-tight max-w-[250px]">
        {message}
      </Text>
    </View>
  );
}

// Global Image Placeholder Component => No image uploaded
function ImagePlaceholder({ heightClass = "h-44" }) {
  return (
    <View className={`w-full ${heightClass} bg-gray-100 items-center justify-center`}>
      <Ionicons name="image-outline" size={28} color="#9CA3AF" />
      <Text className="text-gray-400 text-[10px] font-medium mt-1">No image uploaded</Text>
    </View>
  );
}



export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);


  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/*1. Sticky-Style Search Bar */}
        <HomeSearchBar
            setSearchText={setSearchText}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchText={searchText}
        />


        {/* 2. Promotional Banners Carousel */}
        <PromotionalBanners
          EmptySectionState={EmptySectionState}
          ImagePlaceholder={ImagePlaceholder}
        />


        {/* 3. Categories Slider */}
        <CategorySlider
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSearchText={setSearchText}
          SectionHeaderComponent={SectionHeader}
          EmptySectionStateComponent={EmptySectionState}
        />

        {/* 3.5 Standalone Section: Category Item Showcases */}
        <CategoryShowcase
          searchText={searchText}
          selectedCategory={selectedCategory}
          EmptySectionState={EmptySectionState}
          ImagePlaceholder={ImagePlaceholder}
        />

        {/*4. Featured Product */}
        <FeaturedProducts 
          SectionHeader={SectionHeader}
          EmptySectionState={EmptySectionState}
          ImagePlaceholder={ImagePlaceholder}
        />

        {/* 5. Swipable TRENDING NOW */}
        <TrendingNow
          SectionHeader={SectionHeader}
          EmptySectionState={EmptySectionState}
          ImagePlaceholder={ImagePlaceholder}
        />


        {/* 6. Real-time New Arrivals */}
        <OurProducts
          EmptySectionState={EmptySectionState}
          ImagePlaceholder={ImagePlaceholder}
        />
  

      </ScrollView>
    </SafeAreaView>
  );
}







