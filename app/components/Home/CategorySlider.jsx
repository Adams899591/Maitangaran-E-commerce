import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// Helper function to map category names to Ionicons names safely
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes('voile') || name.includes('layers')) return 'layers-outline';
  if (name.includes('shadda') || name.includes('ribbon')) return 'ribbon-outline';
  if (name.includes('lace') || name.includes('sparkles')) return 'sparkles-outline';
  if (name.includes('ankara') || name.includes('color')) return 'color-palette-outline';
  if (name.includes('material') || name.includes('cut')) return 'cut-outline';
  if (name.includes('jakard') || name.includes('grid')) return 'grid-outline';
  if (name.includes('footwear') || name.includes('shoe')) return 'walk-outline';
  if (name.includes('ready made')) return 'shirt-outline';
  
  return 'apps-outline'; // Default backup icon
};


export default function CategorySlider({ selectedCategory, setSelectedCategory, setSearchText, SectionHeaderComponent, EmptySectionStateComponent }) {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  // Define the fetch handler outside useEffect so the RETRY button can trigger it
  const handleFetchCategory = async () => {
    setNetworkError(false);
    setLoading(true);

    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/categories`);
      const res = response.data;
      
      if (res && Array.isArray(res.Data)) {
        // Map API array structure to match your frontend state needs
        const formattedCategories = res.Data.map(item => ({
          id: item.ID,                 
          name: item.Category,         
          icon: getCategoryIcon(item.Category) 
        }));
        
        setCategories(formattedCategories);
      } else {
        setNetworkError(true);
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
      setNetworkError(true);
    } finally {
      setLoading(false);
    }
  };

  // Run once when the component mounts
  useEffect(() => {
    handleFetchCategory(); 
  }, []); 

  // Choose whichever Header element configuration you prefer
  const Header = SectionHeaderComponent || View;

  // 1. Show Loading Indicator if fetching
  if (loading) {
    return (
      <View className="mt-8 h-20 items-center justify-center">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

  // 2. Show Error View if network requests or layout parsing fails
  if (networkError) {
    return (
      <View className="mt-8 mx-4 bg-red-50 border border-red-100 rounded-2xl items-center justify-center p-4 h-24">
        <Ionicons name="cloud-offline-outline" size={22} color="#EF4444" />
        <Text className="text-gray-900 text-[11px] font-bold mt-1 text-center">
          Failed to load categories
        </Text>
        <TouchableOpacity 
          onPress={handleFetchCategory}
          className="mt-2 bg-black px-3 py-1 rounded-full"
        >
          <Text className="text-white text-[9px] font-bold tracking-wider">RETRY</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. Fallback safely if array simply returns empty (no structural/network error)
  if (categories.length === 0) {
    return <EmptySectionStateComponent heightClass="h-20" message="No categories available at the moment." />;
  }

  return (
    <View className="mt-8">
      <Header title="SHOP BY CATEGORY" showSwipeIndicator={categories.length > 0} />
      
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedCategory === item.name;
          return (
            <TouchableOpacity 
              className="items-center mr-6" 
              onPress={() => {
                if (isSelected) {
                  setSelectedCategory(null);
                  setSearchText('');
                } else {
                  setSelectedCategory(item.id);
                  setSearchText(item.name);
                }
              }}
            >
              <View className={`w-14 h-14 rounded-full items-center justify-center border ${
                isSelected ? 'bg-black border-black' : 'bg-gray-100 border-gray-200'
              }`}>
                <Ionicons name={item.icon} size={22} color={isSelected ? 'white' : 'black'} />
              </View>
              <Text className={`text-xs font-semibold mt-2 tracking-tight ${
                isSelected ? 'text-black font-bold' : 'text-gray-800'
              }`}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}