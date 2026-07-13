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
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

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

// Function to handle No image uploaded
function ImagePlaceholder({ heightClass = "h-44" }) {
  return (
    <View className={`w-full ${heightClass} bg-gray-100 items-center justify-center rounded-xl`}>
      <Ionicons name="image-outline" size={28} color="#9CA3AF" />
      <Text className="text-gray-400 text-[10px] font-medium mt-1">No image uploaded</Text>
    </View>
  );
}

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');             
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [filteredResults, setFilteredResults] = useState([]);
  
  // API State
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    executeSearchFilter();  
  }, [searchQuery, selectedCategory, products]);


  // Function design to handle Search Products executeSearchFilter
  const executeSearchFilter = () => {
    let results = products;

    // Filter by category selection pill
    if (selectedCategory) {
      results = results.filter(item => item.category === selectedCategory.name);
    }

    // Filter by text search: checks name, category string, and price string
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(item => 
        item.name.toLowerCase().includes(query) ||
        (item.category && item.category.toLowerCase().includes(query)) ||
        item.price.toLowerCase().includes(query)
      );
    }

    setFilteredResults(results);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };
 
  //  Function that Fetch All Category
  const handleFetchCategory = async () => {
    setNetworkError(false);  
    setLoading(true);

    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/categories`);
      const res = response.data;
      
      if (res && Array.isArray(res.Data)) {
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

  // Function that Fetch All Products 
  const fetchOurProducts = async () => { 
    try {
      setLoading(true);
      setNetworkError(false); 
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/products`);
      const res = response.data;

      if (res && res.Success && Array.isArray(res.Data)) {
        const formattedProducts = res.Data.map(item => ({
          id: item.ID,
          name: item.ProductName.trim(),
          price: `₦${item.SellingPrice.toLocaleString()}`,
          category: item.Category,
          image: item.LargeImage || item.SmallImage || ''
        }));
        setProducts(formattedProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log("Error fetching products:", error);
      setNetworkError(true); 
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // UseEffect that mount both Fetch Category and Fetch Products
  useEffect(() => {
    handleFetchCategory(); 
    fetchOurProducts();
  }, []); 



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
          
          {/* GET /categories DISCOVERY LIST */}
          <View className="mb-6 px-4">
            <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-3">Browse Categories</Text>
            
            {loading ? (
              <ActivityIndicator size="small" color="#000" className="my-4" />
            ) : networkError ? (
              <TouchableOpacity 
                onPress={() => { handleFetchCategory(); fetchOurProducts(); }} 
                className="bg-gray-50 p-4 rounded-2xl items-center border border-gray-100"
              >
                <Text className="text-xs text-red-500 font-bold">Failed to load content. Tap to Retry</Text>
              </TouchableOpacity>
            ) : (
              <View className="flex-row flex-wrap justify-between">
                {categories.map((cat) => (
                  <TouchableOpacity 
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat)}
                    style={{ width: (width - 44) / 2 }}
                    className="flex-row items-center bg-gray-50 p-4 rounded-2xl mb-3 border border-gray-100"
                  >
                    <View className="w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm mr-3">
                      <Ionicons name={cat.icon} size={16} color="black" />
                    </View>
                    <Text className="text-sm font-bold text-black" numberOfLines={1}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* ALL PRODUCTS VERTICAL GRID */}
          <View className="mb-8 px-4">
            <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-4">All Products</Text>
            <View className="flex-row flex-wrap justify-between">
              {products.map((item) => (
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
                      <TouchableOpacity
                        onPress={() => router.push({ 
                          pathname: "(drawer)/single-product",
                          params: { id: item.id }
                        })}
                       className="bg-black px-2.5 py-1.5 rounded-lg">
                        <Text className="text-[10px] font-bold text-white tracking-wider">ADD</Text>
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
                  <TouchableOpacity
                       onPress={() => router.push({ 
                          pathname: "(drawer)/single-product",
                          params: { id: item.id }
                        })}
                   className="bg-black px-3 py-1.5 rounded-lg">
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