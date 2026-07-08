import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Keep static assets contextual inside their specific component module
const BASE_BANNERS = [
  { id: '1', title: 'SUMMER ESSENTIALS', subtitle: 'UP TO 50% OFF', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800' },
  { id: '2', title: 'MINIMALIST LOOKBOOK', subtitle: 'NEW SEASON', image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800' },
  { id: '3', title: 'PREMIUM TRADITIONAL', subtitle: 'THE LUXURY COLLECTION', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800' },
  { id: '4', title: 'MODERN ACCESSORIES', subtitle: 'CHRONO & LEATHER GEAR', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800' }
];

const BANNERS_DATA = BASE_BANNERS.length > 0 ? [...BASE_BANNERS, { ...BASE_BANNERS[0], id: 'clone-1' }] : [];

export default function PromotionalBanners({ EmptySectionState, ImagePlaceholder }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  // Auto-scroll loop effect
  useEffect(() => {
    if (BANNERS_DATA.length <= 1) return;

    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      
      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  // Snaps back seamlessly when hitting the boundary clone card
  const handleScroll = (event) => {
    if (BANNERS_DATA.length <= 1) return;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = contentOffsetX / (width - 32);
    
    if (currentIndex >= BANNERS_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: 0,
        animated: false,
      });
      setActiveIndex(0);
    }
  };

  const handleMomentumScrollEnd = (event) => {
    if (BANNERS_DATA.length <= 1) return;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / (width - 32));
    
    if (currentIndex >= 0 && currentIndex < BANNERS_DATA.length - 1) {
      setActiveIndex(currentIndex);
    }
  };

  if (BANNERS_DATA.length === 0) {
    return <EmptySectionState heightClass="h-48" message="No ongoing promotional events available right now." />;
  }

  return (
    <FlatList 
      ref={flatListRef}
      data={BANNERS_DATA}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      onScroll={handleScroll}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      scrollEventThrottle={16}
      renderItem={({ item }) => (
        <View style={{ width: width - 32 }} className="mx-4 h-48 bg-black rounded-2xl overflow-hidden relative">
          {item.image ? (
            <Image source={{ uri: item.image }} className="w-full h-full opacity-60 absolute" />
          ) : (
            <View className="absolute inset-0 opacity-40">
              <ImagePlaceholder heightClass="h-full" />
            </View>
          )}
          <View className="p-6 justify-between h-full z-10">
            <View>
              <Text className="text-white text-[10px] font-bold tracking-widest bg-black/40 self-start px-2 py-1 rounded">LIMITED</Text>
              <Text className="text-white text-2xl font-black mt-2 tracking-tight">{item.title}</Text>
              <Text className="text-gray-300 text-sm font-medium mt-1">{item.subtitle}</Text>
            </View>
            <TouchableOpacity className="bg-white px-5 py-2.5 rounded-xl self-start">
              <Text className="text-black font-bold text-xs tracking-wider">SHOP NOW</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}