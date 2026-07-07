import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OrdersTableScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [orders, setOrders] = useState([
    { invoiceID: "invoiceId001", date: "2026-05-19T04:47:47", total: 90000.0, address: "42 Marina Road, Lagos", status: 1, paid: 0 },
    { invoiceID: "invoiceId002", date: "2026-05-20T10:14:22", total: 150000.0, address: "42 Marina Road, Lagos", status: 2, paid: 1 },
    { invoiceID: "invoiceId003", date: "2026-05-21T11:05:00", total: 45000.0, address: "Suite 19, Nürnberger Plaza, Abuja", status: 0, paid: 0 },
    { invoiceID: "invoiceId004", date: "2026-05-22T14:30:15", total: 210000.0, address: "4 Fagge Ta Kudu, Kano", status: 2, paid: 1 },
    { invoiceID: "invoiceId005", date: "2026-05-23T09:12:40", total: 135000.0, address: "42 Marina Road, Lagos", status: 1, paid: 0 }
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const parseStatus = (status) => {
    if (status === 0) return 'Cancelled';
    if (status === 2) return 'Processing';
    return 'Active';
  };

  const formatDate = (dateStr) => {
    return dateStr.split('T')[0];
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View className="px-6 mt-6 mb-6">
        <Text className="text-2xl font-black tracking-tight text-black">Order Ledger</Text>
        <Text className="text-xs text-gray-400">Scroll horizontally to view details and check invoice parameters.</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="small" color="#000000" />
        </View>
      ) : (
        <ScrollView 
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#000000" />
          }
        >
          {orders.length === 0 ? (
            /* EMPTY STATE FEEDBACK */
            <View className="flex-1 items-center justify-center py-20 px-6">
              <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />
              <Text className="text-black text-base font-bold mt-4 tracking-tight">No Orders Found</Text>
              <Text className="text-gray-400 text-xs text-center mt-1 max-w-[260px]">
                Your ledger is currently empty. Any new invoices or placement balances will show up right here.
              </Text>
            </View>
          ) : (
            /* TABLE VIEW */
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={true} 
              className="pl-6"
              contentContainerStyle={{ paddingRight: 24 }}
            >
              <View className="border border-gray-100 rounded-lg overflow-hidden mb-10">
                
                {/* TABLE HEADER - Increased heights and column widths */}
                <View className="flex-row bg-black py-4 px-5 items-center">
                  <Text className="text-white text-xs font-bold w-32">Invoice ID</Text>
                  <Text className="text-white text-xs font-bold w-28">Date</Text>
                  <Text className="text-white text-xs font-bold w-28">Total</Text>
                  <Text className="text-white text-xs font-bold w-24">Payment</Text>
                  <Text className="text-white text-xs font-bold w-28">Status</Text>
                  <Text className="text-white text-xs font-bold w-56">Delivery Address</Text>
                  <Text className="text-white text-xs font-bold w-20 text-center">Action</Text>
                </View>

                {/* TABLE BODY ROWS */}
                {orders.map((item) => (
                  <View 
                    key={item.invoiceID}
                    className="flex-row border-b border-gray-100 bg-gray-50/50 py-4 px-5 items-center"
                  >
                    <Text className="text-black text-xs font-mono font-bold w-32">{item.invoiceID}</Text>
                    <Text className="text-gray-600 text-xs w-28">{formatDate(item.date)}</Text>
                    <Text className="text-black text-xs font-bold w-28">₦{item.total.toLocaleString()}</Text>
                    
                    <Text className={`text-xs font-bold w-24 ${item.paid === 1 ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {item.paid === 1 ? 'Paid' : 'Unpaid'}
                    </Text>
                    
                    <Text className={`text-xs font-bold w-28 ${item.status === 0 ? 'text-red-500' : item.status === 2 ? 'text-blue-500' : 'text-amber-500'}`}>
                      {parseStatus(item.status)}
                    </Text>

                    <Text className="text-gray-500 text-xs w-56" numberOfLines={1} ellipsizeMode='tail'>
                      {item.address}
                    </Text>

                    {/* ACTION COLUMN BUTTON */}
                    <View className="w-20 items-center justify-center">
                      <TouchableOpacity 
                        // onPress={() => router.push(`/orders/${item.invoiceID}`)}
                        onPress={() => router.push(`/order-details`)}
                        className="bg-black px-3 py-2 rounded-md flex-row items-center justify-center active:opacity-80"
                      >
                        <Text className="text-white text-[10px] font-black tracking-wider uppercase mr-1">View</Text>
                        <Ionicons name="eye-outline" size={12} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

              </View>
            </ScrollView>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}