import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
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
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Mock Data representing items initially available inside the user's bag
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
  {
    id: 'cart_3',
    name: 'Premium Cashmere Wool Blend',
    category: 'Fabrics',
    price: 120000,
    quantity: 1,
    image: '', 
  },
  {
    id: 'cart_4',
    name: 'Italian Brocade Floral Damask',
    category: 'Fabrics',
    price: 95000,
    quantity: 3,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
  }
];

// Fallback component layout for inventory missing clean cover urls
function ImagePlaceholder({ heightClass = "h-full" }) {
  return (
    <View className={`w-full ${heightClass} bg-gray-100 items-center justify-center rounded-xl px-1`}>
      <Ionicons name="image-outline" size={22} color="#9CA3AF" />
      <Text className="text-gray-400 text-[8px] font-medium mt-1 text-center">No image uploaded</Text>
    </View>
  );
}

export default function CartScreen() {
  // --- STATE HOOKS ---
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
  const [savingItemIds, setSavingItemIds] = useState({});
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false); 
  const [isClearing, setIsClearing] = useState(false); // <-- NEW STATE: Tracks server side "Clear all" request status
  
  // Totals layout structure managed globally through mock state
  const [cartTotals, setCartTotals] = useState({
    subtotal: 715000,
    deliveryFee: 5000,
    totalAmount: 720000,
    totalQuantity: 14
  });

  const router = useRouter();

  // --- LOGIC MECHANISMS & API HANDLERS ---

  /**
   * 1. Pull-to-Refresh Action
   * Triggered when swipe down actions occur over the primary FlatList.
   * Place your primary cart synchronization and recalculation endpoint logic here.
   */
  const handleOnRefresh = async () => {
    setIsRefreshing(true);
    try {
      console.log("Pull-to-refresh activated. Syncing with backend server...");
      
      // Simulating network roundtrip latency (1.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // PLACE YOUR BACKEND FETCH LOGIC HERE:
      // const response = await axios.get('/api/cart');
      // setCartItems(response.data.items);
      // setCartTotals(response.data.totals);
      
    } catch (error) {
      console.error("Failed to sync cart data on pull-to-refresh:", error);
    } finally {
      setIsRefreshing(false); // Clean up load states immediately
    }
  };

  /**
   * 2. Clear All Items Action
   * Triggered when clicking the "Clear all" button in the header.
   * Drop all cart data via an asynchronous server side call.
   */
  const handleClearAllCart = async () => {
    if (cartItems.length === 0 || isClearing) return;
    setIsClearing(true);
    
    try {
      console.log("Sending bulk API instruction to delete all items inside cart...");
      
      // Simulating bulk backend deletion processing lag (1.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // PLACE YOUR BACKEND API CLEAR ALL LOGIC HERE:
      // await axios.delete('/api/cart/clear-all');
      
      // Clear local array state on server success confirmation
      setCartItems([]);
      setCartTotals({ subtotal: 0, deliveryFee: 0, totalAmount: 0, totalQuantity: 0 });
    } catch (error) {
      console.error("Failed to empty cart layout on server side:", error);
    } finally {
      setIsClearing(false);
    }
  };

  /**
   * 3. Local Quantity Counter Adjustments
   * Mutates local structural array fields prior to pushing formal server-side save payloads.
   */
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

  /**
   * 4. Row Removal Request Stage
   * Opens the danger-themed red verification modal context.
   */
  const requestDeleteConfirm = (id) => {
    setItemToDelete(id);
  };

  /**
   * 5. Destructive Item Dropping Endpoint Execution
   * Fired inside the red validation warning modal when the user commits to clearing the entry.
   */
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      console.log('Sending API instruction to remove item:', itemToDelete);
      
      // Simulating server dropping processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // PLACE YOUR BACKEND DELETE CALL HERE:
      // const response = await axios.delete(`/api/cart/${itemToDelete}`);
      // setCartTotals(response.data.newTotals);
      
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemToDelete));
      setItemToDelete(null); // Safely collapse modal viewport
    } catch (error) {
      console.error("Failed removing item on server:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * 6. Quantity Metric Server Ingestion Synchronization
   * Executed when saving modifications to a row item's configuration properties.
   */
  const saveItemToServer = async (id) => {
    setSavingItemIds(prev => ({ ...prev, [id]: true }));
    try {
      const targetedItem = cartItems.find(item => item.id === id);
      console.log("Sending updated row quantity properties to backend server:", targetedItem);

      // Simulating standard API response processing lag
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // PLACE YOUR BACKEND UPDATE CALL HERE:
      // const response = await axios.put(`/api/cart/${id}`, { quantity: targetedItem.quantity });
      // setCartTotals(response.data.newTotals);

    } catch (error) {
      console.error("Failed updating server details:", error);
    } finally {
      setSavingItemIds(prev => ({ ...prev, [id]: false }));
    }
  };

  /**
   * Formatting Utility Helper
   */
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
        
        {/* Clear All action text layout handler */}
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
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 220 }}
        showsVerticalScrollIndicator={false}
        
        // REFRESH CONTROL HOOK: Standard layout component handling user swipe gestures
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleOnRefresh}
            tintColor="#000000"     // iOS spinner color representation
            colors={["#000000"]}    // Android spinner color cycle mappings
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
          const isItemSaving = !!savingItemIds[item.id];

          return (
            <View className="flex-row bg-white border border-gray-100 rounded-2xl p-3 mb-4 items-center">
              {/* Image thumbnail wrap container */}
              <View className="w-20 h-24 bg-gray-50 rounded-xl overflow-hidden">
                {item.image ? (
                  <Image source={{ uri: item.image }} className="w-full h-full object-cover" />
                ) : (
                  <ImagePlaceholder />
                )}
              </View>

              {/* Text contextual area */}
              <View className="flex-1 ml-4 justify-between h-24 py-0.5">
                <View>
                  <View className="flex-row justify-between items-start">
                    <Text className="text-xs text-gray-400 font-bold uppercase tracking-wider">{item.category}</Text>
                    
                    <View className="flex-row items-center space-x-1">
                      {/* Save Button */}
                      <TouchableOpacity 
                        onPress={() => saveItemToServer(item.id)} 
                        disabled={isItemSaving}
                        className="p-1 -mt-1"
                      >
                        {isItemSaving ? (
                          <ActivityIndicator size="small" color="#000000" style={{ transform: [{ scale: 0.75 }] }} />
                        ) : (
                          <Ionicons name="bookmark-outline" size={16} color="#9CA3AF" />
                        )}
                      </TouchableOpacity>

                      {/* Delete Button */}
                      <TouchableOpacity onPress={() => requestDeleteConfirm(item.id)} className="p-1 -mt-1 -mr-1">
                        <Ionicons name="trash-outline" size={16} color="#9CA3AF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text className="text-sm font-bold text-black tracking-tight mt-0.5" numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>

                {/* Price and Counter Component Control Row */}
                <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-sm font-black text-black">{formatCurrency(item.price)}</Text>
                  
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

          <TouchableOpacity onPress={() => router.push('/checkout')} className="bg-black w-full py-4 rounded-xl flex-row justify-center items-center active:opacity-90">
            <Text className="text-white text-xs font-black tracking-widest uppercase mr-2">Proceed to checkout</Text>
            <Feather name="arrow-right" size={14} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* FIXED RED CONFIRM DELETE MODAL */}
      <Modal
        visible={!!itemToDelete}
        transparent={true}
        animationType="fade"
        onRequestClose={() => !isDeleting && setItemToDelete(null)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-6">
          <View className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-red-100">
            {/* Top warning line strip accent */}
            <View className="bg-red-600 h-1.5 w-full" />
            
            {/* Fully Native React Native View Component Body Wrapper */}
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

              {/* Modal Confirmation Action Tray */}
              <View className="flex-row justify-end items-center mt-6 space-x-2">
                {/* Cancel Trigger Button */}
                <TouchableOpacity 
                  onPress={() => setItemToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white active:bg-gray-50"
                >
                  <Text className="text-xs font-bold text-gray-600 uppercase tracking-wider">Cancel</Text>
                </TouchableOpacity>

                {/* Destructive Executing Confirm Button */}
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



