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
  ActivityIndicator
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function SignUpScreen() {
  const router = useRouter();
  
  // State variables mapping directly to backend API specifications
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Status banner notification control
  const [errorMessage, setErrorMessage] = useState(""); 
  const [successMessage, setSuccessMessage] = useState("");

  // Validation Engine: Verifies all backend API prerequisites are met
  const isFormValid = 
    fullName.trim() !== '' &&
    username.trim() !== '' &&
    email.trim() !== '' &&
    phone.trim() !== '' &&
    address.trim() !== '' &&
    password.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    password === confirmPassword &&
    !isLoading;



  // function to handle user sign up
  const handleSignUp = async () => {
    if (!isFormValid) return;
    
    // Clear notification fields before executing request
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/signup`, {
        customerName: fullName,
        email: email,
        phone: phone,
        username: username,
        password: password,
        address: address
      });

      const data = response.data;

      // Check success state structural format matches your login response logic
      if (data.Success === true || data.customerName || response.status === 200 || response.status === 201) {
        setSuccessMessage("Account created successfully! Redirecting...");
        
        setTimeout(() => {
          // empty all input fields
          setFullName("");
          setEmail("");
          setPhone("");
          setAddress("");
          setUsername("");
          setPassword("");
          setConfirmPassword("")
          setSuccessMessage("");
          setErrorMessage("");
          router.replace('/login');
        }, 2000);
      } else {
        setErrorMessage(data.Message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.log("Signup error trace:", error);
      const serverMessage = error.response?.data?.Message || error.response?.data?.message;
      setErrorMessage(serverMessage || "Something went wrong. Please verify your data connectivity.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* EDGE-TO-EDGE PROFESSIONAL NOTIFICATION BANNERS */}
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
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'start' }}
          >
            
            {/* INTRO TEXT */}
            <View className="mt-4 mb-6">
              <Text className="text-3xl font-black tracking-tighter text-black mb-1">Create Account</Text>
              <Text className="text-xs text-gray-400 font-medium">Please fill in the fields below to get started.</Text>
            </View>

            {/* INPUT CONTAINERS */}
            <View>
              {/* Full Name */}
              <View className="mb-4">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-1.5">Full Name</Text>
                <View className="flex-row items-center bg-gray-50 px-4 py-3.5 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="user" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="John Doe"
                    placeholderTextColor="#9CA3AF"
                    value={fullName}
                    onChangeText={setFullName}
                    editable={!isLoading}
                    className="flex-1 text-black text-sm ml-3 font-normal"
                  />
                </View>
              </View>

              {/* Username */}
              <View className="mb-4">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-1.5">Username</Text>
                <View className="flex-row items-center bg-gray-50 px-4 py-3.5 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="at-sign" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="johndoe"
                    placeholderTextColor="#9CA3AF"
                    value={username}
                    onChangeText={setUsername}
                    editable={!isLoading}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="flex-1 text-black text-sm ml-3 font-normal"
                  />
                </View>
              </View>

              {/* Email Address */}
              <View className="mb-4">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-1.5">Email Address</Text>
                <View className="flex-row items-center bg-gray-50 px-4 py-3.5 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="mail" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="john@example.com"
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

              {/* Phone Number Field */}
              <View className="mb-4">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-1.5">Phone Number</Text>
                <View className="flex-row items-center bg-gray-50 px-4 py-3.5 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="phone" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="+234 801 234 5678"
                    placeholderTextColor="#9CA3AF"
                    value={phone}
                    onChangeText={setPhone}
                    editable={!isLoading}
                    keyboardType="phone-pad"
                    className="flex-1 text-black text-sm ml-3 font-normal"
                  />
                </View>
              </View>

              {/* Physical Delivery Address */}
              <View className="mb-4">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-1.5">Delivery Address</Text>
                <View className="flex-row items-center bg-gray-50 px-4 py-3.5 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="map-pin" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="12 Awolowo Road, Lagos"
                    placeholderTextColor="#9CA3AF"
                    value={address}
                    onChangeText={setAddress}
                    editable={!isLoading}
                    className="flex-1 text-black text-sm ml-3 font-normal"
                  />
                </View>
              </View>

              {/* Password */}
              <View className="mb-4">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-1.5">Password</Text>
                <View className="flex-row items-center bg-gray-50 px-4 py-3.5 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="lock" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={securePassword}
                    editable={!isLoading}
                    autoCapitalize="none"
                    className="flex-1 text-black text-sm ml-3 font-normal"
                  />
                  <TouchableOpacity onPress={() => setSecurePassword(!securePassword)} disabled={isLoading}>
                    <Feather name={securePassword ? 'eye-off' : 'eye'} size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View className="mb-6">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-1.5">Confirm Password</Text>
                <View className="flex-row items-center bg-gray-50 px-4 py-3.5 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="shield" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={secureConfirm}
                    editable={!isLoading}
                    autoCapitalize="none"
                    className="flex-1 text-black text-sm ml-3 font-normal"
                  />
                  <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)} disabled={isLoading}>
                    <Feather name={secureConfirm ? 'eye-off' : 'eye'} size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                {password !== '' && confirmPassword !== '' && password !== confirmPassword && (
                  <Text className="text-[11px] text-red-500 font-bold mt-1.5 ml-1">Passwords do not match</Text>
                )}
              </View>
            </View>

            {/* ACTION CONTAINER */}
            <View className="mt-2">
              <TouchableOpacity 
                onPress={handleSignUp}
                disabled={!isFormValid}
                className={`w-full py-4 rounded-xl flex-row justify-center items-center ${
                  isFormValid ? 'bg-black active:opacity-90' : isLoading ? 'bg-black' : 'bg-gray-200'
                }`}
              >
                {isLoading ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color="#FFFFFF" className="mr-2" />
                    <Text className="text-xs font-black tracking-widest uppercase text-white">Creating Account...</Text>
                  </View>
                ) : (
                  <Text 
                    className={`text-xs font-black tracking-widest uppercase ${
                      isFormValid ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    Sign Up
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-row justify-center items-center mt-5 mb-8">
                <Text className="text-xs text-gray-400 font-medium">Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/login')} disabled={isLoading}>
                  <Text className="text-xs font-black text-black">Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}