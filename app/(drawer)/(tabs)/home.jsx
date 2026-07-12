import React, { useState, useEffect, useCallback } from 'react'; // <-- Added useCallback here
import { View, Text, ScrollView, Dimensions, RefreshControl } from 'react-native'; // <-- Added RefreshControl here

import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import HomeSearchBar from "../../components/Home/HomeSearchBar";
import PromotionalBanners from "../../components/Home/PromotionalBanners";
import CategorySlider from "../../components/Home/CategorySlider";
import CategoryShowcase from "../../components/Home/CategoryShowcase";
import FeaturedProducts from "../../components/Home/FeaturedProducts";
import OurProducts from "../../components/Home/OurProducts";
import TrendingNow from "../../components/Home/TrendingNow";
import { useSafeAreaInsets } from "react-native-safe-area-context"; 

const { width } = Dimensions.get('window');

// Reusable Section Header Component showing visual horizontal cues
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

// Centered Empty State helper
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

// Global Image Placeholder Component
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
  const insets = useSafeAreaInsets(); 
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Pull-to-refresh control triggers
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fixed: Added the missing dependency array [] at the bottom of the hook
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    
    // Increments the key, forcing child components to clear and rerun their own local useEffects
    setRefreshKey(prev => prev + 1);
    
    // Smooth layout delay for pull spinner feedback
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  }, []);



  return (
    <>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#000000" />
        }
      >
        
        {/* 1. Sticky-Style Search Bar */}
        <HomeSearchBar
            setSearchText={setSearchText}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchText={searchText}
        />

        {/* 2. Promotional Banners Carousel */}
        <PromotionalBanners
          key={`banners-${refreshKey}`}
          EmptySectionState={EmptySectionState}
          ImagePlaceholder={ImagePlaceholder}
        />

        {/* 3. Categories Slider */}
        <CategorySlider
          key={`slider-${refreshKey}`}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSearchText={setSearchText}
          SectionHeaderComponent={SectionHeader}
          EmptySectionStateComponent={EmptySectionState}
        />


        {/* 3.5 Standalone Section: Category Item Showcases */}
        <CategoryShowcase
          key={`showcase-${refreshKey}`}
          searchText={searchText}
          selectedCategory={selectedCategory}
          EmptySectionState={EmptySectionState}
          ImagePlaceholder={ImagePlaceholder}
        />         
        
          {/* 5. Swipable TRENDING NOW  (Hidden for future use)*/} 
         {/* <TrendingNow
            key={`trendingnow-${refreshKey}`}
            SectionHeader={SectionHeader}
            EmptySectionState={EmptySectionState}
            ImagePlaceholder={ImagePlaceholder}
           />  */}

        {/* 4. Featured Product */}
        <FeaturedProducts 
          key={`featured-${refreshKey}`}
          SectionHeader={SectionHeader}
          EmptySectionState={EmptySectionState}
          ImagePlaceholder={ImagePlaceholder}
        />

        {/* 6. Real-time New Arrivals */}
        <OurProducts
          key={`ourproducts-${refreshKey}`}
          EmptySectionState={EmptySectionState}
          ImagePlaceholder={ImagePlaceholder}
        />

      </ScrollView>
    </>
  );
}




