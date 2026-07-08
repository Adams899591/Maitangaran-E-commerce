import React, { useState } from 'react';
import { 
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Related products data pool
const RELATED_PRODUCTS_DATA = [
  { id: 'r1', name: 'Classic Leather Derby', price: '₦120,000', image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500' },
  { id: 'r2', name: 'Minimalist Chrono Watch', price: '₦195,000', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500' },
  { id: 'r3', name: 'Premium Leather Bomber', price: '₦299,000', image: '' }, // Testing fallback placeholder here
  { id: 'r4', name: 'Acetate Sunglasses', price: '₦65,000', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500' },
];

// Global Image Placeholder Component
function ImagePlaceholder({ heightClass = "h-40" }) {
  return (
    <View className={`w-full ${heightClass} bg-gray-100 items-center justify-center rounded-xl`}>
      <Ionicons name="image-outline" size={28} color="#9CA3AF" />
      <Text className="text-gray-400 text-[10px] font-medium mt-1">No image uploaded</Text>
    </View>
  );
}

export default function SingleProductScreen({ route, navigation }) {
  // Simulating the dynamic backend data payload received from your database
  const productData = {
    "id": "productId001",
    "productName": "Wireless Bluetooth Headset",
    "description": "Premium noise-cancelling over-ear headphones with deep bass response, memory foam ear cups, and adaptive ambient listening modes perfect for travel or studio monitoring.",
    "onlineRate": 45000.0,
    "sellingPrice": 50000.0,
    "percentOff": 10.0,
    "largeImage": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    "smallImage": "/uploads/products/headset_small.jpg",
    "category": "Electronics",
    "units": "Pieces",
    "stockLevel": 25,
    "status": "Active",
    "activeStatus": "Active",
    "features": "Noise Cancelling, Bluetooth 5.3, 30h Battery",
    "barCode": "BARCODE123456789",
    "variants": [
      { "id": "variantId001", "attribute": "Color", "value": "Midnight Black", "rate": 45000.0, "onlineRate": 45000.0, "qty": 10, "stockLevel": 10 },
      { "id": "variantId002", "attribute": "Color", "value": "Platinum Silver", "rate": 45000.0, "onlineRate": 45000.0, "qty": 8, "stockLevel": 8 },
      { "id": "variantId003", "attribute": "Color", "value": "Alpine Green", "rate": 47000.0, "onlineRate": 47000.0, "qty": 7, "stockLevel": 7 }
    ]
  };

  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState(productData.variants[0]);
  const [quantity, setQuantity] = useState(1);

  const featuresList = productData.features.split(',').map(item => item.trim());

  return (
    <SafeAreaView className="flex-1 bg-white">
     <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* PRODUCT LARGE IMAGE VIEW */}
        <View style={{ width: width }} className="h-96 bg-gray-50 relative justify-center items-center">
          {productData.largeImage ? (
            <Image 
              source={{ uri: productData.largeImage }} 
              className="w-full h-full" 
              resizeMode="cover" 
            />
          ) : (
            <ImagePlaceholder heightClass="h-96" />
          )}
          {productData.percentOff > 0 && productData.largeImage && (
            <View className="absolute top-4 left-4 bg-black px-3 py-1 rounded-full">
              <Text className="text-white text-[10px] font-black tracking-wider">{productData.percentOff}% OFF</Text>
            </View>
          )}
        </View>

        {/* CORE DETAILS CONTAINER */}
        <View className="p-4 mt-2">
          
          {/* Title and Pricing Information */}
          <Text className="text-2xl font-black text-black tracking-tight leading-7">{productData.productName}</Text>
          
          <View className="flex-row items-baseline mt-3">
            <Text className="text-2xl font-black text-black">
              ₦{selectedVariant ? selectedVariant.onlineRate.toLocaleString() : productData.onlineRate.toLocaleString()}
            </Text>
            {productData.sellingPrice > productData.onlineRate && (
              <Text className="text-sm text-gray-400 line-through ml-2.5 font-medium">
                ₦{productData.sellingPrice.toLocaleString()}
              </Text>
            )}
          </View>

          <View className="w-full h-[1px] bg-gray-100 my-5" />

          {/* DYNAMIC VARIANT PICKER SECTION */}
          {productData.variants && productData.variants.length > 0 && (
            <View className="mb-5">
              <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-3">
                Select {productData.variants[0].attribute}
              </Text>
              <View className="flex-row flex-wrap">
                {productData.variants.map((variant) => {
                  const isSelected = selectedVariant.id === variant.id;
                  return (
                    <TouchableOpacity
                      key={variant.id}
                      onPress={() => setSelectedVariant(variant)}
                      className={`px-4 py-2.5 rounded-xl border mr-2 mb-2 transition-all flex-row items-center ${
                        isSelected ? 'bg-black border-black' : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text className={`text-xs font-bold tracking-tight ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                        {variant.value}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* PRODUCT SPECIFICATIONS / FEATURES TAGS */}
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

          {/* PRODUCT DESCRIPTION SECTION */}
          <View className="mb-5">
            <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-2">Description</Text>
            <Text className="text-sm text-gray-600 font-normal leading-5 tracking-tight">
              {productData.description}
            </Text>
          </View>

          {/* METADATA INFO PILLS (STOCK LEVEL & BARCODE) */}
          <View className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex-row justify-between items-center mt-2">
            <View>
              <Text className="text-[10px] font-black tracking-wider text-gray-400 uppercase">Availability</Text>
              <Text className="text-xs font-bold text-black mt-0.5">
                {selectedVariant.stockLevel > 0 ? `${selectedVariant.stockLevel} ${productData.units} Left In Stock` : 'Out of Stock'}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] font-black tracking-wider text-gray-400 uppercase">SKU / Code</Text>
              <Text className="text-xs font-medium text-gray-500 mt-0.5">{productData.barCode}</Text>
            </View>
          </View>
        </View>

        {/* HORIZONTAL RELATED PRODUCTS CAROUSEL SECTION */}
        <View className="mt-8">
          <View className="flex-row justify-between items-center mb-4 px-4">
            <Text className="text-lg font-black tracking-tight text-black">RELATED PRODUCTS</Text>
            <TouchableOpacity><Text className="text-xs font-bold text-gray-500 tracking-wider">SEE ALL</Text></TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {RELATED_PRODUCTS_DATA.map((product) => (
              <View 
                key={product.id} 
                style={{ width: width * 0.44 }} 
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-2 mr-4"
              >
                <View className="bg-gray-50 rounded-xl overflow-hidden">
                  {product.image ? (
                    <Image source={{ uri: product.image }} className="w-full h-40 object-cover" />
                  ) : (
                    <ImagePlaceholder heightClass="h-40" />
                  )}
                </View>
                <View className="pt-2 px-1">
                  <Text className="text-xs font-bold text-black tracking-tight" numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text className="text-sm font-black text-black mt-1">
                    {product.price}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

      </ScrollView>

      {/* FLOATING ACTION BOTTOM ADD-TO-CART CONTROLS BAR */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex-row items-center justify-between shadow-lg">
        {/* Counter controls */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-2 py-1.5">
          <TouchableOpacity 
            onPress={() => setQuantity(q => Math.max(1, q - 1))} 
            className="w-8 h-8 items-center justify-center bg-white rounded-lg shadow-sm"
          >
            <Feather name="minus" size={14} color="black" />
          </TouchableOpacity>
          <Text className="text-sm font-black text-black px-4">{quantity}</Text>
          <TouchableOpacity 
            onPress={() => setQuantity(q => Math.min(selectedVariant.stockLevel, q + 1))} 
            className="w-8 h-8 items-center justify-center bg-white rounded-lg shadow-sm"
          >
            <Feather name="plus" size={14} color="black" />
          </TouchableOpacity>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          onPress={() => router.push("/cart")}
          disabled={selectedVariant.stockLevel === 0}
          className={`flex-1 ml-4 py-3.5 rounded-xl items-center justify-center flex-row shadow-sm ${
            selectedVariant.stockLevel === 0 ? 'bg-gray-300' : 'bg-black'
          }`}
        >
          <Feather name="shopping-cart" size={16} color="white" />
          <Text className="text-white font-black text-xs tracking-wider ml-2">
            {selectedVariant.stockLevel === 0 ? 'OUT OF STOCK' : 'ADD TO Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}