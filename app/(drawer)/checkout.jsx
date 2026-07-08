import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';

// Provided template guideline data schema
const SHIPPING_DATA = {
  success: true, 
  message: "Shipping info retrieved",
  data: {
    id: 1, 
    customerID: "customerId001",
    nameOfUser: "Jane Doe", 
    address: "42 Marina Road, Lagos",
    phoneNo: "+2348012345678", 
    stateOfResidence: "Lagos",
    emailAddress: "jane.doe@example.com", 
    status: 1,
    total: 90000.0 
  }
};

export default function CheckoutScreen() {
  const router = useRouter();
  const checkout = SHIPPING_DATA.data;
  
  // Controlled form input states matching the model fields
  const [nameOfUser, setNameOfUser] = useState(checkout.nameOfUser);
  const [address, setAddress] = useState(checkout.address);
  const [phoneNo, setPhoneNo] = useState(checkout.phoneNo);
  const [stateOfResidence, setStateOfResidence] = useState(checkout.stateOfResidence);
  const [emailAddress, setEmailAddress] = useState(checkout.emailAddress);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);

  // Button remains disabled until all text input required fields are present
  const isFormValid = 
    nameOfUser.trim() !== '' &&
    address.trim() !== '' &&
    phoneNo.trim() !== '' &&
    stateOfResidence.trim() !== '' &&
    emailAddress.trim() !== '' &&
    !isLoading &&
    !isUpdatingDetails;

  // Handler for saving/updating shipping information
  const handleUpdateShippingDetails = () => {
    if (!isFormValid) return;

    setIsUpdatingDetails(true);
    
    // Simulating an API PUT/POST patch request for address update
    setTimeout(() => {
      setIsUpdatingDetails(false);
      Alert.alert("Success", "Shipping details have been updated locally.");
      console.log('Shipping Info Updated', { nameOfUser, address, phoneNo, stateOfResidence, emailAddress });
    }, 1500);
  };

  const handlePlaceOrder = () => {
    if (!isFormValid) return;
    
    setIsLoading(true);
    
    // Simulating endpoint order creation request payload
    setTimeout(() => {
      setIsLoading(false);
      console.log('Order Processed Successfully', { 
        customerID: checkout.customerID,
        nameOfUser,
        address, 
        phoneNo,
        stateOfResidence,
        emailAddress,
        total: checkout.total
      });
      // Example: router.push('/success');
    }, 2500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'start' }}
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

            {/* HIGH CONTRAST TOTAL AMOUNT HIGHLIGHT CARD */}
            <View className="bg-black rounded-2xl p-5 mb-6 flex-row justify-between items-center">
              <View>
                <Text className="text-gray-400 text-[10px] font-black uppercase tracking-wider">Total Amount Due</Text>
                <Text className="text-white text-2xl font-black mt-0.5">₦{checkout.total.toLocaleString()}</Text>
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
              <View className="mb-6">
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
            </View>

            {/* DOCK ACTION RUN BUTTON AREA */}
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
    </SafeAreaView>
  );
}