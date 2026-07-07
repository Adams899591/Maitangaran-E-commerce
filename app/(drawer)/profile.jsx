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

export default function ProfileScreen() {
  // Local state initialized with your exact API schema fields
  const [customerName, setCustomerName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane.doe@example.com');
  const [phone, setPhone] = useState('+2348012345678');
  const [address, setAddress] = useState('42 Marina Road, Lagos');
  const [address2, setAddress2] = useState('Suite 12B');
  const [prefferedAddress, setPrefferedAddress] = useState('42 Marina Road');
  const [prefferedState, setPrefferedState] = useState('Lagos');
  
  const [isLoading, setIsLoading] = useState(false);

  // Validation Logic: Stays disabled if key tracking or contact fields are blank
  const isFormValid = 
    customerName.trim() !== '' &&
    email.trim() !== '' &&
    phone.trim() !== '' &&
    address.trim() !== '' &&
    !isLoading;

  const handleUpdateProfile = () => {
    if (!isFormValid) return;
    
    setIsLoading(true);
    
    // Simulating API registration profile payload save
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Profile information updated successfully!");
      console.log('Profile Save Success', { 
        customerName, email, phone, address, address2, prefferedAddress, prefferedState 
      });
    }, 2000);
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
    </SafeAreaView>
  );
}