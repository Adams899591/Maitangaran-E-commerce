import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const BASE_BANNERS = [
  { id: '1', title: 'SUMMER ESSENTIALS', subtitle: 'UP TO 50% OFF', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800' },
  { id: '2', title: 'MINIMALIST LOOKBOOK', subtitle: 'NEW SEASON', image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800' },
  { id: '3', title: 'PREMIUM TRADITIONAL', subtitle: 'THE LUXURY COLLECTION', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800' },
  { id: '4', title: 'MODERN ACCESSORIES', subtitle: 'CHRONO & LEATHER GEAR', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800' }
];

// Append a clone of the first item to the end for seamless looping
const BANNERS_DATA = [...BASE_BANNERS, { ...BASE_BANNERS[0], id: 'clone-1' }];

const CATEGORIES_DATA = [
  { id: '1', name: 'Voile', icon: 'layers-outline', image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=400', previewPrice: '₦45,000' },
  { id: '2', name: 'Shadda', icon: 'ribbon-outline', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400', previewPrice: '₦65,000' },
  { id: '3', name: 'Lace', icon: 'sparkles-outline', image: 'https://images.unsplash.com/photo-1584143257221-f138841ea1b0?w=400', previewPrice: '₦85,000' },
  { id: '4', name: 'Ankara', icon: 'color-palette-outline', image: 'https://images.unsplash.com/photo-1610116306796-6ebd30d77fa1?w=400', previewPrice: '₦35,000' },
  { id: '5', name: 'Material', icon: 'cut-outline', image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=400', previewPrice: '₦25,000' },
  { id: '6', name: 'Jakard', icon: 'grid-outline', image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400', previewPrice: '₦75,000' },
];

const FEATURED_PRODUCTS_DATA = [
  { id: 'f1', name: 'Classic Leather Derby', price: '₦120,000', oldPrice: '₦180,000', rating: 4.9, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500' },
  { id: 'f2', name: 'Minimalist Chrono Watch', price: '₦195,000', rating: 4.8, image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500' },
  { id: 'f3', name: 'Premium Leather Bomber', price: '₦299,000', rating: 5.0, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500' }
];

const NEW_ARRIVALS_DATA = [
  { id: 'n1', name: 'Heavyweight Oversized Tee', price: '₦45,000', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500' },
  { id: 'n2', name: 'Tailored Linen Trousers', price: '₦85,000', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500' },
  { id: 'n3', name: 'Canvas Everyday Tote', price: '₦35,000', oldPrice: '₦50,000', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500' },
  { id: 'n4', name: 'Acetate Sunglasses', price: '₦65,000', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  // Auto-scroll loop effect
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      
      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  // Handle snapping back to start when sliding past the final clone card
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = contentOffsetX / (width - 32);
    
    // If we smoothly arrived at the cloned item (end of array)
    if (currentIndex >= BANNERS_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: 0,
        animated: false, // Turn off animation to instantly swap out the clone
      });
      setActiveIndex(0);
    }
  };

  const handleMomentumScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / (width - 32));
    
    if (currentIndex >= 0 && currentIndex < BANNERS_DATA.length - 1) {
      setActiveIndex(currentIndex);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Sticky-Style Search Bar */}
        <View className="p-4 bg-white">
          <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-full">
            <Feather name="search" size={18} color="#6B7280" />
            <TextInput 
              placeholder="Search modern essentials..." 
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
              className="flex-1 text-black text-sm ml-2 font-normal"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')} className="p-1">
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 2. Promotional Banners Carousel */}
        <FlatList 
          ref={flatListRef}
          data={BANNERS_DATA}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View style={{ width: width - 32 }} className="mx-4 h-48 bg-black rounded-2xl overflow-hidden relative">
              <Image source={{ uri: item.image }} className="w-full h-full opacity-60 absolute" />
              <View className="p-6 justify-between h-full z-10">
                <View>
                  <Text className="text-white text-[10px] font-bold tracking-widest bg-black/40 self-start px-2 py-1 rounded">LIMITED</Text>
                  <Text className="text-white text-2xl font-black mt-2 tracking-tight">{item.title}</Text>
                  <Text className="text-gray-300 text-sm font-medium mt-1">{item.subtitle}</Text>
                </View>
                <TouchableOpacity className="bg-white px-5 py-2.5 rounded-xl self-start">
                  <Text className="text-black font-bold text-xs tracking-wider">SHOP NOW</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* 3. Categories Slider */}
        <View className="mt-8">
          <View className="px-4 mb-4 flex-row justify-between items-center">
            <Text className="text-lg font-black tracking-tight text-black">SHOP BY CATEGORY</Text>
          </View>
          <FlatList
            data={CATEGORIES_DATA}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity className="items-center mr-6" onPress={() => setSearchText(item.name)}>
                <View className="w-14 h-14 bg-gray-100 rounded-full items-center justify-center border border-gray-200">
                  <Ionicons name={item.icon} size={22} color="black" />
                </View>
                <Text className="text-xs font-semibold text-gray-800 mt-2 tracking-tight">{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Standalone Section: Category Item Showcases */}
        <View className="mt-4">
          <FlatList
            data={CATEGORIES_DATA}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            keyExtractor={(item) => `cat-product-${item.id}`}
            renderItem={({ item }) => (
              <View style={{ width: width * 0.44 }} className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-2 mr-4">
                <View className="relative bg-gray-50 rounded-xl overflow-hidden">
                  <Image source={{ uri: item.image }} className="w-full h-44 object-cover" />
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

        {/* Category Fabric Showcases */}
        <View className="mt-8">
          <View className="flex-row justify-between items-center mb-4 px-4">
            <Text className="text-lg font-black tracking-tight text-black">FEATURED FABRICS</Text>
            <Text className="text-xs font-bold text-gray-400 tracking-wider">TAP TO FILTER</Text>
          </View>
          
          <FlatList
            data={CATEGORIES_DATA}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            keyExtractor={(item) => `fabric-${item.id}`}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={{ width: width * 0.44 }} 
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-2 mr-4"
                onPress={() => setSearchText(item.name)}
              >
                <View className="bg-gray-50 rounded-xl overflow-hidden">
                  <Image source={{ uri: item.image }} className="w-full h-36 object-cover" />
                </View>
                <View className="pt-2 pb-1 px-1 flex-row justify-between items-center">
                  <View>
                    <Text className="text-xs font-black text-black tracking-tight">{item.name.toUpperCase()}</Text>
                    <Text className="text-[10px] text-gray-400 font-medium mt-0.5">Explore Collection</Text>
                  </View>
                  <View className="bg-gray-100 p-1.5 rounded-lg">
                    <Feather name="arrow-right" size={12} color="black" />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* 4. Swipable Featured Showcases */}
        <View className="mt-8">
          <View className="flex-row justify-between items-center mb-4 px-4">
            <Text className="text-lg font-black tracking-tight text-black">TRENDING NOW</Text>
            <TouchableOpacity><Text className="text-xs font-bold text-gray-500 tracking-wider">SEE ALL</Text></TouchableOpacity>
          </View>
          
          <FlatList
            data={FEATURED_PRODUCTS_DATA}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item: product }) => (
              <View style={{ width: width * 0.44 }} className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-2 mr-4">
                <View className="relative bg-gray-50 rounded-xl overflow-hidden">
                  <Image source={{ uri: product.image }} className="w-full h-40 object-cover" />
                  {product.oldPrice && (
                    <View className="absolute bottom-2 left-2 bg-black px-2 py-0.5 rounded">
                      <Text className="text-white text-[10px] font-bold">SALE</Text>
                    </View>
                  )}
                </View>
                <View className="pt-2 px-1">
                  <Text className="text-xs font-bold text-black tracking-tight" numberOfLines={1}>{product.name}</Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="star" size={12} color="black" />
                    <Text className="text-[11px] font-medium text-black ml-1">{product.rating}</Text>
                  </View>
                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-baseline">
                      <Text className="text-sm font-black text-black">{product.price}</Text>
                      {product.oldPrice && <Text className="text-[11px] text-gray-400 line-through ml-1.5">{product.oldPrice}</Text>}
                    </View>
                    <TouchableOpacity className="bg-black p-2 rounded-lg">
                      <Feather name="plus" size={14} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </View>

        {/* 5. Real-time New Arrivals */}
        <View className="mt-8 px-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-black tracking-tight text-black">NEW ARRIVALS</Text>
            <TouchableOpacity><Text className="text-xs font-bold text-gray-500 tracking-wider">BROWSE ALL</Text></TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {NEW_ARRIVALS_DATA.map((product) => (
              <View key={product.id} style={{ width: (width - 44) / 2 }} className="bg-white mb-4 border border-gray-100 rounded-2xl overflow-hidden p-2">
                <View className="relative bg-gray-50 rounded-xl overflow-hidden">
                  <Image source={{ uri: product.image }} className="w-full h-44 object-cover" />
                </View>
                <View className="pt-2 px-1">
                  <Text className="text-xs font-bold text-black tracking-tight" numberOfLines={1}>{product.name}</Text>
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-sm font-black text-black">{product.price}</Text>
                    <TouchableOpacity onPress={() => router.push("(drawer)/single-product")} className="bg-black px-3 py-1.5 rounded-lg">
                      <Text className="text-[10px] font-bold text-white tracking-wider">ADD</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}









