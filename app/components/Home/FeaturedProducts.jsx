import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const { width } = Dimensions.get('window');

export default function FeaturedProducts({ SectionHeader, EmptySectionState, ImagePlaceholder }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);




  //send request API to  fetch Featured Products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/products/featured`);
        const res = response.data;

        // Safely check if API returned Data array successfully
        if (res && res.Success && Array.isArray(res.Data)) {
          setProducts(res.Data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.log("Error fetching featured products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);


  if (loading) {
    return (
      <View className="mt-8 h-48 items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

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
              {/* Product Image section */}
              <View className="bg-gray-50 rounded-xl overflow-hidden">
                {item.SmallImage ? (
                  <Image source={{ uri: item.SmallImage }} className="w-full h-36 object-cover" />
                ) : (
                  <ImagePlaceholder heightClass="h-36" />
                )}
              </View>

              {/* Product Details section */}
              <View className="pt-2 pb-1 px-1">
                <Text className="text-xs font-black text-black tracking-tight" numberOfLines={1}>
                  {item.ProductName?.toUpperCase()}
                </Text>

                <View className="flex-row justify-between items-end mt-2">
                  <View className="flex-1">
                    {hasDiscount ? (
                      <>
                        {/* Discounted price displayed prominently */}
                        <Text className="text-sm font-black text-black">
                          ₦{Number(item.OnlineRate).toLocaleString()}
                        </Text>
                        {/* Original price crossed out in bold red */}
                        <Text className="text-[10px] font-bold text-red-600 line-through mt-0.5">
                          ₦{Number(item.SellingPrice).toLocaleString()}
                        </Text>
                      </>
                    ) : (
                      /* Fallback regular price layout if no sale rate exists */
                      <Text className="text-sm font-black text-black">
                        ₦{Number(item.SellingPrice).toLocaleString()}
                      </Text>
                    )}
                  </View>

                  {/* Interactive ADD Button */}
                  <TouchableOpacity 
                    className="bg-black px-3 py-1.5 rounded-lg ml-1"
                    onPress={() => console.log(`Added product ${item.ID} to cart`)}
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