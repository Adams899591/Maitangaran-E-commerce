// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { Feather, Ionicons } from '@expo/vector-icons';
// import { useNavigation } from 'expo-router';

// // This can be fetched from a global state/context later
// const COMPANY_DATA = {
//   name: 'Maitangaran',
//   deliveryText: 'Deliver to John • Lagos',
// };

// export default function CustomHeader() {
//   const navigation = useNavigation();

//   return (
//     <View className="px-4 pt-2 pb-3 flex-row justify-between items-center bg-black border-b border-zinc-900">
//       <View className="flex-row items-center">
//         <TouchableOpacity onPress={() => navigation.toggleDrawer()} className="p-2 -ml-2 mr-2">
//           <Feather name="menu" size={24} color="white" />
//         </TouchableOpacity>
//         <View>
//           <Text className="text-2xl font-black tracking-tighter text-white">{COMPANY_DATA.name}</Text>
//           <View className="flex-row items-center mt-0.5">
//             <Ionicons name="location-outline" size={12} color="#9CA3AF" />
//             <Text className="text-xs text-gray-400 ml-1">{COMPANY_DATA.deliveryText}</Text>
//           </View>
//         </View>
//       </View>
//       <View className="flex-row items-center space-x-4">
//         <TouchableOpacity className="p-2">
//           <Feather name="bell" size={22} color="white" />
//         </TouchableOpacity>

//         {/* Cart Icon with Glowing Red Badge */}
//         <TouchableOpacity className="p-2 relative">
//           <Feather name="shopping-bag" size={22} color="white" />
//           <View className="absolute top-1 right-1 bg-red-500 w-4 h-4 rounded-full items-center justify-center shadow-lg shadow-red-500/60 border border-black">
//             <Text className="text-white text-[9px] font-bold">2</Text>
//           </View>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }




import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native'; // Added this import

const COMPANY_DATA = {
  name: 'Maitangaran',
  deliveryText: 'Deliver to John • Lagos',
};

export default function CustomHeader() {
  const navigation = useNavigation();

  const handleMenuPress = () => {
    // This safely dispatches a toggle action to the closest parent drawer layout
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <View className="px-4 pt-2 pb-3 flex-row justify-between items-center bg-black border-b border-zinc-900">
      <View className="flex-row items-center">
        {/* Updated onPress here */}
        <TouchableOpacity onPress={handleMenuPress} className="p-2 -ml-2 mr-2">
          <Feather name="menu" size={24} color="white" />
        </TouchableOpacity>
        <View>
          <Text className="text-2xl font-black tracking-tighter text-white">{COMPANY_DATA.name}</Text>
          <View className="flex-row items-center mt-0.5">
            <Ionicons name="location-outline" size={12} color="#9CA3AF" />
            <Text className="text-xs text-gray-400 ml-1">{COMPANY_DATA.deliveryText}</Text>
          </View>
        </View>
      </View>
      <View className="flex-row items-center space-x-4">
        <TouchableOpacity className="p-2">
          <Feather name="bell" size={22} color="white" />
        </TouchableOpacity>

        {/* Cart Icon with Glowing Red Badge */}
        <TouchableOpacity className="p-2 relative">
          <Feather name="shopping-bag" size={22} color="white" />
          <View className="absolute top-1 right-1 bg-red-500 w-4 h-4 rounded-full items-center justify-center shadow-lg shadow-red-500/60 border border-black">
            <Text className="text-white text-[9px] font-bold">2</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}