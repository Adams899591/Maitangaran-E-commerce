import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StatusBar, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform, 
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  ScrollView // Imported correctly from react-native
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); 
    
  const { user } = useContext(UserContext);
  const token = user?.Token; 
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [secureOldText, setSecureOldText] = useState(true);
  const [secureNewText, setSecureNewText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); 

  const isFormValid = 
    oldPassword.trim() !== '' && 
    newPassword.trim() !== '' && 
    confirmPassword.trim() !== '' &&
    !isLoading;

  const handleChangePassword = async () => {
    if (!isFormValid) return;
    
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/auth/change-password`, {
        oldPassword: oldPassword,
        newPassword: newPassword,
      },{
          headers: {
              Authorization: `Bearer ${token}` 
          }
      });

      const data = response.data;

      if (data.success === true || data.Success === true) {
        setSuccessMessage(data.message || "Password changed successfully!");
        
        setTimeout(() => {
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setSuccessMessage("");
          setErrorMessage("");
          router.back();
        }, 2500);
      } else {
        setErrorMessage(data.message || "Failed to change password. Please verify your current password.");
      }
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.message || "Something went wrong. Please check your network connectivity.";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-white"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          
          {/* EDGE-TO-EDGE ERROR BANNER */}
          {errorMessage ? (
            <View style={{ paddingTop: insets.top + 12 }} className="bg-red-50 border-b border-red-100 px-6 pb-3.5 flex-row items-center space-x-3">
              <Ionicons name="alert-circle" size={20} color="#dc2626" />
              <Text className="text-red-700 font-medium text-sm flex-1 leading-4">
                {errorMessage}
              </Text>
              <TouchableOpacity onPress={() => setErrorMessage("")}>
                <Feather name="x" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          ) : null}

          {/* EDGE-TO-EDGE SUCCESS BANNER */}
          {successMessage ? (
            <View style={{ paddingTop: insets.top + 12 }} className="bg-emerald-50 border-b border-emerald-100 px-6 pb-3.5 flex-row items-center space-x-3">
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
              <Text className="text-emerald-700 font-medium text-sm flex-1 leading-4">
                {successMessage}
              </Text>
              <TouchableOpacity onPress={() => setSuccessMessage("")}>
                <Feather name="x" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          ) : null}

          {/* SCROLLABLE INTERFACE */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingTop: errorMessage || successMessage ? 12 : insets.top + 24,
              paddingBottom: insets.bottom + 24,
              paddingHorizontal: 24,
              flexGrow: 1
            }}
          >
            {/* INPUT FIELDS CONTAINER */}
            <View className="mt-4">
              <Text className="text-3xl font-black tracking-tighter text-black mb-1">Update Password</Text>
              <Text className="text-xs text-gray-400 font-medium mb-8">Ensure your account stays secure by using a strong password.</Text>

              {/* Current Password Input */}
              <View className="mb-5">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-2">Current Password</Text>
                <View className="flex-row items-center bg-gray-50 px-4 py-3.5 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="lock" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="Enter current password"
                    placeholderTextColor="#9CA3AF"
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    secureTextEntry={secureOldText}
                    editable={!isLoading}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="flex-1 text-black text-sm ml-3 font-normal"
                  />
                  <TouchableOpacity onPress={() => setSecureOldText(!secureOldText)} disabled={isLoading}>
                    <Feather name={secureOldText ? 'eye-off' : 'eye'} size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* New Password Input */}
              <View className="mb-5">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-2">New Password</Text>
                <View className="flex-row items-center bg-gray-50 px-4 py-3.5 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="shield" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="Enter new password"
                    placeholderTextColor="#9CA3AF"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={secureNewText}
                    editable={!isLoading}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="flex-1 text-black text-sm ml-3 font-normal"
                  />
                  <TouchableOpacity onPress={() => setSecureNewText(!secureNewText)} disabled={isLoading}>
                    <Feather name={secureNewText ? 'eye-off' : 'eye'} size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm New Password Input */}
              <View className="mb-8">
                <Text className="text-xs font-black tracking-wider text-gray-400 uppercase mb-2">Confirm New Password</Text>
                <View className="flex-row items-center bg-gray-50 px-4 py-3.5 rounded-xl border border-gray-100 focus:border-black">
                  <Feather name="shield" size={16} color="#6B7280" />
                  <TextInput
                    placeholder="Repeat new password"
                    placeholderTextColor="#9CA3AF"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={secureConfirmText}
                    editable={!isLoading}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="flex-1 text-black text-sm ml-3 font-normal"
                  />
                  <TouchableOpacity onPress={() => setSecureConfirmText(!secureConfirmText)} disabled={isLoading}>
                    <Feather name={secureConfirmText ? 'eye-off' : 'eye'} size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* ACTION CONTAINER */}
            <View className="mt-auto pb-4">
              <TouchableOpacity 
                onPress={handleChangePassword}
                disabled={!isFormValid}
                className={`w-full py-4 rounded-xl flex-row justify-center items-center ${
                  isFormValid ? 'bg-black active:opacity-90' : isLoading ? 'bg-black' : 'bg-gray-200'
                }`}
              >
                {isLoading ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color="#FFFFFF" className="mr-2" />
                    <Text className="text-xs font-black tracking-widest uppercase text-white">Updating...</Text>
                  </View>
                ) : (
                  <Text className={`text-xs font-black tracking-widest uppercase ${isFormValid ? 'text-white' : 'text-gray-400'}`}>
                    Save Changes
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-row justify-center items-center mt-5">
                <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
                  <Text className="text-xs font-black text-gray-400 hover:text-black">Cancel and Go Back</Text>
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}