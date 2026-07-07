import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Mock Cart Items structured around your store's items
const INITIAL_CART_ITEMS = [
  {
    id: 'cart_1',
    name: 'Classic Leather Derby',
    category: 'Shoes',
    price: 120000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500',
  },
  {
    id: 'cart_2',
    name: 'Super Voile Fabric Silk',
    category: 'Fabrics',
    price: 85000,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=400',
  },
];

export default function CartScreen() {
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);

  // Quantity Management
  const updateQuantity = (id, action) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const newQty = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Price Calculation Engine
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const deliveryFee = 5000; // Flat rate ₦5,000 delivery fee
  const subtotal = calculateSubtotal();
  const totalAmount = subtotal > 0 ? subtotal + deliveryFee : 0;

  // Formatting utility helper
  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Black Status Bar matching header layout requirements */}
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* HEADER SECTION */}
      <View className="px-4 pt-2 pb-3 bg-black border-b border-zinc-900 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Text className="text-xl font-black tracking-tight text-white">YOUR BAG</Text>
          <View className="ml-2 bg-zinc-800 px-2 py-0.5 rounded-full">
            <Text className="text-white text-[11px] font-bold">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setCartItems([])}>
          <Text className="text-xs font-bold text-gray-400">Clear all</Text>
        </TouchableOpacity>
      </View>

      {/* CART ITEMS LIST */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center pt-32 px-6">
            <View className="w-16 h-16 bg-gray-50 rounded-full items-center justify-center mb-4">
              <Feather name="shopping-bag" size={24} color="#9CA3AF" />
            </View>
            <Text className="text-base font-black text-black">Your bag is empty</Text>
            <Text className="text-xs text-gray-400 text-center mt-1">
              Items you add to your bag will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="flex-row bg-white border border-gray-100 rounded-2xl p-3 mb-4 items-center">
            {/* Product Thumbnail */}
            <View className="w-20 h-24 bg-gray-50 rounded-xl overflow-hidden">
              <Image source={{ uri: item.image }} className="w-full h-full object-cover" />
            </View>

            {/* Product Metadata Context */}
            <View className="flex-1 ml-4 justify-between h-24 py-0.5">
              <View>
                <View className="flex-row justify-between items-start">
                  <Text className="text-xs text-gray-400 font-bold uppercase tracking-wider">{item.category}</Text>
                  <TouchableOpacity onPress={() => removeItem(item.id)} className="p-1 -mt-1 -mr-1">
                    <Ionicons name="trash-outline" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
                <Text className="text-sm font-bold text-black tracking-tight mt-0.5" numberOfLines={1}>
                  {item.name}
                </Text>
              </View>

              {/* Price & Quantity Controls Row */}
              <View className="flex-row justify-between items-center mt-2">
                <Text className="text-sm font-black text-black">{formatCurrency(item.price)}</Text>
                
                {/* Clean Counter Controls */}
                <View className="flex-row items-center bg-gray-100 rounded-lg px-1 py-1">
                  <TouchableOpacity 
                    onPress={() => updateQuantity(item.id, 'decrease')} 
                    className="p-1 bg-white rounded shadow-xs"
                  >
                    <Feather name="minus" size={12} color="black" />
                  </TouchableOpacity>
                  <Text className="text-xs font-black text-black px-3">{item.quantity}</Text>
                  <TouchableOpacity 
                    onPress={() => updateQuantity(item.id, 'increase')} 
                    className="p-1 bg-white rounded shadow-xs"
                  >
                    <Feather name="plus" size={12} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      />

      {/* CHECKOUT SUMMARY BOTTOM FOOTER PANEL */}
      {cartItems.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-2xl">
          {/* Subtotal Breakdowns */}
          <View className="flex-row justify-between items-center mb-1.5">
            <Text className="text-xs font-medium text-gray-400">Subtotal</Text>
            <Text className="text-xs font-bold text-gray-800">{formatCurrency(subtotal)}</Text>
          </View>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xs font-medium text-gray-400">Delivery Fee</Text>
            <Text className="text-xs font-bold text-gray-800">{formatCurrency(deliveryFee)}</Text>
          </View>

          {/* Divided Border Separation */}
          <View className="border-t border-gray-100 my-2" />

          {/* Final Summary Total Row */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-sm font-black text-black">TOTAL AMOUNT</Text>
            <Text className="text-base font-black text-black">{formatCurrency(totalAmount)}</Text>
          </View>

          {/* Action Checkout Call Button */}
          <TouchableOpacity className="bg-black w-full py-4 rounded-xl flex-row justify-center items-center active:opacity-90">
            <Text className="text-white text-xs font-black tracking-widest uppercase mr-2">Proceed to checkout</Text>
            <Feather name="arrow-right" size={14} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}