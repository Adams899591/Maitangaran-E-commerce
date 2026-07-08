import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PromotionalBanners from './PromotionalBanners'; // Adjust path if SectionHeader moves or keep using local/props

const CATEGORIES_DATA = [
  { id: '1', name: 'Voile', icon: 'layers-outline' },
  { id: '2', name: 'Shadda', icon: 'ribbon-outline' },
  { id: '3', name: 'Lace', icon: 'sparkles-outline' },
  { id: '4', name: 'Ankara', icon: 'color-palette-outline' },
  { id: '5', name: 'Material', icon: 'cut-outline' },
  { id: '6', name: 'Jakard', icon: 'grid-outline' },
];

export default function CategorySlider({ 
  selectedCategory, 
  setSelectedCategory, 
  setSearchText, 
  SectionHeaderComponent, 
  EmptySectionStateComponent 
}) {
  
  // Choose whichever Header element configuration you prefer
  const Header = SectionHeaderComponent || View;

  if (CATEGORIES_DATA.length === 0) {
    return <EmptySectionStateComponent heightClass="h-20" message="No categories available at the moment." />;
  }

  return (
    <View className="mt-8">
      <Header title="SHOP BY CATEGORY" showSwipeIndicator={CATEGORIES_DATA.length > 0} />
      
      <FlatList
        data={CATEGORIES_DATA}
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
                  setSelectedCategory(item.name);
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