import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function CategoryShowcase({ 
  searchText, 
  selectedCategory, 
  EmptySectionState, 
  ImagePlaceholder 
}) {
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const router = useRouter();

  // Fetch products from Laravel whenever the selectedCategory changes
  const fetchCategoryProducts = async () => {
      // CRITICAL FIX: Reset network error status at the start of every new fetch attempt
      setNetworkError(false);
      setLoading(true);

      try {
        // if no selection is made send request to laravel to return all product 
        let url = `${process.env.EXPO_PUBLIC_API_URL}/products`; 
        
        // If a category is selected, append the category filter path or query string
        if (selectedCategory) {
          url = `${process.env.EXPO_PUBLIC_API_URL}/products/category/${selectedCategory}`;
        }

        const response = await axios.get(url);
        const res = response.data;

        if (res && res.Success && Array.isArray(res.Data)) {
          setProducts(res.Data);
        } else {
          setNetworkError(true); 
          setProducts([]);
        }
      } catch (error) {
        console.log("Error fetching products for category:", error);
        // CRITICAL FIX: Set network error to true if axios catches a catch block error (like 500, 404, or no internet)
        setNetworkError(true); 
        setProducts([]);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchCategoryProducts();
  }, [selectedCategory]); // Re-runs when a user clicks a new category

  // Handle local text filtering over the live backend results
  const filteredProducts = products.filter(item => {
    if (!searchText) return true;
    const matchText = searchText.trim().toLowerCase();
    return item.ProductName?.toLowerCase().includes(matchText);
  });

  if (loading) {
    return (
      <View className="mt-6 h-44 items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // Check for network errors BEFORE checking if products array is empty
  if (networkError) {
    return (
      <View className="mt-8 mx-4 bg-red-50 border border-red-100 rounded-2xl items-center justify-center p-6 h-44">
        <Ionicons name="cloud-offline-outline" size={26} color="#EF4444" />
        <Text className="text-gray-900 text-xs font-bold mt-2 text-center">
          Failed to load products
        </Text>
        <TouchableOpacity 
          onPress={fetchCategoryProducts}
          className="mt-3 bg-black px-4 py-1.5 rounded-full"
        >
          <Text className="text-white text-[10px] font-bold tracking-wider">RETRY</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <EmptySectionState 
        heightClass="h-44" 
        message={selectedCategory ? "No items found in this category." : "No items found."} 
      />
    );
  }

  return (
    <View className="mt-6">
      <FlatList
        data={filteredProducts}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        keyExtractor={(item) => `product-${item.ID}`}
        renderItem={({ item }) => (
          <View style={{ width: width * 0.44 }} className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-2 mr-4">
            <View className="relative bg-gray-50 rounded-xl overflow-hidden">
              {item.SmallImage ? (
                <Image source={{ uri: item.SmallImage }} className="w-full h-44 object-cover" />
              ) : (
                <ImagePlaceholder heightClass="h-44" />
              )}
            </View>
            <View className="pt-2 px-1">
              <Text className="text-xs font-bold text-black tracking-tight" numberOfLines={1}>
                {item.ProductName}
              </Text>
              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-sm font-black text-black">
                  ₦{Number(item.SellingPrice).toLocaleString()}
                </Text>
                <TouchableOpacity
                    onPress={() => router.push({ 
                      pathname: "(drawer)/single-product",
                      params: { id: item.ID }
                    })}
                    className="bg-black px-3 py-1.5 rounded-lg"
                >
                  <Text className="text-[10px] font-bold text-white tracking-wider">ADD</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}










