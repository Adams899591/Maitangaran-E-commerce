import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Keep the local component data structured inside its own module
const CATEGORY_SHOWCASE_DATA = [
  { id: 'cs1', name: 'Premium Voile Classic', previewPrice: '₦45,000', image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=400' },
  { id: 'cs2', name: 'Luxury Shadda Segment', previewPrice: '₦65,000', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400' },
  { id: 'cs3', name: 'Exclusive Royal Lace', previewPrice: '₦85,000', image: '' }, 
];

export default function CategoryShowcase({ 
  searchText, 
  selectedCategory, 
  EmptySectionState, 
  ImagePlaceholder 
}) {
  
  // Handle product filtration logic cleanly inside the showcase component wrapper
  const getFilteredShowcaseItems = () => {
    return CATEGORY_SHOWCASE_DATA.filter(item => {
      const matchText = searchText.trim().toLowerCase();
      const matchCategory = selectedCategory ? selectedCategory.toLowerCase() : '';
      const itemName = item.name.toLowerCase();

      if (matchCategory && !itemName.includes(matchCategory)) return false;
      if (matchText && !itemName.includes(matchText)) return false;
      return true;
    });
  };

  const filteredShowcaseData = getFilteredShowcaseItems();

  if (filteredShowcaseData.length === 0) {
    return (
      <EmptySectionState 
        heightClass="h-44" 
        message={`No category items match "${searchText || selectedCategory}". Try searching for another item.`} 
      />
    );
  }

  return (
    <View className="mt-6">
      <FlatList
        data={filteredShowcaseData}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        keyExtractor={(item) => `cat-product-${item.id}`}
        renderItem={({ item }) => (
          <View style={{ width: width * 0.44 }} className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-2 mr-4">
            <View className="relative bg-gray-50 rounded-xl overflow-hidden">
              {item.image ? (
                <Image source={{ uri: item.image }} className="w-full h-44 object-cover" />
              ) : (
                <ImagePlaceholder heightClass="h-44" />
              )}
            </View>
            <View className="pt-2 px-1">
              <Text className="text-xs font-bold text-black tracking-tight" numberOfLines={1}>{item.name}</Text>
              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-sm font-black text-black">{item.previewPrice}</Text>
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