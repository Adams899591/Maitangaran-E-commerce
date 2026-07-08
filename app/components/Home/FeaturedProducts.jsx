import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const FEATURED_PRODUCT = [
  { id: 'ff1', name: 'Premium Ankara Print', image: 'https://images.unsplash.com/photo-1610116306796-6ebd30d77fa1?w=400' },
  { id: 'ff2', name: 'Super Jakard Collection', image: 'https://images.unsplash.com/photo-1574169208507-84376144848b&w=400' },
  { id: 'ff3', name: 'Classic Suit Material', image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=400' }
];

export default function FeaturedProducts({ SectionHeader, EmptySectionState, ImagePlaceholder }) {
  if (FEATURED_PRODUCT.length === 0) {
    return <EmptySectionState heightClass="h-48" message="No featured fabric groupings found." />;
  }

  return (
    <View className="mt-8">
      <SectionHeader 
        title="FEATURED PRODUCT" 
        rightElement={
          <View className="flex-row items-center space-x-2">
            <View className="flex-row items-center bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 mr-1.5">
              <MaterialCommunityIcons name="gesture-swipe-horizontal" size={12} color="#9CA3AF" />
              <Text className="text-[9px] font-bold text-gray-400 ml-1 uppercase">Swipe</Text>
            </View>
            <Text className="text-xs font-bold text-gray-400 tracking-wider">EXPLORE LINEUP</Text>
          </View>
        }
      />
      
      <FlatList
        data={FEATURED_PRODUCT}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        keyExtractor={(item) => `fabric-${item.id}`}
        renderItem={({ item }) => (
          <View 
            style={{ width: width * 0.44 }} 
            className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-2 mr-4"
          >
            <View className="bg-gray-50 rounded-xl overflow-hidden">
              {item.image ? (
                <Image source={{ uri: item.image }} className="w-full h-36 object-cover" />
              ) : (
                <ImagePlaceholder heightClass="h-36" />
              )}
            </View>
            <View className="pt-2 pb-1 px-1 flex-row justify-between items-center">
              <View className="flex-1 pr-1">
                <Text className="text-xs font-black text-black tracking-tight" numberOfLines={1}>
                  {item.name.toUpperCase()}
                </Text>
                <Text className="text-[10px] text-gray-400 font-medium mt-0.5">Explore Collection</Text>
              </View>
              <View className="bg-gray-100 p-1.5 rounded-lg">
                <Feather name="arrow-right" size={12} color="black" />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}