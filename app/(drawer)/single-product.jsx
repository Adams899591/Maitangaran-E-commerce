
import React, { useContext, useEffect, useState } from 'react';
import { 
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons'; 
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

// Related products data pool (Left unchanged as requested)
const RELATED_PRODUCTS_DATA = [
  { id: 'r1', name: 'Classic Leather Derby', price: '₦120,000', image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500' },
  { id: 'r2', name: 'Minimalist Chrono Watch', price: '₦195,000', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500' },
  { id: 'r3', name: 'Premium Leather Bomber', price: '₦299,000', image: '' }, 
  { id: 'r4', name: 'Acetate Sunglasses', price: '₦65,000', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500' },
];

// Function to handle if they is no image =>     No image uploaded
function ImagePlaceholder({ heightClass = "h-40" }) {
  return (
    <View className={`w-full ${heightClass} bg-gray-100 items-center justify-center rounded-xl`}>
      <Ionicons name="image-outline" size={28} color="#9CA3AF" />
      <Text className="text-gray-400 text-[10px] font-medium mt-1">No image uploaded</Text>
    </View>
  );
}

export default function SingleProductScreen() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const insets = useSafeAreaInsets(); 
  const { id } = useLocalSearchParams(); // get the id that was passed

  // --- Dynamic State Management ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false); // <-- NEW STATE FOR POPUP MODAL

  // Function to fetch Single Product By Id based on the passed id 
  useEffect(() => {
    const fetchSingleProductById = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/products/${id}`);
        const res = response.data;
        console.log(JSON.stringify(res, null, 2));
        
        if (res && res.Success && res.Data) {
          setProduct(res.Data);
          if (res.Data.Variants && res.Data.Variants.length > 0) {
            setSelectedVariant(res.Data.Variants[0]);
          } else {
            setSelectedVariant(null);
          }
        }
      } catch (error) {
        console.log("Error fetching single product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleProductById();
  }, [id]);

  // Handle Add to Cart Interceptor
  const handleAddToCart = () => {
    // If user is not logged in, show auth modal
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Prepare payload: product id, selected quantity and variant id (if any)
    const variantID = selectedVariant?.ID ?? null;

    router.push({
      pathname: "/cart",
      params: {
        productID: product.ID,
        quantity: quantity,
        variantID,
      },
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#000000" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500 font-bold">Product not found</Text>
      </SafeAreaView>
    );
  }

  const featuresList = product.Features 
    ? product.Features.split(',').map(item => item.trim()) 
    : [];

  const currentPrice = selectedVariant ? selectedVariant.OnlineRate : product.OnlineRate;
  const currentStock = selectedVariant 
    ? (selectedVariant.StockLevel !== null ? selectedVariant.StockLevel : selectedVariant.Qty) 
    : product.StockLevel;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* PRODUCT LARGE IMAGE VIEW */}
        <View style={{ width: width }} className="h-96 bg-gray-50 relative justify-center items-center">
          {product.LargeImage ? (
            <Image 
              source={{ uri: product.LargeImage }} 
              className="w-full h-full" 
              resizeMode="cover" 
            />
          ) : (
            <ImagePlaceholder heightClass="h-96" />
          )}
          {product.PercentOff > 0 && product.LargeImage && (
            <View className="absolute top-4 left-4 bg-black px-3 py-1 rounded-full">
              <Text className="text-white text-[10px] font-black tracking-wider">{product.PercentOff}% OFF</Text>
            </View>
          )}
        </View>

        {/* CORE DETAILS CONTAINER */}
        <View className="p-4 mt-2">
          
          <Text className="text-2xl font-black text-black tracking-tight leading-7">{product.ProductName}</Text>
          
          <View className="flex-row items-baseline mt-3">
            <Text className="text-2xl font-black text-black">
              ₦{currentPrice?.toLocaleString()}
            </Text>
            {product.SellingPrice > currentPrice && (
              <Text className="text-sm text-red-400 line-through ml-2.5 font-medium">
                ₦{product.SellingPrice.toLocaleString()}
              </Text>
            )}
          </View>

          <View className="w-full h-[1px] bg-gray-100 my-5" />

          {/* DYNAMIC VARIANT PICKER SECTION */}
          {product.Variants && product.Variants.length > 0 && (
            <View className="mb-5">
              <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-3">
                Select Option
              </Text>
              <View className="flex-row flex-wrap">
                {product.Variants.map((variant, index) => {
                  const isSelected = selectedVariant?.ID === variant.ID;
                  return (
                    <TouchableOpacity
                      key={variant.ID || index}
                      onPress={() => setSelectedVariant(variant)}
                      className={`px-4 py-2.5 rounded-xl border mr-2 mb-2 transition-all flex-row items-center ${
                        isSelected ? 'bg-black border-black' : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text className={`text-xs font-bold tracking-tight ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                        {variant.Attribute}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* PRODUCT SPECIFICATIONS / FEATURES TAGS */}
          {featuresList.length > 0 && (
            <View className="mb-5">
              <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-3">Highlights</Text>
              <View className="flex-row flex-wrap">
                {featuresList.map((feature, idx) => (
                  <View key={idx} className="bg-gray-100 px-3 py-1.5 rounded-lg mr-2 mb-2 flex-row items-center">
                    <Ionicons name="checkmark-circle-outline" size={13} color="black" />
                    <Text className="text-xs text-gray-700 font-semibold ml-1">{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* PRODUCT DESCRIPTION SECTION */}
          <View className="mb-5">
            <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-2">Description</Text>
            <Text className="text-sm text-gray-600 font-normal leading-5 tracking-tight">
              {product.Description || 'No description provided.'}
            </Text>
          </View>

          {/* METADATA INFO PILLS */}
          <View className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex-row justify-between items-center mt-2">
            <View>
              <Text className="text-[10px] font-black tracking-wider text-gray-400 uppercase">Availability</Text>
              <Text className="text-xs font-bold text-black mt-0.5">
                {currentStock > 0 ? `${currentStock} ${product.Units || 'Units'} Left In Stock` : 'Out of Stock'}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] font-black tracking-wider text-gray-400 uppercase">SKU / Code</Text>
              <Text className="text-xs font-medium text-gray-500 mt-0.5">{product.BarCode || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* RELATED PRODUCTS SECTION */}
        <View className="mt-8">
          <View className="flex-row justify-between items-center mb-4 px-4">
            <Text className="text-lg font-black tracking-tight text-black">RELATED PRODUCTS</Text>
            <TouchableOpacity><Text className="text-xs font-bold text-gray-500 tracking-wider">SEE ALL</Text></TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {RELATED_PRODUCTS_DATA.map((item) => (
              <View key={item.id} style={{ width: width * 0.44 }} className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-2 mr-4">
                <View className="bg-gray-50 rounded-xl overflow-hidden">
                  {item.image ? (
                    <Image source={{ uri: item.image }} className="w-full h-40 object-cover" />
                  ) : (
                    <ImagePlaceholder heightClass="h-40" />
                  )}
                </View>
                <View className="pt-2 px-1">
                  <Text className="text-xs font-bold text-black tracking-tight" numberOfLines={1}>{item.name}</Text>
                  <Text className="text-sm font-black text-black mt-1">{item.price}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

      </ScrollView>

      {/* FLOATING ACTION BOTTOM CONTROLS BAR */}
      <View  style={{ paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 12 }} className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex-row items-center justify-between shadow-lg">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-2 py-1.5">
          <TouchableOpacity 
            onPress={() => setQuantity(q => Math.max(1, q - 1))} 
            className="w-8 h-8 items-center justify-center bg-white rounded-lg shadow-sm"
          >
            <Feather name="minus" size={14} color="black" />
          </TouchableOpacity>
          <Text className="text-sm font-black text-black px-4">{quantity}</Text>
          <TouchableOpacity 
            onPress={() => setQuantity(q => Math.min(currentStock, q + 1))} 
            className="w-8 h-8 items-center justify-center bg-white rounded-lg shadow-sm"
          >
            <Feather name="plus" size={14} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={() => handleAddToCart()} // <-- INTERCEPTED ROUTER ACTION
          disabled={currentStock === 0}
          className={`flex-1 ml-4 py-3.5 rounded-xl items-center justify-center flex-row shadow-sm ${
            currentStock === 0 ? 'bg-gray-300' : 'bg-black'
          }`}
        >
          <Feather name="shopping-cart" size={16} color="white" />
          <Text className="text-white font-black text-xs tracking-wider ml-2">
            {currentStock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* AUTH REQUIRED POPUP MODAL */}
      <Modal
        visible={showAuthModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAuthModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-6">
          <View className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-zinc-100">
            {/* Design top accent strip layout */}
            <View className="bg-black h-1.5 w-full" />
            
            <View className="p-6 items-center">
              <View className="bg-zinc-100 w-14 h-14 rounded-full items-center justify-center mb-4">
                <Ionicons name="lock-closed-outline" size={24} color="#000000" />
              </View>
              
              <Text className="text-base font-black text-black tracking-tight text-center">Login Required</Text>
              
              <Text className="text-xs text-gray-500 text-center leading-relaxed mt-2 px-2">
                Please login to add items to your cart and proceed with checking out your bag items.
              </Text>

              {/* Action Buttons Tray Layout */}
              <View className="w-full mt-6 space-y-2">
                {/* Take to Cart / Sign In layout button helper */}
                <TouchableOpacity 
                  onPress={() => {
                    setShowAuthModal(false);
                    router.push("/login");
                  }}
                  className="bg-black w-full py-3 rounded-xl items-center justify-center"
                >
                  <Text className="text-white text-xs font-black uppercase tracking-wider">Go to Login Page</Text>
                </TouchableOpacity>

                {/* Cancel dismissing component button layout wrapper */}
                <TouchableOpacity 
                  onPress={() => setShowAuthModal(false)}
                  className="w-full py-3 rounded-xl border border-gray-200 bg-white items-center justify-center mt-2"
                >
                  <Text className="text-gray-600 text-xs font-bold uppercase tracking-wider">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}