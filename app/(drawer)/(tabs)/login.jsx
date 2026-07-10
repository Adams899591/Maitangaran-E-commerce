import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  TextInput, 
  TouchableOpacity, 
  Dimensions,
  KeyboardAvoidingView,
  Platform, 
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../context/UserContext';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Design tip: Keep message states clean
  const [errorMessage, setErrorMessage] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); 

  const isFormValid = username.trim() !== '' && password.trim() !== '' && !isLoading;

  // console.log(JSON.stringify( user, null, 2));
  // handle login form 
  const handleLogin = async () => {
    if (!isFormValid) return;
    
    // Clear any existing banners when a new attempt starts
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
        username: username,
        password: password,
      });

      const data = response.data;
      console.log(JSON.stringify(data, null, 2));


      
      if (data.Success === true) {
        setSuccessMessage("Login successful! Redirecting...");
        await AsyncStorage.setItem('user', JSON.stringify(data.Data));
        setUser(data.Data);
        
        
        // Optional delay to let them see the pretty success banner
        setTimeout(() => {
          setUsername("");
          setPassword("");
          setSuccessMessage("");
          setErrorMessage("");
          router.push("/(drawer)/dashboard");
        }, 3000);
      } else {
        setErrorMessage(data.Message || "Invalid username or password");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong. Please check your network connectivity.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/*  
        PROFESSIONAL TOP BANNER PLACEMENT 
        Placed completely outside the main scrolling wrapper so it expands flawlessly edge-to-edge
      */}
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
          <View className="flex-1 p-6 justify-start">
            
            {/* INPUT FIELDS CONTAINER */}
            <View className="mt-8">
              <Text className="text-3xl font-black tracking-tighter text-black mb-1">Welcome Back</Text>
              <Text className="text-xs text-gray-400 font-medium mb-8">Enter your credentials to access your account.</Text>

              {/* Username Input Field */}
              <View className="mb-5">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-2">Username</Text>
                <View className="flex-row items-center bg-gray-50 px-4 py-3.5 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="user" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="Enter your username"
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

              {/* Password Input Field */}
              <View className="mb-4">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-2">Password</Text>
                <View className="flex-row items-center bg-gray-50 px-4 py-3.5 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="lock" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secureTextEntry}
                    editable={!isLoading}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="flex-1 text-black text-sm ml-3 font-normal"
                  />
                  <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)} disabled={isLoading}>
                    <Feather name={secureTextEntry ? 'eye-off' : 'eye'} size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password Link */}
              <TouchableOpacity className="self-end mb-8" disabled={isLoading}>
                <Text className="text-xs font-bold text-gray-500">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* ACTION CONTAINER */}
            <View className="mt-2">
              <TouchableOpacity 
                onPress={handleLogin}
                disabled={!isFormValid}
                className={`w-full py-4 rounded-xl flex-row justify-center items-center ${
                  isFormValid ? 'bg-black active:opacity-90' : isLoading ? 'bg-black' : 'bg-gray-200'
                }`}
              >
                {isLoading ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color="#FFFFFF" className="mr-2" />
                    <Text className="text-xs font-black tracking-widest uppercase text-white">Please wait...</Text>
                  </View>
                ) : (
                  <Text 
                    className={`text-xs font-black tracking-widest uppercase ${
                      isFormValid ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-row justify-center items-center mt-5">
                <Text className="text-xs text-gray-400 font-medium">Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/signup')} disabled={isLoading}>
                  <Text className="text-xs font-black text-black">Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}