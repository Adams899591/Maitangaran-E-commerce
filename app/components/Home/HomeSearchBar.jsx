import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons'; 

const HomeSearchBar = ({ setSearchText, selectedCategory, setSelectedCategory, searchText}) => {
  
  // Function to Clear search filter
  const clearFilters = () => {
    setSearchText('');
    setSelectedCategory(null);
  };
  
  
  return (
      <>
          { /* Sticky-Style Search Bar Container */ }
          <View className="p-4 bg-white">
            <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-full">
              
              {/* Search Icon */}
              <Feather name="search" size={18} color="#6B7280" />
              
              {/* Input Field */}
              <TextInput 
                placeholder="Search modern essentials..." 
                placeholderTextColor="#9CA3AF"
                value={searchText}
                onChangeText={(text) => {
                  setSearchText(text);
                  // Good logic here: clearing category when user types
                  if (selectedCategory) setSelectedCategory(null); 
                }}
                className="flex-1 text-black text-sm ml-2 font-normal p-0" // Added p-0 to prevent Android layout jumps
              />
              
              {/* Clear Button */}
              {(searchText.length > 0 || selectedCategory !== null) && (
                <TouchableOpacity onPress={clearFilters} className="p-1" activeOpacity={0.7}>
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
              
            </View>
          </View>
      </>
  );
};

export default HomeSearchBar 

