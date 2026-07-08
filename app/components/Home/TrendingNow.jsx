import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const TRENDING_NOW = [
  { id: 'f1', name: 'Classic Leather Derby', price: '₦120,000', oldPrice: '₦180,000', rating: 4.9, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500' },
  { id: 'f2', name: 'Minimalist Chrono Watch', price: '₦195,000', rating: 4.8, image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500' },
  { id: 'f3', name: 'Premium Leather Bomber', price: '₦299,000', rating: 5.0, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500' }
];

export default function TrendingNow({ SectionHeader, EmptySectionState, ImagePlaceholder }) {
  const router = useRouter();

  if (TRENDING_NOW.length === 0) {
    return <EmptySectionState heightClass="h-52" message="Trending inventory parameters are currently updating." />;
  }

  return (
    <View className="mt-8">
      <SectionHeader 
        title="TRENDING NOW" 
        rightElement={
          <View className="flex-row items-center space-x-3">
            <View className="flex-row items-center bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
              <MaterialCommunityIcons name="gesture-swipe-horizontal" size={12} color="#9CA3AF" />
              <Text className="text-[9px] font-bold text-gray-400 ml-1 uppercase tracking-wider">Swipe</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-xs font-bold text-gray-500 tracking-wider">SEE ALL</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      <FlatList
        data={TRENDING_NOW}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item: product }) => (
          <View 
            style={{ width: width * 0.44 }} 
            className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-2 mr-4"
          >
            <View className="relative bg-gray-50 rounded-xl overflow-hidden">
              {product.image ? (
                <Image source={{ uri: product.image }} className="w-full h-40 object-cover" />
              ) : (
                <ImagePlaceholder heightClass="h-40" />
              )}
              {product.oldPrice && product.image && (
                <View className="absolute bottom-2 left-2 bg-black px-2 py-0.5 rounded">
                  <Text className="text-white text-[10px] font-bold">SALE</Text>
                </View>
              )}
            </View>
            <View className="pt-2 px-1">
              <Text className="text-xs font-bold text-black tracking-tight" numberOfLines={1}>
                {product.name}
              </Text>
              <View className="flex-row items-center mt-1">
                <Ionicons name="star" size={12} color="black" />
                <Text className="text-[11px] font-medium text-black ml-1">{product.rating}</Text>
              </View>
              <View className="flex-row items-center justify-between mt-2">
                <View className="flex-row items-baseline">
                  <Text className="text-sm font-black text-black">{product.price}</Text>
                  {product.oldPrice && (
                    <Text className="text-[11px] text-gray-400 line-through ml-1.5">{product.oldPrice}</Text>
                  )}
                </View>
                <TouchableOpacity 
                  onPress={() => router.push("(drawer)/single-product")} 
                  className="bg-black p-2 rounded-lg"
                >
                  <Feather name="plus" size={14} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}