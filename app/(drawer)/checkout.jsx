import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function CustomerShippingScreen() {
  const { user } = useContext(UserContext);
  const insets = useSafeAreaInsets(); 
  const token = user?.Token;
  const { tatalAmount } = useLocalSearchParams(); 
  const router = useRouter();

  // Controlled form input states matching API specs
  const [nameOfUser, setNameOfUser] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [stateOfResidence, setStateOfResidence] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [notes, setNotes] = useState(''); // Added notes state
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);

  // Form validation rule check
  const isFormValid = 
    nameOfUser.trim() !== '' &&
    address.trim() !== '' &&
    phoneNo.trim() !== '' &&
    stateOfResidence.trim() !== '' &&
    emailAddress.trim() !== '' && 
    !isLoading &&
    !isUpdatingDetails;

  // Fetch initial shipping details on mount
  useEffect(() => { 
    
    const handleFetchShipping = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/customer/shipping`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const res = response.data;

         console.log(JSON.stringify(res, null, 2));
         

        // Updated payload check to use backend casing conventions (Success / Data)
        if (res.Success && res.Data) {
          setNameOfUser(res.Data.NameOfUser || '');
          setAddress(res.Data.Address || '');
          setPhoneNo(res.Data.PhoneNo || '');
          setStateOfResidence(res.Data.StateOfResidence || '');
          setEmailAddress(res.Data.EmailAddress || '');
        }
      } catch (error) {
        console.log("Error fetching shipping data:", error);
      }
    };

    handleFetchShipping(); 
  }, [token]);
 

  // Handler for PUT request to save/update shipping info
  const handleUpdateShippingDetails = async () => {
    if (!isFormValid) return;

    setIsUpdatingDetails(true);
    try {
      const response = await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/customer/shipping`, {
          nameOfUser: nameOfUser,
          address: address,
          phoneNo: phoneNo,
          stateOfResidence: stateOfResidence,
          emailAddress: emailAddress,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // console.log(JSON.stringify(response, null, 2));

      // Fixed: Checked .Success and fallback to .Message matching your IIS/ASP.NET backend structure
      if (response.data.Success) {
        Alert.alert("Success", response.data.Message || "Shipping details saved successfully.");
      } else {
        Alert.alert("Error", response.data.Message || "Failed to update profile.");
      }
    } catch (error) {
      console.log("Error updating shipping details:", error);
      Alert.alert("Error", "An absolute connection error occurred. Try again later.");
    } finally {
      setIsUpdatingDetails(false);
    }
  };


  // Handler for POST request to complete Checkout and process payment order
  const handlePlaceOrder = async () => {
    if (!isFormValid) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/checkout`, {
          notes: notes.trim() !== '' ? notes : null
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log(JSON.stringify(response, null, 2));
      

      // Backend returns uppercase 'Success' structure matching IIS/ASP setups
      if (response.data.Success) {
        Alert.alert(
          "Checkout Successful", 
          response.data.Message || "Your order has been placed successfully!",
          [
            { 
              text: "OK", 
              onPress: () => router.push({
                pathname: '/success',
                params: { invoiceID: response.data.Data?.invoiceID || response.data.data?.invoiceID }
              }) 
            }
          ]
        );
      } else {
        Alert.alert("Checkout Failed", response.data.Message || response.data.message || "Failed to clear cart.");
      }
    } catch (error) {
      console.log("Checkout endpoint processing error:", error);
      Alert.alert("Checkout Error", "Could not complete transaction. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
      <>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, padding: 24 , paddingBottom: insets.bottom + 24 }}
          >
            
            {/* INTRO TEXT & BACK */}
            <View className="mt-6 mb-8 flex-row items-center justify-between">
              <View>
                <Text className="text-3xl font-black tracking-tighter text-black mb-1">Checkout</Text>
                <Text className="text-xs text-gray-400 font-medium">Please verify your shipping credentials.</Text>
              </View>
              <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-100 rounded-full">
                <Feather name="x" size={18} color="#000000" />
              </TouchableOpacity>
            </View>

            {/* TOTAL AMOUNT HIGHLIGHT CARD */}
            <View className="bg-black rounded-2xl p-5 mb-6 flex-row justify-between items-center">
              <View>
                <Text className="text-gray-400 text-[10px] font-black uppercase tracking-wider">Total Amount Due</Text>
                <Text className="text-white text-2xl font-black mt-0.5">
                  ₦{tatalAmount ? Number(tatalAmount).toLocaleString() : '0'}
                </Text>
              </View>
              <View className="bg-zinc-800 px-3 py-1.5 rounded-lg">
                <Text className="text-white text-[11px] font-bold uppercase tracking-wider">Secure Checkout</Text>
              </View>
            </View>

            {/* INPUT FIELD CONTAINER */}
            <View>
              {/* Full Name */}
              <View className="mb-4">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-1.5">Full Name</Text>
                <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="user" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="Jane Doe"
                    placeholderTextColor="#9CA3AF"
                    value={nameOfUser}
                    onChangeText={setNameOfUser}
                    editable={!isLoading && !isUpdatingDetails}
                    className="flex-1 text-black text-sm ml-3 font-normal"
                  />
                </View>
              </View>

              {/* Email Address */}
              <View className="mb-4">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-1.5">Email Address</Text>
                <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="mail" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="jane.doe@example.com"
                    placeholderTextColor="#9CA3AF"
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    editable={!isLoading && !isUpdatingDetails}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="flex-1 text-black text-sm ml-3 font-normal"
                  />
                </View>
              </View>

              {/* Phone Number */}
              <View className="mb-4">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-1.5">Phone Number</Text>
                <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="phone" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="+2348012345678"
                    placeholderTextColor="#9CA3AF"
                    value={phoneNo}
                    onChangeText={setPhoneNo}
                    editable={!isLoading && !isUpdatingDetails}
                    keyboardType="phone-pad"
                    className="flex-1 text-black text-sm ml-3 font-normal"
                  />
                </View>
              </View>

              {/* Delivery Address */}
              <View className="mb-4">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-1.5">Delivery Address</Text>
                <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="map-pin" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="42 Marina Road, Lagos"
                    placeholderTextColor="#9CA3AF"
                    value={address}
                    onChangeText={setAddress}
                    editable={!isLoading && !isUpdatingDetails}
                    className="flex-1 text-black text-sm ml-3 font-normal"
                  />
                </View>
              </View>

              {/* State of Residence */}
              <View className="mb-4">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-1.5">State of Residence</Text>
                <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="globe" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="Lagos"
                    placeholderTextColor="#9CA3AF"
                    value={stateOfResidence}
                    onChangeText={setStateOfResidence}
                    editable={!isLoading && !isUpdatingDetails}
                    className="flex-1 text-black text-sm ml-3 font-normal"
                  />
                </View>
              </View>

              {/* Order Notes (Added Input Field) */}
              <View className="mb-6">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-1.5">Order Notes (Optional)</Text>
                <View className="flex-row items-start bg-gray-100 px-4 py-3 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="file-text" size={16} color="#6B7280" style={{ marginTop: 2 }} />
                  <TextInput
                    placeholder="Any special instructions for delivery..."
                    placeholderTextColor="#9CA3AF"
                    value={notes}
                    onChangeText={setNotes}
                    editable={!isLoading && !isUpdatingDetails}
                    multiline={true}
                    numberOfLines={3}
                    className="flex-1 text-black text-sm ml-3 font-normal textAlignVertical-top"
                    style={{ minHeight: 60 }}
                  />
                </View>
              </View>
            </View>

            {/* BUTTON AREA */}
            <View className="mt-auto gap-3">
              
              {/* UPDATE SHIPPING DETAILS BUTTON */}
              <TouchableOpacity 
                onPress={handleUpdateShippingDetails}
                disabled={!isFormValid}
                className={`w-full py-3.5 rounded-xl border flex-row justify-center items-center ${
                  isFormValid ? 'border-black bg-white active:opacity-70' : 'border-gray-200 bg-white'
                }`}
              >
                {isUpdatingDetails ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color="#000000" className="mr-2" />
                    <Text className="text-xs font-black tracking-widest uppercase text-black">Updating details...</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center justify-center">
                    <Feather name="edit-3" size={14} color={isFormValid ? '#000000' : '#9CA3AF'} className="mr-2" />
                    <Text 
                      className={`text-xs font-black tracking-widest uppercase ${
                        isFormValid ? 'text-black' : 'text-gray-400'
                      }`}
                    >
                      Update Shipping Details
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* PLACE ORDER & PAY BUTTON */}
              <TouchableOpacity 
                onPress={handlePlaceOrder}
                disabled={!isFormValid}
                className={`w-full py-4 rounded-xl flex-row justify-center items-center ${
                  isFormValid ? 'bg-black active:opacity-90' : isLoading ? 'bg-black' : 'bg-gray-200'
                }`}
              >
                {isLoading ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color="#FFFFFF" className="mr-2" />
                    <Text className="text-xs font-black tracking-widest uppercase text-white">Processing Order...</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center justify-center">
                    <Feather name="credit-card" size={16} color={isFormValid ? '#FFFFFF' : '#9CA3AF'} className="mr-2" />
                    <Text 
                      className={`text-xs font-black tracking-widest uppercase ${
                        isFormValid ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      Place Order & Pay
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              
              <Text className="text-[10px] text-center text-gray-400 font-medium mt-1 mb-4 px-4">
                Secured payment processing via Paystack. Your financial details are safe and encrypted.
              </Text>
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      </>
  );
}   






