import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar,  
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OrderDetailsScreen() {
  const { user } = useContext(UserContext);
  const insets = useSafeAreaInsets();
  const token = user?.Token; 
  const { InvoiceID } = useLocalSearchParams();  // get the InVoiceID
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!InvoiceID) return;
      try {
        setIsLoading(true);
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/orders/${InvoiceID}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });

        if (response.data && response.data.Success) {
          setOrderData(response.data.Data);
        }
      } catch (error) {
        console.log("Error fetching order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [InvoiceID, token]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 0:
        return { label: 'Cancelled', bg: 'bg-rose-50', text: 'text-rose-600', icon: 'close-circle' };
      case 2:
        return { label: 'Processing', bg: 'bg-blue-50', text: 'text-blue-600', icon: 'sync' };
      default:
        return { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'checkmark-circle' };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleCancelOrder = () => {
    if (!orderData) return;
    
    // Front-end sanity checks before firing the API request
    if (orderData.Status === 0) return Alert.alert("Order Cancelled", "This order is already cancelled.");
    if (orderData.AmountPaid >= orderData.Total) return Alert.alert("Action Denied", "Paid orders cannot be cancelled.");
    if (orderData.Status === 2) return Alert.alert("Action Denied", "Orders already processing cannot be cancelled.");

    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        { text: "Go back", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: "destructive",
          onPress: async () => {
            setIsCancelling(true);
            
            try {
              const response = await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/orders/${InvoiceID}/cancel`,
                {}, // PUT requests require a body object, even if empty
                {
                  headers: {
                    Authorization: `Bearer ${token}` 
                  }
                }
              );
                  console.log(JSON.stringify(response, null, 2));
                  
              if (response.data && response.data.success) {
                // Instantly update the UI status to match the newly cancelled order state
                setOrderData(prev => ({ ...prev, Status: 0 }));
                Alert.alert("Success", response.data.message || "Order has been cancelled.");
              }
            } catch (error) {
              console.log("Error cancelling order:", error);
              
              // Handle specific error codes thrown by your documentation backend
              if (error.response) {
                const status = error.response.status;
                
                if (status === 400) {
                  Alert.alert("Action Denied", "This order cannot be cancelled (It might already be processed, paid, or cancelled).");
                } else if (status === 404) {
                  Alert.alert("Not Found", "The requested order could not be located on the server.");
                } else {
                  Alert.alert("Error", "Failed to cancel order. Please try again later.");
                }
              } else {
                Alert.alert("Network Error", "Please check your internet connection and try again.");
              }
            } finally {
              setIsCancelling(false);
            }
          }
        }
      ]
    );
  };

  const cardShadow = {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 12 },
      android: { elevation: 2 }
    })
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="small" color="#0f172a" />
      </SafeAreaView>
    );
  }

  if (!orderData) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center p-6">
        <Ionicons name="search-outline" size={48} color="#94a3b8" />
        <Text className="text-slate-900 font-semibold text-lg mt-4">Order Not Found</Text>
        <Text className="text-slate-500 text-sm text-center mt-1">The requested order details could not be retrieved.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 bg-slate-900 px-5 py-3 rounded-xl">
          <Text className="text-white text-sm font-medium">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const statusConfig = getStatusConfig(orderData.Status);
  
  // Calculate Payment status checks dynamically
  let paymentStatus = 'Unpaid';
  let paymentBg = 'bg-amber-50';
  let paymentText = 'text-amber-600';
  
  if (orderData.AmountPaid >= orderData.Total && orderData.Total > 0) {
    paymentStatus = 'Paid';
    paymentBg = 'bg-emerald-50';
    paymentText = 'text-emerald-600';
  } else if (orderData.AmountPaid > 0) {
    paymentStatus = 'Partial';
    paymentBg = 'bg-blue-50';
    paymentText = 'text-blue-600';
  }

  const canCancel = orderData.Status !== 0 && paymentStatus !== 'Paid' && orderData.Status !== 2;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* HEADER BAR */}
      <View className="px-4 py-3 bg-white border-b border-slate-100 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.push("/orders")} className="p-1 -ml-1 flex-row items-center">
          <Ionicons name="chevron-back" size={24} color="#0f172a" />
          <Text className="text-slate-900 font-medium ml-1">Order Details</Text>
        </TouchableOpacity>
        <Text className="text-[10px] font-medium text-slate-400 font-mono w-40 text-right" numberOfLines={1} ellipsizeMode="tail">
          {orderData.InvoiceID}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: canCancel ? 200 : 40 }}>
        
        {/* HERO CARD SUMMARY */}
        <View className="bg-slate-900 rounded-3xl p-5 mb-5" style={cardShadow}>
          <Text className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Amount</Text>
          <Text className="text-white text-3xl font-bold mt-1">₦{orderData.Total?.toLocaleString()}</Text>
          
          <View className="flex-row items-center justify-between mt-6 pt-4 border-t border-slate-800">
            <View>
              <Text className="text-slate-400 text-[11px] uppercase tracking-wider">Date Placed</Text>
              <Text className="text-white text-sm font-medium mt-0.5">{formatDate(orderData.Date)}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className={`flex-row items-center px-2.5 py-1 rounded-full ${statusConfig.bg}`}>
                <Ionicons name={statusConfig.icon} size={13} className={statusConfig.text} />
                <Text className={`text-xs font-semibold ml-1 ${statusConfig.text}`}>{statusConfig.label}</Text>
              </View>
              <View className={`px-2.5 py-1 rounded-full ${paymentBg}`}>
                <Text className={`text-xs font-semibold ${paymentText}`}>{paymentStatus}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* DELIVERY & NOTES SECTION */}
        <View className="bg-white rounded-2xl p-4 mb-5 border border-slate-100" style={cardShadow}>
          <View className="flex-row items-start mb-3">
            <View className="p-2 bg-slate-50 rounded-xl mr-3">
              <Ionicons name="location-outline" size={18} color="#475569" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Delivery Address</Text>
              <Text className="text-slate-800 text-sm font-medium mt-0.5 leading-5">{orderData.Address}</Text>
            </View>
          </View>

          {orderData.Notes && (
            <View className="flex-row items-start mt-3 pt-3 border-t border-slate-50">
              <View className="p-2 bg-slate-50 rounded-xl mr-3">
                <Ionicons name="document-text-outline" size={18} color="#475569" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Order Notes</Text>
                <Text className="text-slate-600 text-sm italic mt-0.5">"{orderData.Notes}"</Text>
              </View>
            </View>
          )}
        </View>

        {/* ORDER ITEMS TITLE */}
        {orderData.Items && orderData.Items.length > 0 && (
          <>
            <Text className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 px-1">Items Ordered</Text>
            
            {/* ITEMS LIST AREA */}
            {orderData.Items.map((item, index) => (
              <View key={item.ID || index.toString()} className="bg-white rounded-2xl p-4 mb-3 border border-slate-100" style={cardShadow}>
                <Text className="text-slate-900 text-sm font-semibold" numberOfLines={2}>{item.ProductName}</Text>
                <Text className="text-[11px] text-slate-400 font-mono mt-0.5">{item.ProductID}</Text>
                
                <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-slate-50">
                  <View className="flex-row gap-4">
                    <View>
                      <Text className="text-slate-400 text-[10px] uppercase">Qty</Text>
                      <Text className="text-slate-700 text-xs font-medium mt-0.5">x{item.Qty}</Text>
                    </View>
                    <View>
                      <Text className="text-slate-400 text-[10px] uppercase">Unit Price</Text>
                      <Text className="text-slate-700 text-xs font-medium mt-0.5">₦{item.Rate?.toLocaleString()}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-slate-400 text-[10px] uppercase">Subtotal</Text>
                    <Text className="text-slate-900 text-sm font-bold mt-0.5">₦{item.Amount?.toLocaleString()}</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {/* REVENUE BREAKDOWN SUMMARY */}
        <View className="bg-white rounded-2xl p-4 mt-2 border border-slate-100" style={cardShadow}>
          <View className="flex-row justify-between items-center mb-2.5">
            <Text className="text-slate-500 text-xs">Subtotal</Text>
            <Text className="text-slate-800 text-xs font-medium">₦{orderData.Total?.toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between items-center pb-3 border-b border-slate-100">
            <Text className="text-slate-500 text-xs">Amount Paid</Text>
            <Text className="text-emerald-600 text-xs font-medium">₦{orderData.AmountPaid?.toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between items-center pt-3">
            <Text className="text-slate-900 text-sm font-bold">Balance Due</Text>
            <Text className="text-slate-900 text-base font-black">
              ₦{((orderData.Total || 0) - (orderData.AmountPaid || 0)).toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* FLOATING ACTION SHEET FOOTER */}
      {canCancel && (
        <View style={{ paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 16 }} className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-slate-100 px-4 pt-3 pb-6 flex-row items-center justify-center">
          <TouchableOpacity 
            onPress={handleCancelOrder}
            disabled={isCancelling}
            className="w-full bg-rose-50 border border-rose-100 h-12 rounded-xl items-center justify-center active:opacity-80"
          >
            {isCancelling ? (
              <ActivityIndicator size="small" color="#e11d48" />
            ) : (
              <Text className="text-rose-600 text-sm font-semibold tracking-wide">Cancel This Order</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}