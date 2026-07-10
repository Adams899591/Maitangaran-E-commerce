import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text,  
  StatusBar,   
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator,
  Modal,
  RefreshControl 
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { UserContext } from '@/app/context/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

function ImagePlaceholder({ heightClass = "h-full" }) {
  return (
    <View className={`w-full ${heightClass} bg-gray-100 items-center justify-center rounded-xl px-1`}>
      <Ionicons name="image-outline" size={22} color="#9CA3AF" />
      <Text className="text-gray-400 text-[8px] font-medium mt-1 text-center">No image uploaded</Text>
    </View>
  );
}

export default function CartScreen() {      
  
  const { user } = useContext(UserContext);
  const token = user?.Token; 

  const { productID, quantity: paramQuantity, variantID } = useLocalSearchParams();  

  // --- STATE HOOKS ---
  const [cartItems, setCartItems] = useState([]);
  const [savingItemIds, setSavingItemIds] = useState({});
  const [itemToDelete, setItemToDelete] = useState(null); 
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false); 
  const [isClearing, setIsClearing] = useState(false); 
  
  const [cartTotals, setCartTotals] = useState({
    subtotal: 0,
    deliveryFee: 0, 
    totalAmount: 0,
    totalQuantity: 0
  });

  const router = useRouter();

  // 1. Fetch entire user cart
  const fetchAllUserCart = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const res = response.data;
      if (res.Success && res.Data) {
        setCartItems(res.Data.Items || []);
        setCartTotals({
          subtotal: res.Data.Total || 0,
          deliveryFee: 0 ,      //res.Data.Items?.length > 0 ? 5000 : 0,
          totalAmount: res.Data.Total, //? (res.Data.Total + 5000) : 0,
          totalQuantity: (res.Data.Items || []).reduce((acc, item) => acc + (item.Quantity || 0), 0)
        });
      }
    } catch (error) {
      console.log("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchAllUserCart();
  }, [token]);

  // 2. Add item to cart automatically on navigation
  useEffect(() => {
    const addProductToUserCart = async () => {
      if (!productID || !token) return;
      try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/cart/add`, {
          productID: productID,
          quantity: paramQuantity ? parseInt(paramQuantity, 10) : 1,
          variantID: variantID || null,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.Success) {
          console.log("Product added successfully");
          fetchAllUserCart(); 
        }
      } catch (error) {
        console.log("Error adding product:", error);
      }
    };

    addProductToUserCart();
  }, [productID, token]);

  /**
   * Pull-to-Refresh Action
   */
  const handleOnRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllUserCart();
    setIsRefreshing(false);
  };

  /**
   * Clear All Items Action - FIXED to use DELETE /cart/clear
   */
  const handleClearAllCart = async () => {
    if (cartItems.length === 0 || isClearing || !token) return;
    setIsClearing(true);
    
    try {
      const response = await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success || response.data.Success) {
        setCartItems([]);
        setCartTotals({ subtotal: 0, deliveryFee: 0, totalAmount: 0, totalQuantity: 0 });
        console.log("All products cleared successfully");
      }
    } catch (error) {
      console.error("Failed to empty cart layout on server side:", error);
    } finally {
      setIsClearing(false);
    }
  };

  /**
   * Local Quantity Counter Adjustments
   */
  const updateQuantity = (id, action) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.ID === id) {
          const newQty = action === 'increase' ? item.Quantity + 1 : item.Quantity - 1;
          return newQty > 0 ? { ...item, Quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  /**
   * Row Removal Request Stage
   */
  const requestDeleteConfirm = (id) => {
    setItemToDelete(id);
  };

  /**
   * Single Item Deletion - FIXED to use DELETE verb with data payload configuration
   */
  const handleConfirmDelete = async () => {
    if (!itemToDelete || !token) return;
    setIsDeleting(true);

    try {
      const targetItem = cartItems.find(item => item.ID === itemToDelete);
      if (!targetItem) return;

      // Axios requires a 'data' property configuration context when sending bodies via DELETE methods
      const response = await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/cart/remove`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          productIDs: [targetItem.ProductID]
        }
      });
      
      if (response.data.success || response.data.Success) {
        console.log("Product deleted successfully");
        setCartItems(prevItems => prevItems.filter(item => item.ID !== itemToDelete));
        setItemToDelete(null);
        fetchAllUserCart(); 
      }
    } catch (error) {
      console.error("Failed removing item on server:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Quantity Metric Server Ingestion Synchronization
   */
  const saveItemToServer = async (id) => {
    if (!token) return;
    setSavingItemIds(prev => ({ ...prev, [id]: true }));
    try {
      const targetedItem = cartItems.find(item => item.ID === id);
      if (!targetedItem) return;

      const response = await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/cart/update`, {
        productID: targetedItem.ProductID,
        quantity: targetedItem.Quantity,
        variantID: targetedItem.VariantID, 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success || response.data.Success) {
        console.log("Product updated successfully");
        fetchAllUserCart(); 
      }
    } catch (error) {
      console.error("Failed updating server details:", error);
    } finally {
      setSavingItemIds(prev => ({ ...prev, [id]: false }));
    }
  };

  const formatCurrency = (amount) => {
    return `₦${(amount || 0).toLocaleString()}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* HEADER SECTION */}
      <View className="px-4 pt-2 pb-3 bg-black border-b border-zinc-900 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Text className="text-xl font-black tracking-tight text-white">YOUR BAG</Text>
          <View className="ml-2 bg-zinc-800 px-2 py-0.5 rounded-full">
            <Text className="text-white text-[11px] font-bold">{cartTotals.totalQuantity}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          onPress={handleClearAllCart} 
          disabled={isClearing || cartItems.length === 0}
          className="flex-row items-center space-x-1.5"
        >
          {isClearing ? (
            <ActivityIndicator size="small" color="#A1A1AA" style={{ transform: [{ scale: 0.7 }] }} />
          ) : (
            <Text className={`text-xs font-bold ${cartItems.length === 0 ? 'text-zinc-600' : 'text-gray-400'}`}>
              Clear all
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* CART ITEMS LIST */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.ID}
        contentContainerStyle={{ padding: 16, paddingBottom: 220 }}
        showsVerticalScrollIndicator={false}
        
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleOnRefresh}
            tintColor="#000000"     
            colors={["#000000"]}    
          />
        }
        
        ListEmptyComponent={
          <View className="items-center justify-center pt-32 px-6">
            <View className="w-16 h-16 bg-gray-50 rounded-full items-center justify-center mb-4">
              <Feather name="shopping-bag" size={24} color="#9CA3AF" />
            </View>
            <Text className="text-base font-black text-black">Your bag is empty</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isItemSaving = !!savingItemIds[item.ID];

          return (
            <View className="flex-row bg-white border border-gray-100 rounded-2xl p-3 mb-4 items-center">
              <View className="w-20 h-24 bg-gray-50 rounded-xl overflow-hidden">
                {item.ImageUrl ? (
                  <Image source={{ uri: item.ImageUrl }} className="w-full h-full object-cover" />
                ) : (
                  <ImagePlaceholder />
                )}
              </View>

              <View className="flex-1 ml-4 justify-between h-24 py-0.5">
                <View>
                  <View className="flex-row justify-between items-start">
                    <Text className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      {item.VariantLabel || 'Item'}
                    </Text>
                    
                    <View className="flex-row items-center space-x-1">
                      <TouchableOpacity 
                        onPress={() => saveItemToServer(item.ID)} 
                        disabled={isItemSaving}
                        className="p-1 -mt-1"
                      >
                        {isItemSaving ? (
                          <ActivityIndicator size="small" color="#000000" style={{ transform: [{ scale: 0.75 }] }} />
                        ) : (
                          <Ionicons name="bookmark-outline" size={16} color="#9CA3AF" />
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => requestDeleteConfirm(item.ID)} className="p-1 -mt-1 -mr-1">
                        <Ionicons name="trash-outline" size={16} color="#9CA3AF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text className="text-sm font-bold text-black tracking-tight mt-0.5" numberOfLines={1}>
                    {item.ProductName}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-sm font-black text-black">{formatCurrency(item.Rate)}</Text>
                  
                  <View className="flex-row items-center bg-gray-100 rounded-lg px-1 py-1">
                    <TouchableOpacity 
                      onPress={() => updateQuantity(item.ID, 'decrease')} 
                      className="p-1 bg-white rounded shadow-xs"
                    >
                      <Feather name="minus" size={12} color="black" />
                    </TouchableOpacity>
                    <Text className="text-xs font-black text-black px-3">{item.Quantity}</Text>
                    <TouchableOpacity 
                      onPress={() => updateQuantity(item.ID, 'increase')} 
                      className="p-1 bg-white rounded shadow-xs"
                    >
                      <Feather name="plus" size={12} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* CHECKOUT SUMMARY PANEL */}
      {cartItems.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-2xl">
          <View className="flex-row justify-between items-center mb-1.5">
            <Text className="text-xs font-medium text-gray-400">Subtotal</Text>
            <Text className="text-xs font-bold text-gray-800">{formatCurrency(cartTotals.subtotal)}</Text>
          </View>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xs font-medium text-gray-400">Delivery Fee</Text>
            <Text className="text-xs font-bold text-gray-800">{formatCurrency(cartTotals.deliveryFee)}</Text>
          </View>

          <View className="border-t border-gray-100 my-2" />

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-sm font-black text-black">TOTAL AMOUNT</Text>
            <Text className="text-base font-black text-black">{formatCurrency(cartTotals.totalAmount)}</Text>
          </View>

          <TouchableOpacity           
                        onPress={() => router.push({ 
                          pathname: "/checkout",
                          params: { tatalAmount : cartTotals.totalAmount } // Passing the total cart amount to the checkout page 
                        })}
                        
              className="bg-black w-full py-4 rounded-xl flex-row justify-center items-center active:opacity-90">
            <Text className="text-white text-xs font-black tracking-widest uppercase mr-2">Proceed to checkout</Text>
            <Feather name="arrow-right" size={14} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* CONFIRM DELETE MODAL */}
      <Modal
        visible={!!itemToDelete}
        transparent={true}
        animationType="fade"
        onRequestClose={() => !isDeleting && setItemToDelete(null)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-6">
          <View className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-red-100">
            <View className="bg-red-600 h-1.5 w-full" />
            
            <View className="p-6">
              <View className="flex-row items-center mb-2">
                <View className="bg-red-50 p-2 rounded-full mr-2.5">
                  <Feather name="alert-triangle" size={18} color="#DC2626" />
                </View>
                <Text className="text-base font-black text-red-600 tracking-tight">Remove from Bag?</Text>
              </View>

              <Text className="text-xs text-gray-500 leading-relaxed pl-1">
                Are you sure you want to remove this item? This action will sync with your account and cannot be undone.
              </Text>

              <View className="flex-row justify-end items-center mt-6 space-x-2">
                <TouchableOpacity 
                  onPress={() => setItemToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white active:bg-gray-50"
                >
                  <Text className="text-xs font-bold text-gray-600 uppercase tracking-wider">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={handleConfirmDelete}
                  disabled={isDeleting}
                  className="bg-red-600 active:bg-red-700 px-5 py-2.5 rounded-xl min-w-[100px] items-center justify-center flex-row shadow-sm"
                >
                  {isDeleting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" style={{ transform: [{ scale: 0.8 }] }} />
                  ) : (
                    <Text className="text-white text-xs font-black uppercase tracking-wider">Remove</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}