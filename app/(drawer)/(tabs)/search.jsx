import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  Dimensions,
  ScrollView
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MOCK_CATEGORIES = [
  { id: 'cat_1', name: 'Shoes', icon: 'walk-outline' },
  { id: 'cat_2', name: 'Fabrics', icon: 'layers-outline' },
  { id: 'cat_3', name: 'Lace', icon: 'sparkles-outline' },
  { id: 'cat_4', name: 'Ankara', icon: 'color-palette-outline' },
];

const MOCK_SEARCH_RESULTS = [
  { id: 'p1', name: 'Classic Leather Derby', price: '₦120,000', categoryId: 'cat_1', image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500' },
  { id: 'p2', name: 'Premium Velvet Loafers', price: '₦145,000', categoryId: 'cat_1', image: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=500' },
  { id: 'p3', name: 'Super Voile Fabric Silk', price: '₦85,000', categoryId: 'cat_2', image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=400' },
  { id: 'p4', name: 'Luxury Brocade Material', price: '₦95,000', categoryId: 'cat_2', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500' },
  { id: 'p5', name: 'Premium Ankara Wax', price: '₦40,000', categoryId: 'cat_4', image: '' }, // Testing placeholder fallback here
  { id: 'p6', name: 'Embroidered Swiss Lace', price: '₦110,000', categoryId: 'cat_3', image: 'https://images.unsplash.com/photo-1584143257221-f138841ea1b0?w=500' },
];

// Global Image Placeholder Component
function ImagePlaceholder({ heightClass = "h-44" }) {
  return (
    <View className={`w-full ${heightClass} bg-gray-100 items-center justify-center rounded-xl`}>
      <Ionicons name="image-outline" size={28} color="#9CA3AF" />
      <Text className="text-gray-400 text-[10px] font-medium mt-1">No image uploaded</Text>
    </View>
  );
}

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');             
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [recentSearches, setRecentSearches] = useState(['Shoes', 'Voile Fabric', 'Ankara 2026']);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    executeSearchFilter();
  }, [searchQuery, selectedCategory]);

  const executeSearchFilter = () => {
    let results = MOCK_SEARCH_RESULTS;

    if (selectedCategory) {
      results = results.filter(item => item.categoryId === selectedCategory.id);
    }

    if (searchQuery.trim() !== '') {
      results = results.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredResults(results);
  };

  const handleRecentSearchPress = (query) => {
    setSearchQuery(query);
    const matchedCat = MOCK_CATEGORIES.find(c => c.name.toLowerCase() === query.toLowerCase());
    if (matchedCat) setSelectedCategory(matchedCat);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
       <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* SEARCH HEADER CONTAINER */}
      <View className="px-4 py-3 bg-white border-b border-gray-100 flex-row items-center">
        <View className="flex-1 flex-row items-center bg-gray-100 px-4 py-2.5 rounded-full">
          <Feather name="search" size={18} color="#6B7280" />
          <TextInput 
            placeholder="Search products, categories..." 
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            returnKeyType="search"
            autoFocus={true}
            className="flex-1 text-black text-sm ml-2 font-normal"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} className="p-1">
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity className="ml-3" onPress={clearAllFilters}>
          <Text className="text-sm font-bold text-black">Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* DYNAMIC FILTER STATUS PILLS */}
      {selectedCategory && (
        <View className="bg-gray-50 px-4 py-2 flex-row items-center">
          <View className="bg-black flex-row items-center px-3 py-1.5 rounded-full mr-2">
            <Text className="text-white text-xs font-medium mr-1.5">Category: {selectedCategory.name}</Text>
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Ionicons name="close" size={14} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* CONDITIONAL RENDER STATES */}
      {searchQuery.length === 0 && !selectedCategory ? (
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 pt-4">
          
          {/* RECENT SEARCH HISTORIES */}
          {recentSearches.length > 0 && (
            <View className="mb-6 px-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase">Recent Searches</Text>
                <TouchableOpacity onPress={() => setRecentSearches([])}>
                  <Text className="text-xs font-bold text-gray-400">Clear</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row flex-wrap">
                {recentSearches.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    onPress={() => handleRecentSearchPress(item)}
                    className="bg-gray-100 px-4 py-2 rounded-full mr-2 mb-2"
                  >
                    <Text className="text-xs text-gray-800 font-medium">{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* GET /categories DISCOVERY LIST */}
          <View className="mb-6 px-4">
            <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-3">Browse Categories</Text>
            <View className="flex-row flex-wrap justify-between">
              {MOCK_CATEGORIES.map((cat) => (
                <TouchableOpacity 
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat)}
                  style={{ width: (width - 44) / 2 }}
                  className="flex-row items-center bg-gray-50 p-4 rounded-2xl mb-3 border border-gray-100"
                >
                  <View className="w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm mr-3">
                    <Ionicons name={cat.icon} size={16} color="black" />
                  </View>
                  <Text className="text-sm font-bold text-black">{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* TRENDING PRODUCTS VERTICAL GRID */}
          <View className="mb-8 px-4">
            <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-4">Trending Products</Text>
            <View className="flex-row flex-wrap justify-between">
              {MOCK_SEARCH_RESULTS.map((item) => (
                <View 
                  key={`trending-${item.id}`} 
                  style={{ width: (width - 44) / 2 }} 
                  className="bg-white mb-4 border border-gray-100 rounded-2xl overflow-hidden p-2"
                >
                  <View className="bg-gray-50 rounded-xl overflow-hidden">
                    {item.image ? (
                      <Image source={{ uri: item.image }} className="w-full h-44" resizeMode="cover" />
                    ) : (
                      <ImagePlaceholder heightClass="h-44" />
                    )}
                  </View>
                  <View className="pt-2 px-1">
                    <Text className="text-xs font-bold text-black tracking-tight" numberOfLines={1}>{item.name}</Text>
                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-sm font-black text-black">{item.price}</Text>
                      <TouchableOpacity className="bg-black px-2.5 py-1.5 rounded-lg">
                        <Text className="text-[10px] font-bold text-white tracking-wider">VIEW</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        /* DYNAMIC SEARCH RESULTS GRID */
        <FlatList
          data={filteredResults}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center pt-20 px-6">
              <View className="w-16 h-16 bg-gray-50 rounded-full items-center justify-center mb-4">
                <Feather name="info" size={24} color="#9CA3AF" />
              </View>
              <Text className="text-base font-black text-black">No Results Found</Text>
              <Text className="text-xs text-gray-400 text-center mt-1">
                We couldn't find matches for your selection. Try checking spelling or resetting filters.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={{ width: (width - 44) / 2 }} className="bg-white mb-4 border border-gray-100 rounded-2xl overflow-hidden p-2">
              <View className="relative bg-gray-50 rounded-xl overflow-hidden">
                {item.image ? (
                  <Image source={{ uri: item.image }} className="w-full h-44" resizeMode="cover" />
                ) : (
                  <ImagePlaceholder heightClass="h-44" />
                )}
              </View>
              <View className="pt-2 px-1">
                <Text className="text-xs font-bold text-black tracking-tight" numberOfLines={1}>{item.name}</Text>
                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-sm font-black text-black">{item.price}</Text>
                  <TouchableOpacity className="bg-black px-3 py-1.5 rounded-lg">
                    <Text className="text-[10px] font-bold text-white tracking-wider">ADD</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}