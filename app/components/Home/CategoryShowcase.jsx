import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');

export default function CategoryShowcase({ 
  searchText, 
  selectedCategory, 
  EmptySectionState, 
  ImagePlaceholder 
}) {
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);




  // Fetch products from Laravel whenever the selectedCategory changes
  useEffect(() => {


    const fetchCategoryProducts = async () => {

        setLoading(true);

        try {

          // if no selection is made send request to laravel to return all product 
          // e.g the user just enters the page 
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
            setProducts([]);
          }
        } catch (error) {
          console.log("Error fetching products for category:", error);
          setProducts([]);
        } finally {
          setLoading(false);
        }

    };

    fetchCategoryProducts();
  }, [selectedCategory]); // <--- This ensures it re-runs when a user clicks a new category





  // Handle local text filtering (e.g. typing in a search bar) over the live backend results
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
              {/* Check if SmallImage exists, otherwise cleanly show your ImagePlaceholder */}
              {item.SmallImage ? (
                <Image source={{ uri: item.SmallImage }} className="w-full h-44 object-cover" />
              ) : (
                <ImagePlaceholder heightClass="h-44" />
              )}
            </View>
            <View className="pt-2 px-1">
              {/* Map to real Laravel field properties: ProductName & SellingPrice */}
              <Text className="text-xs font-bold text-black tracking-tight" numberOfLines={1}>
                {item.ProductName}
              </Text>
              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-sm font-black text-black">
                  ₦{Number(item.SellingPrice).toLocaleString()}
                </Text>
                <TouchableOpacity className="bg-black px-3 py-1.5 rounded-lg">
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