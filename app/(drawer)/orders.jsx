import React, { useContext, useState, useCallback } from 'react'; 
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

export default function OrdersTableScreen() {
    
  const { user } = useContext(UserContext);
  const token = user?.Token; 

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); 
  const [orders, setOrders] = useState([]);

  // Fetch user's orders from API (use silent loader for refreshes)
  const fetchUserOrders = async (showMinimalLoader = false) => {
    if (!token) {
      setOrders([]);
      return;
    }

    try {
      if (!showMinimalLoader) setIsLoading(true);
      
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
             
      if (response.data && response.data.Success) {
        // SORTING FIX: Sorts orders chronologically (Oldest first -> Newest last)
        // This guarantees that the most recent order sits at the bottom of the table
        const sortedOrders = (response.data.Data || []).sort((a, b) => {
          return new Date(a.Date).getTime() - new Date(b.Date).getTime();
        });
        
        setOrders(sortedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh list whenever this screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchUserOrders(orders.length > 0); 
    }, [token])
  );

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserOrders(true);
    setRefreshing(false);
  };

  // Convert numeric status code to readable label
  const parseStatus = (status) => {
    if (status === 0) return 'Cancelled';
    if (status === 2) return 'Processing';
    return 'Active';
  };

  // Format ISO datetime string to YYYY-MM-DD
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return dateStr.split('T')[0];
  };

  return (
     <>
        {/* HEADER - Page title and short description */}
        <View className="px-6 mt-6 mb-6">
          <Text className="text-2xl font-black tracking-tight text-black">Order Ledger</Text>
          <Text className="text-xs text-gray-400">Scroll horizontally to view details and check invoice parameters.</Text>
        </View>

        {isLoading && !refreshing ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="small" color="#000000" />
          </View>
        ) : (
          <ScrollView 
            className="flex-1"
            refreshControl = {
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#000000" />
            }
          >
            {orders.length === 0 ? (
              <View className="flex-1 items-center justify-center py-20 px-6">
                <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />
                <Text className="text-black text-base font-bold mt-4 tracking-tight">No Orders Found</Text>
                <Text className="text-gray-400 text-xs text-center mt-1 max-w-[260px]">
                  Your ledger is currently empty. Any new invoices or placement balances will show up right here.
                </Text>
              </View>
            ) : (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={true} 
                className="pl-6"
                contentContainerStyle={{ paddingRight: 24, paddingBottom: 200}}
              >
                <View className="border border-gray-100 rounded-lg overflow-hidden mb-10">
                  
                  {/* TABLE HEADER - column labels */}
                  <View className="flex-row bg-black py-4 px-5 items-center">
                    <Text className="text-white text-xs font-bold w-12 text-center">S/N</Text>
                    <Text className="text-white text-xs font-bold w-28">Date</Text>
                    <Text className="text-white text-xs font-bold w-28">Total</Text>
                    <Text className="text-white text-xs font-bold w-24">Payment</Text>
                    <Text className="text-white text-xs font-bold w-28">Status</Text>
                    <Text className="text-white text-xs font-bold w-56">Delivery Address</Text>
                    <Text className="text-white text-xs font-bold w-20 text-center">Action</Text>
                  </View>

                  {/* TABLE ROWS - one row per order */} 
                  {orders.map((item, index) => {
                    let paymentStatus = 'Unpaid';
                    let paymentColor = 'text-gray-400';
                    
                    if (item.AmountPaid >= item.Total && item.Total > 0) {
                      paymentStatus = 'Paid';
                      paymentColor = 'text-emerald-600';
                    } else if (item.AmountPaid > 0) {
                      paymentStatus = 'Partial';
                      paymentColor = 'text-amber-500';
                    }

                    return (
                      <View 
                        key={item.InvoiceID || index.toString()}
                        className="flex-row border-b border-gray-100 bg-gray-50/50 py-4 px-5 items-center"
                      >
                        {/* Since array is sorted oldest -> newest, index + 1 gives the newest item the last/highest number */}
                        <Text className="text-black text-xs font-mono font-bold w-12 text-center">{index + 1}</Text>
                        <Text className="text-gray-600 text-xs w-28">{formatDate(item.Date)}</Text>
                        <Text className="text-black text-xs font-bold w-28">₦{item.Total?.toLocaleString()}</Text>
                        
                        <Text className={`text-xs font-bold w-24 ${paymentColor}`}>
                          {paymentStatus}
                        </Text>
                        
                        <Text className={`text-xs font-bold w-28 ${item.Status === 0 ? 'text-red-500' : item.Status === 2 ? 'text-blue-500' : 'text-amber-500'}`}>
                          {parseStatus(item.Status)}
                        </Text>

                        <Text className="text-gray-500 text-xs w-56" numberOfLines={1} ellipsizeMode='tail'>
                          {item.Address}
                        </Text>

                        <View className="w-20 items-center justify-center">
                          <TouchableOpacity 
                            onPress={() => router.push({
                              pathname: '/order-details',
                              params: { InvoiceID: item.InvoiceID }
                            })}
                            className="bg-black px-3 py-2 rounded-md flex-row items-center justify-center active:opacity-80"
                          >
                            <Text className="text-white text-[10px] font-black tracking-wider uppercase mr-1">View</Text>
                            <Ionicons name="eye-outline" size={12} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}

                </View>
              </ScrollView>
            )}
          </ScrollView>
        )}
      </>
  );
}