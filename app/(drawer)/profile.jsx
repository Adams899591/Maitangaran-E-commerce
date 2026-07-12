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
import { Feather, Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function ProfileScreen() {
  const { user, setUser } = useContext(UserContext);
  const insets = useSafeAreaInsets(); 
 
  const userData = user?.Customer ?? user; // support both nested and flat user payloads




  // Local state initialized with your exact API schema fields
  const [customerName, setCustomerName] = useState(userData?.CustomerName);
  const [email, setEmail] = useState(userData?.Email);
  const [phone, setPhone] = useState(userData?.Phone);
  const [address, setAddress] = useState(userData?.Address);
  const [address2, setAddress2] = useState(userData?.Address2);
  const [prefferedAddress, setPrefferedAddress] = useState(userData?.PrefferedAddress);
  const [prefferedState, setPrefferedState] = useState(userData?.PrefferedState);
  const [token, setToken] = useState(user?.Token); // pass the user token here so that after firat update the token still stay

  useEffect(() => {
    if (userData) {
      setCustomerName(userData.CustomerName ?? '');
      setEmail(userData.Email ?? '');
      setPhone(userData.Phone ?? '');
      setAddress(userData.Address ?? '');
      setAddress2(userData.Address2 ?? '');
      setPrefferedAddress(userData.PrefferedAddress ?? '');
      setPrefferedState(userData.PrefferedState ?? '');
      setToken(user?.Token ?? '');
    } else if (!user) {
      setCustomerName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setAddress2('');
      setPrefferedAddress('');
      setPrefferedState('');
      setToken('');
    }
  }, [userData, user]);
  
  const [isLoading, setIsLoading] = useState(false);
  // Design tip: Keep message states clean
  const [errorMessage, setErrorMessage] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); 

  // Validation Logic: Stays disabled if key tracking or contact fields are blank
  const isFormValid = 
    customerName.trim() !== '' &&
    email.trim() !== '' &&
    phone.trim() !== '' &&
    address.trim() !== '' &&
    !isLoading;

  // Function to Update User Profile
  const handleUpdateProfile = async () => {
    if (!isFormValid) return;
    
  // Clear any existing banners when a new attempt starts
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/auth/profile/update`, {
          customerName: customerName,
          email: email,
          phone: phone,
          address: address, 
          address2: address2,
          prefferedAddress: prefferedAddress,
          prefferedState: prefferedState,
      },{
          headers: {
              // This tells the backend exactly who is making the request
              Authorization: `Bearer ${token}` 
          }
      });

      const data = response.data;
      // console.log(JSON.stringify(data, null, 2));


      if (data.Success === true) {
        setSuccessMessage("User details updated successfuly ");

        await AsyncStorage.setItem('user', JSON.stringify(data.Data));
        setUser(data.Data);
        
        
        // Optional delay to let them see the pretty success banner
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 3000);
      } else {
        setErrorMessage(data.Message || "Unable to update user details");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong. Please check your network connectivity.");
    } finally {
      setIsLoading(false);
    }
  };




  return (
     <>

      {errorMessage ? (
        <View className="bg-red-50 border-b border-red-100 px-6 py-3.5 flex-row items-center space-x-3">
          <Ionicons name="alert-circle" size={20} color="#dc2626" />
          <Text className="text-red-700 font-medium text-sm flex-1 leading-4">
            {errorMessage}
          </Text>
          <TouchableOpacity onPress={() => setErrorMessage("")}>
            <Feather name="x" size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      ) : null}

      {successMessage ? (
        <View className="bg-emerald-50 border-b border-emerald-100 px-6 py-3.5 flex-row items-center space-x-3">
          <Ionicons name="checkmark-circle" size={20} color="#059669" />
          <Text className="text-emerald-700 font-medium text-sm flex-1 leading-4">
            {successMessage}
          </Text>
          <TouchableOpacity onPress={() => setSuccessMessage("")}>
            <Feather name="x" size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      ) : null}

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'start' }}
          >
            
            {/* INTRO TEXT */}
            <View className="mt-6 mb-8">
              <Text className="text-3xl font-black tracking-tighter text-black mb-1">Account Profile</Text>
              <Text className="text-xs text-gray-400 font-medium">Keep your distribution and shipping coordinates up to date.</Text>
            </View>

            {/* INPUT CONTAINERS */}
            <View>
              {/* Full Name */}
              <View className="mb-4">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-1.5">Full Name</Text>
                <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="user" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="Full Name"
                    placeholderTextColor="#9CA3AF"
                    value={customerName}
                    onChangeText={setCustomerName}
                    editable={!isLoading}
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
                    placeholder="email@example.com"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    editable={!isLoading}
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
                    placeholder="Phone Number"
                    placeholderTextColor="#9CA3AF"
                    value={phone}
                    onChangeText={setPhone}
                    editable={!isLoading}
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
                    placeholder="Street Address"
                    placeholderTextColor="#9CA3AF"
                    value={address}
                    onChangeText={setAddress}
                    editable={!isLoading}
                    className="flex-1 text-black text-sm ml-3 font-normal"
                  />
                </View>
              </View>

              {/* Suite / Apartment */}
              <View className="mb-4">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-1.5">Suite / Apartment</Text>
                <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="layers" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="Suite, unit, apartment (optional)"
                    placeholderTextColor="#9CA3AF"
                    value={address2}
                    onChangeText={setAddress2}
                    editable={!isLoading}
                    className="flex-1 text-black text-sm ml-3 font-normal"
                  />
                </View>
              </View>

              {/* Preferred Hub / Address & State (Side by Side Row) */}
              <View className="flex-row space-x-3 mb-6">
                <View className="flex-1">
                  <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-1.5">Preferred Hub</Text>
                  <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl border border-gray-100 focus:border-black">
                    <TextInput
                      placeholder="Hub Location"
                      placeholderTextColor="#9CA3AF"
                      value={prefferedAddress}
                      onChangeText={setPrefferedAddress}
                      editable={!isLoading}
                      className="flex-1 text-black text-sm font-normal"
                    />
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-1.5">State</Text>
                  <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl border border-gray-100 focus:border-black">
                    <TextInput
                      placeholder="State"
                      placeholderTextColor="#9CA3AF"
                      value={prefferedState}
                      onChangeText={setPrefferedState}
                      editable={!isLoading}
                      className="flex-1 text-black text-sm font-normal"
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* ACTION CONTAINER */}
            <View className="mt-2 mb-8">
              <TouchableOpacity 
                onPress={handleUpdateProfile}
                disabled={!isFormValid}
                className={`w-full py-4 rounded-xl flex-row justify-center items-center ${
                  isFormValid ? 'bg-black active:opacity-90' : isLoading ? 'bg-black' : 'bg-gray-200'
                }`}
              >
                {isLoading ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color="#FFFFFF" className="mr-2" />
                    <Text className="text-xs font-black tracking-widest uppercase text-white">Saving Changes...</Text>
                  </View>
                ) : (
                  <Text 
                    className={`text-xs font-black tracking-widest uppercase ${
                      isFormValid ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    Save Changes
                  </Text>
                )}
              </TouchableOpacity>
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}


