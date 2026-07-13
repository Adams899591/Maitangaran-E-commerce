import React, { useState, useContext, useCallback, useEffect } from 'react';
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
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

export default function OrderDetailsScreen() {
  // Get user info from context
  const { user } = useContext(UserContext);
  const insets = useSafeAreaInsets();
  const token = user?.Token; 
  const { InvoiceID } = useLocalSearchParams();  // Get order ID from route params
  const router = useRouter();
  
  // State for managing UI loading states and order data
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [orderData, setOrderData] = useState(null);


  // Fetch order details from API
  // showSilentLoader: if true, don't show full-screen loading spinner (for refreshes)
  const fetchOrderDetails = async (showSilentLoader = false) => {
    if (!InvoiceID) return;
    try {
      // Only show loading spinner on first load
      if (!showSilentLoader) setIsLoading(true);
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

  // Automatically fetches data whenever the user enters or focuses this page
  useFocusEffect(
    useCallback(() => {
      fetchOrderDetails(orderData !== null); // Skip spinner if we already have data
    }, [InvoiceID, token])
  );

  // Get order status badge styling based on status code
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

  // Format date to readable format (e.g., "13 Jul 2026")
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Handle payment button click - opens payment gateway
  const handlePayNow = async () => {
    if (!InvoiceID) return;
    
    try {
      setIsInitializingPayment(true);

      // Create deep link to redirect back to app after payment
      const redirectUrl = Linking.createURL('/orders', { scheme: 'myreactnativeapp' });
      
      // Request payment initialization from API
      const response = await axios.post( `${process.env.EXPO_PUBLIC_API_URL}/payment/initialize`,{
          invoiceID: InvoiceID,
          successUrl: redirectUrl, 
          failureUrl: redirectUrl
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.Success) {
        const paymentInfo = response.data.Data ;
        const authUrl = paymentInfo?.AuthorizationUrl;

        if (authUrl) {
          // Open payment page in browser
          await WebBrowser.openBrowserAsync(authUrl);
          
          // Browser closed, refresh order data with latest payment status
          fetchOrderDetails(true);
        } else {
          Alert.alert("Error", "Authorization URL was not found.");
        }
      } else {
        Alert.alert("Error", response.data.Message || "Could not initialize payment.");
      }
    } catch (error) {
      console.log("Error initializing payment:", error);
      Alert.alert("Error", "Failed to start checkout process.");
    } finally {
      setIsInitializingPayment(false);
    }
  };

  // Handle cancel order request
  const handleCancelOrder = () => {
    if (!orderData) return;
    
    // Check if order can be cancelled
    if (orderData.Status === 0) return Alert.alert("Order Cancelled", "This order is already cancelled.");
    if (orderData.AmountPaid >= orderData.Total) return Alert.alert("Action Denied", "Paid orders cannot be cancelled.");
    if (orderData.Status === 2) return Alert.alert("Action Denied", "Orders already processing cannot be cancelled.");

    // Show confirmation dialog
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
              // Send cancel request to API
              const response = await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/orders/${InvoiceID}/cancel`,
                {}, 
                {
                  headers: {
                    Authorization: `Bearer ${token}` 
                  }
                }
              );
              console.log(response);
              
                  
              if (response.data && response.data.Success) {
                // Update local state and show success
                setOrderData(prev => ({ ...prev, Status: 0 }));
                      Alert.alert(
                        "Success", 
                        response.data.Message || "Order has been cancelled.",
                        [
                          {
                            text: "OK",
                            onPress: () => router.push("/orders") // Go back to orders list
                          }
                        ]
                      );
              }
            } catch (error) {
              console.log("Error cancelling order:", error);
              // Show error based on response status
              if (error.response) {
                const status = error.response.status;
                if (status === 400) {
                  Alert.alert("Action Denied", "This order cannot be cancelled.");
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

  // Platform-specific shadow styling
  const cardShadow = {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 12 },
      android: { elevation: 2 }
    })
  };

  // Show loading spinner while fetching
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="small" color="#0f172a" />
      </SafeAreaView>
    );
  }

  // Show error if order not found
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

  // Determine order and payment status for UI
  const statusConfig = getStatusConfig(orderData.Status);
  
  // Determine payment badge status
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

  // Determine which action buttons to show
  const isCancelled = orderData.Status === 0;
  const isProcessing = orderData.Status === 2;
  const isFullyPaid = paymentStatus === 'Paid';

  const canPay = !isCancelled && !isFullyPaid && !isProcessing;
  const canCancel = isCancelled === false && isFullyPaid === false && isProcessing === false && paymentStatus === 'Unpaid';
  const showFooterActionSheet = canPay || canCancel;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* HEADER - Back button and invoice ID */}
      <View className="px-4 py-3 bg-white border-b border-slate-100 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.push("/orders")} className="p-1 -ml-1 flex-row items-center">
          <Ionicons name="chevron-back" size={24} color="#0f172a" />
          <Text className="text-slate-900 font-medium ml-1">Order Details</Text>
        </TouchableOpacity>
        <Text className="text-[10px] font-medium text-slate-400 font-mono w-40 text-right" numberOfLines={1} ellipsizeMode="tail">
          {orderData.InvoiceID}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: showFooterActionSheet ? 240 : 200 }}>
        
        {/* HERO CARD - Shows total amount, date, and status badges */}
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

        {/* DELIVERY & NOTES - Shipping address and customer notes */}
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

        {/* ORDER ITEMS - List of products in this order */}
        {orderData.Items && orderData.Items.length > 0 && (
          <>
            <Text className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 px-1">Items Ordered</Text>
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

        {/* PRICE BREAKDOWN - Total, amount paid, and balance due */}
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

      {/* ACTION BUTTONS - Pay Now and Cancel Order (shown based on order status) */}
      {showFooterActionSheet && (
        <View 
          style={{ paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 12 }} 
          className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-slate-100 px-4 pt-4 pb-4 flex-col gap-2"
        >
          {/* Pay Now Button - Opens payment gateway */}
          {canPay && (
            <TouchableOpacity 
              onPress={handlePayNow}
              disabled={isCancelling || isInitializingPayment}
              className="w-full bg-slate-900 h-12 rounded-xl items-center justify-center active:opacity-90 flex-row"
            >
              {isInitializingPayment ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Ionicons name="card-outline" size={18} color="#ffffff" />
                  <Text className="text-white text-sm font-semibold tracking-wide ml-2">Pay Now</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Cancel Button - Cancels unpaid orders */}
          {canCancel && (
            <TouchableOpacity 
              onPress={handleCancelOrder}
              disabled={isCancelling || isInitializingPayment}
              className="w-full bg-rose-50 border border-rose-100 h-12 rounded-xl items-center justify-center active:opacity-80"
            >
              {isCancelling ? (
                <ActivityIndicator size="small" color="#e11d48" />
              ) : (
                <Text className="text-rose-600 text-sm font-semibold tracking-wide">Cancel Order</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}   