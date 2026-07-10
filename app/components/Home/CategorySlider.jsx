import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
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


export default function CategorySlider({ selectedCategory, setSelectedCategory,  setSearchText, SectionHeaderComponent, EmptySectionStateComponent }) {

  
  const [categories, setCategories] = useState([]);


    // run To fetch  Cartegories once the user enters the home page 
    useEffect(() => {


      const handleFetchCategory = async () => {

              try {
                const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/categories`);
                const res = response.data;
                // console.log(JSON.stringify( res, null, 2));
                // Ensure res.Data exists and is an array before processing  2b43f681-928
                if (res && Array.isArray(res.Data)) {

                      // Map API array structure to match your frontend state needs
                      const formattedCategories = res.Data.map(item => ({
                        id: item.ID,                 // Match uppercase ID from API
                        name: item.Category,         // Match uppercase Category from API
                        icon: getCategoryIcon(item.Category) // Dynamically assign icon
                      }));

                      
                      
                      setCategories(formattedCategories);
                    }
              } catch (error) {
                console.log("Error fetching categories:", error);
              }
      };

      handleFetchCategory(); 
    }, []); 






 // run To fetch  Cartegories once the user enters the home page 
    // useEffect(() => {


    //   const handle = async () => {

    //           try {
    //             // const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/categories/4314ac06-dad`);
    //             const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/products/category/4314ac06-dad`);
    //             const res = response.data;
    //             console.log(JSON.stringify(res, null, 2)); 
                
    //             // Ensure res.Data exists and is an array before processing
    //             // if (res && Array.isArray(res.Data)) {

    //             //       // Map API array structure to match your frontend state needs
    //             //       const formattedCategories = res.Data.map(item => ({
    //             //         id: item.ID,                 // Match uppercase ID from API
    //             //         name: item.Category,         // Match uppercase Category from API
    //             //         icon: getCategoryIcon(item.Category) // Dynamically assign icon
    //             //       }));

    //             //       setCategories(formattedCategories);
    //             //     }
    //           } catch (error) {
    //             console.log("Error fetching categories:", error);
    //           }
    //   };

    //   handle(); 
    // }, []);
















  // Choose whichever Header element configuration you prefer
  const Header = SectionHeaderComponent || View;

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
                  // Set the selected state to the active category's unique ID.
                  // This ID (e.g., "4314ac06-dad") will be tracked by the parent component Home.jsx
                  // and passed into the CategoryShowcase API hook to fetch filtered products from Laravel.
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