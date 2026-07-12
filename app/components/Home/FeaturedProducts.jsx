import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'; // <-- Added Ionicons import here
import axios from 'axios';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function FeaturedProducts({ SectionHeader, EmptySectionState, ImagePlaceholder }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [networkError, setNetworkError] = useState(false);

  // Send request API to fetch Featured Products
  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setNetworkError(false); // Reset to false on retry
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/products/featured`);
      const res = response.data;

      if (res && res.Success && Array.isArray(res.Data)) {
        setProducts(res.Data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log("Error fetching featured products:", error);
      setNetworkError(true); 
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  // 1. Check loading status first
  if (loading) {
    return (
      <View className="mt-8 h-48 items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // 2. FIXED ORDER: Check for network errors BEFORE checking if products array is empty
  if (networkError) {
    return (
      <View className="mt-8 mx-4 bg-red-50 border border-red-100 rounded-2xl items-center justify-center p-6 h-44">
        <Ionicons name="cloud-offline-outline" size={26} color="#EF4444" />
        <Text className="text-gray-900 text-xs font-bold mt-2 text-center">
          Failed to load products
        </Text>
        <TouchableOpacity 
          onPress={fetchFeaturedProducts}
          className="mt-3 bg-black px-4 py-1.5 rounded-full"
        >
          <Text className="text-white text-[10px] font-bold tracking-wider">RETRY</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. Only show empty state if the network call was successful but returned no items
  if (products.length === 0) {
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
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        keyExtractor={(item) => `featured-${item.ID}`}
        renderItem={({ item }) => {
          const hasDiscount = item.OnlineRate && Number(item.OnlineRate) < Number(item.SellingPrice);

          return (
            <View 
              style={{ width: width * 0.44 }} 
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-2 mr-4"
            >
              <View className="bg-gray-50 rounded-xl overflow-hidden">
                {item.SmallImage ? (
                  <Image source={{ uri: item.SmallImage }} className="w-full h-36 object-cover" />
                ) : (
                  <ImagePlaceholder heightClass="h-36" />
                )}
              </View>

              <View className="pt-2 pb-1 px-1">
                <Text className="text-xs font-black text-black tracking-tight" numberOfLines={1}>
                  {item.ProductName?.toUpperCase()}
                </Text>

                <View className="flex-row justify-between items-end mt-2">
                  <View className="flex-1">
                    {hasDiscount ? (
                      <>
                        <Text className="text-sm font-black text-black">
                          ₦{Number(item.OnlineRate).toLocaleString()}
                        </Text>
                        <Text className="text-[10px] font-bold text-red-600 line-through mt-0.5">
                          ₦{Number(item.SellingPrice).toLocaleString()}
                        </Text>
                      </>
                    ) : (
                      <Text className="text-sm font-black text-black">
                        ₦{Number(item.SellingPrice).toLocaleString()}
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity
                       onPress={() => router.push({ 
                          pathname: "(drawer)/single-product",
                          params: { id: item.ID } 
                        })}
                    className="bg-black px-3 py-1.5 rounded-lg ml-1"
                  >
                    <Text className="text-[10px] font-bold text-white tracking-wider">ADD</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

