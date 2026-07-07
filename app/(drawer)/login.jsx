import React, { useState } from 'react';
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
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Validation Engine: Button stays disabled until fields have text and isn't loading
  const isFormValid = username.trim() !== '' && password.trim() !== '' && !isLoading;

  const handleLogin = () => {
    if (!isFormValid) return;
    
    setIsLoading(true);
    
    // Simulating authentication network request payload
    setTimeout(() => {
      setIsLoading(false);
      console.log('Authentication complete', { username, password });
    }, 2500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Dark status bar configuration matching a clean layout context */}
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 p-6 justify-start">
            
            {/* INPUT FIELDS CONTAINER */}
            <View className="mt-12">
              {/* Repositioned Welcome Text Content */}
              <Text className="text-3xl font-black tracking-tighter text-black mb-1">Welcome Back</Text>
              <Text className="text-xs text-gray-400 font-medium mb-8">Enter your credentials to access your account.</Text>

              {/* Username Input Field */}
              <View className="mb-5">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-2">Username</Text>
                <View className="flex-row items-center bg-gray-100 px-4 py-3.5 rounded-xl border border-gray-100 focus:border-black">
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
                <View className="flex-row items-center bg-gray-100 px-4 py-3.5 rounded-xl border border-gray-100 focus:border-black">
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

            {/* ACTION CONTAINER (Moved upward directly underneath fields) */}
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
                <TouchableOpacity disabled={isLoading}>
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