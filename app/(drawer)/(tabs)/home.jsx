// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   View, 
//   Text, 
//   ScrollView, 
//   FlatList, 
//   Image, 
//   TouchableOpacity, 
//   TextInput, 
//   Dimensions,
//   SafeAreaView,
//   StatusBar
// } from 'react-native';
// import { Feather, Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';

// const { width } = Dimensions.get('window');

// const BASE_BANNERS = [
//   { id: '1', title: 'SUMMER ESSENTIALS', subtitle: 'UP TO 50% OFF', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800' },
//   { id: '2', title: 'MINIMALIST LOOKBOOK', subtitle: 'NEW SEASON', image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800' },
//   { id: '3', title: 'PREMIUM TRADITIONAL', subtitle: 'THE LUXURY COLLECTION', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800' },
//   { id: '4', title: 'MODERN ACCESSORIES', subtitle: 'CHRONO & LEATHER GEAR', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800' }
// ];

// // Append a clone of the first item to the end for seamless looping
// const BANNERS_DATA = BASE_BANNERS.length > 0 ? [...BASE_BANNERS, { ...BASE_BANNERS[0], id: 'clone-1' }] : [];

// const CATEGORIES_DATA = [
//   { id: '1', name: 'Voile', icon: 'layers-outline' },
//   { id: '2', name: 'Shadda', icon: 'ribbon-outline' },
//   { id: '3', name: 'Lace', icon: 'sparkles-outline' },
//   { id: '4', name: 'Ankara', icon: 'color-palette-outline' },
//   { id: '5', name: 'Material', icon: 'cut-outline' },
//   { id: '6', name: 'Jakard', icon: 'grid-outline' },
// ];

// // Separate independent array for Category Item Showcases (Top product view)
// const CATEGORY_SHOWCASE_DATA = [
//   { id: 'cs1', name: 'Premium Voile Classic', previewPrice: '₦45,000', image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=400' },
//   { id: 'cs2', name: 'Luxury Shadda Segment', previewPrice: '₦65,000', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400' },
//   { id: 'cs3', name: 'Exclusive Royal Lace', previewPrice: '₦85,000', image: '' }, // Testing fallback placeholder here
// ];

// // Renamed from FEATURED_FABRICS_DATA to FEATURED_PRODUCT
// const FEATURED_PRODUCT = [
//   { id: 'ff1', name: 'Premium Ankara Print', image: 'https://images.unsplash.com/photo-1610116306796-6ebd30d77fa1?w=400' },
//   { id: 'ff2', name: 'Super Jakard Collection', image: 'https://images.unsplash.com/photo-1574169208507-84376144848b&w=400' },
//   { id: 'ff3', name: 'Classic Suit Material', image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=400' }
// ];

// const TRENDING_NOW = [
//   { id: 'f1', name: 'Classic Leather Derby', price: '₦120,000', oldPrice: '₦180,000', rating: 4.9, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500' },
//   { id: 'f2', name: 'Minimalist Chrono Watch', price: '₦195,000', rating: 4.8, image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500' },
//   { id: 'f3', name: 'Premium Leather Bomber', price: '₦299,000', rating: 5.0, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500' }
// ];

// const NEW_ARRIVALS_DATA = [
//   { id: 'n1', name: 'Heavyweight Oversized Tee', price: '₦45,000', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500' },
//   { id: 'n2', name: 'Tailored Linen Trousers', price: '₦85,000', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500' },
//   { id: 'n3', name: 'Canvas Everyday Tote', price: '₦35,000', oldPrice: '₦50,000', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500' },
//   { id: 'n4', name: 'Acetate Sunglasses', price: '₦65,000', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500' },
// ];

// // Centered Empty State helper that preserves layout height
// function EmptySectionState({ message, heightClass = "h-44" }) {
//   return (
//     <View style={{ width: width - 32 }} className={`mx-4 bg-gray-50 border border-gray-100 rounded-2xl items-center justify-center p-6 ${heightClass}`}>
//       <Ionicons name="information-circle-outline" size={26} color="#9CA3AF" />
//       <Text className="text-gray-400 text-xs font-medium mt-2 text-center tracking-tight max-w-[250px]">
//         {message}
//       </Text>
//     </View>
//   );
// }

// // Global Image Placeholder Component
// function ImagePlaceholder({ heightClass = "h-44" }) {
//   return (
//     <View className={`w-full ${heightClass} bg-gray-100 items-center justify-center`}>
//       <Ionicons name="image-outline" size={28} color="#9CA3AF" />
//       <Text className="text-gray-400 text-[10px] font-medium mt-1">No image uploaded</Text>
//     </View>
//   );
// }

// export default function HomeScreen() {
//   const router = useRouter();
//   const [searchText, setSearchText] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const flatListRef = useRef(null);

//   // Auto-scroll loop effect
//   useEffect(() => {
//     if (BANNERS_DATA.length <= 1) return;

//     const interval = setInterval(() => {
//       let nextIndex = activeIndex + 1;
      
//       flatListRef.current?.scrollToIndex({
//         index: nextIndex,
//         animated: true,
//       });
      
//       setActiveIndex(nextIndex);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [activeIndex]);

//   // Handle snapping back to start when sliding past the final clone card
//   const handleScroll = (event) => {
//     if (BANNERS_DATA.length <= 1) return;
//     const contentOffsetX = event.nativeEvent.contentOffset.x;
//     const currentIndex = contentOffsetX / (width - 32);
    
//     if (currentIndex >= BANNERS_DATA.length - 1) {
//       flatListRef.current?.scrollToIndex({
//         index: 0,
//         animated: false,
//       });
//       setActiveIndex(0);
//     }
//   };

//   const handleMomentumScrollEnd = (event) => {
//     if (BANNERS_DATA.length <= 1) return;
//     const contentOffsetX = event.nativeEvent.contentOffset.x;
//     const currentIndex = Math.round(contentOffsetX / (width - 32));
    
//     if (currentIndex >= 0 && currentIndex < BANNERS_DATA.length - 1) {
//       setActiveIndex(currentIndex);
//     }
//   };

//   // Helper clear action
//   const clearFilters = () => {
//     setSearchText('');
//     setSelectedCategory(null);
//   };

//   // Process item filter showcases reactively
//   const getFilteredShowcaseItems = () => {
//     return CATEGORY_SHOWCASE_DATA.filter(item => {
//       const matchText = searchText.trim().toLowerCase();
//       const matchCategory = selectedCategory ? selectedCategory.toLowerCase() : '';
//       const itemName = item.name.toLowerCase();

//       if (matchCategory && !itemName.includes(matchCategory)) return false;
//       if (matchText && !itemName.includes(matchText)) return false;
//       return true;
//     });
//   };

//   const filteredShowcaseData = getFilteredShowcaseItems();

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <StatusBar barStyle="light-content" backgroundColor="#000000" />

//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
//         {/* Sticky-Style Search Bar */}
//         <View className="p-4 bg-white">
//           <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-full">
//             <Feather name="search" size={18} color="#6B7280" />
//             <TextInput 
//               placeholder="Search modern essentials..." 
//               placeholderTextColor="#9CA3AF"
//               value={searchText}
//               onChangeText={(text) => {
//                 setSearchText(text);
//                 if (selectedCategory) setSelectedCategory(null); // Overwrite badge if typing manually
//               }}
//               className="flex-1 text-black text-sm ml-2 font-normal"
//             />
//             {(searchText.length > 0 || selectedCategory !== null) && (
//               <TouchableOpacity onPress={clearFilters} className="p-1">
//                 <Ionicons name="close-circle" size={18} color="#9CA3AF" />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         {/* 2. Promotional Banners Carousel */}
//         {BANNERS_DATA.length === 0 ? (
//           <EmptySectionState heightClass="h-48" message="No ongoing promotional events or banners available right now." />
//         ) : (
//           <FlatList 
//             ref={flatListRef}
//             data={BANNERS_DATA}
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             keyExtractor={(item) => item.id}
//             onScroll={handleScroll}
//             onMomentumScrollEnd={handleMomentumScrollEnd}
//             scrollEventThrottle={16}
//             renderItem={({ item }) => (
//               <View style={{ width: width - 32 }} className="mx-4 h-48 bg-black rounded-2xl overflow-hidden relative">
//                 {item.image ? (
//                   <Image source={{ uri: item.image }} className="w-full h-full opacity-60 absolute" />
//                 ) : (
//                   <View className="absolute inset-0 opacity-40"><ImagePlaceholder heightClass="h-full" /></View>
//                 )}
//                 <View className="p-6 justify-between h-full z-10">
//                   <View>
//                     <Text className="text-white text-[10px] font-bold tracking-widest bg-black/40 self-start px-2 py-1 rounded">LIMITED</Text>
//                     <Text className="text-white text-2xl font-black mt-2 tracking-tight">{item.title}</Text>
//                     <Text className="text-gray-300 text-sm font-medium mt-1">{item.subtitle}</Text>
//                   </View>
//                   <TouchableOpacity className="bg-white px-5 py-2.5 rounded-xl self-start">
//                     <Text className="text-black font-bold text-xs tracking-wider">SHOP NOW</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             )}
//           />
//         )}

//         {/* 3. Categories Slider */}
//         <View className="mt-8">
//           <View className="px-4 mb-4 flex-row justify-between items-center">
//             <Text className="text-lg font-black tracking-tight text-black">SHOP BY CATEGORY</Text>
//           </View>
//           {CATEGORIES_DATA.length === 0 ? (
//             <EmptySectionState heightClass="h-20" message="No categories available at the moment." />
//           ) : (
//             <FlatList
//               data={CATEGORIES_DATA}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={{ paddingHorizontal: 16 }}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => {
//                 const isSelected = selectedCategory === item.name;
//                 return (
//                   <TouchableOpacity 
//                     className="items-center mr-6" 
//                     onPress={() => {
//                       if (isSelected) {
//                         setSelectedCategory(null);
//                         setSearchText('');
//                       } else {
//                         setSelectedCategory(item.name);
//                         setSearchText(item.name);
//                       }
//                     }}
//                   >
//                     <View className={`w-14 h-14 rounded-full items-center justify-center border ${isSelected ? 'bg-black border-black' : 'bg-gray-100 border-gray-200'}`}>
//                       <Ionicons name={item.icon} size={22} color={isSelected ? 'white' : 'black'} />
//                     </View>
//                     <Text className={`text-xs font-semibold mt-2 tracking-tight ${isSelected ? 'text-black font-bold' : 'text-gray-800'}`}>{item.name}</Text>
//                   </TouchableOpacity>
//                 );
//               }}
//             />
//           )}
//         </View>

//         {/* Standalone Section: Category Item Showcases */}
//         {CATEGORIES_DATA.length > 0 && (
//           <View className="mt-6">
//             {filteredShowcaseData.length === 0 ? (
//               /* Search Feedback UI if filtering returns nothing */
//               <EmptySectionState 
//                 heightClass="h-44" 
//                 message={`No category items match "${searchText || selectedCategory}". Try searching for another item.`} 
//               />
//             ) : (
//               <FlatList
//                 data={filteredShowcaseData}
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={{ paddingHorizontal: 16 }}
//                 keyExtractor={(item) => `cat-product-${item.id}`}
//                 renderItem={({ item }) => (
//                   <View style={{ width: width * 0.44 }} className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-2 mr-4">
//                     <View className="relative bg-gray-50 rounded-xl overflow-hidden">
//                       {item.image ? (
//                         <Image source={{ uri: item.image }} className="w-full h-44 object-cover" />
//                       ) : (
//                         <ImagePlaceholder heightClass="h-44" />
//                       )}
//                     </View>
//                     <View className="pt-2 px-1">
//                       <Text className="text-xs font-bold text-black tracking-tight" numberOfLines={1}>{item.name}</Text>
//                       <View className="flex-row items-center justify-between mt-2">
//                         <Text className="text-sm font-black text-black">{item.previewPrice}</Text>
//                         <TouchableOpacity className="bg-black px-3 py-1.5 rounded-lg">
//                           <Text className="text-[10px] font-bold text-white tracking-wider">ADD</Text>
//                         </TouchableOpacity>
//                       </View>
//                     </View>
//                   </View>
//                 )}
//               />
//             )}
//           </View>
//         )}

//         {/* Category Fabric Showcases */}
//         <View className="mt-8">
//           <View className="flex-row justify-between items-center mb-4 px-4">
//             <Text className="text-lg font-black tracking-tight text-black">FEATURED PRODUCT</Text>
//             <Text className="text-xs font-bold text-gray-400 tracking-wider">EXPLORE LINEUP</Text>
//           </View>
          
//           {FEATURED_PRODUCT.length === 0 ? (
//             <EmptySectionState heightClass="h-48" message="No featured fabric groupings found." />
//           ) : (
//             <FlatList
//               data={FEATURED_PRODUCT}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={{ paddingHorizontal: 16 }}
//               keyExtractor={(item) => `fabric-${item.id}`}
//               renderItem={({ item }) => (
//                 <View 
//                   style={{ width: width * 0.44 }} 
//                   className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-2 mr-4"
//                 >
//                   <View className="bg-gray-50 rounded-xl overflow-hidden">
//                     {item.image ? (
//                       <Image source={{ uri: item.image }} className="w-full h-36 object-cover" />
//                     ) : (
//                       <ImagePlaceholder heightClass="h-36" />
//                     )}
//                   </View>
//                   <View className="pt-2 pb-1 px-1 flex-row justify-between items-center">
//                     <View className="flex-1 pr-1">
//                       <Text className="text-xs font-black text-black tracking-tight" numberOfLines={1}>{item.name.toUpperCase()}</Text>
//                       <Text className="text-[10px] text-gray-400 font-medium mt-0.5">Explore Collection</Text>
//                     </View>
//                     <View className="bg-gray-100 p-1.5 rounded-lg">
//                       <Feather name="arrow-right" size={12} color="black" />
//                     </View>
//                   </View>
//                 </View>
//               )}
//             />
//           )}
//         </View>

//         {/* 4. Swipable Featured Showcases */}
//         <View className="mt-8">
//           <View className="flex-row justify-between items-center mb-4 px-4">
//             <Text className="text-lg font-black tracking-tight text-black">TRENDING NOW</Text>
//             <TouchableOpacity><Text className="text-xs font-bold text-gray-500 tracking-wider">SEE ALL</Text></TouchableOpacity>
//           </View>
          
//           {TRENDING_NOW.length === 0 ? (
//             <EmptySectionState heightClass="h-52" message="Trending inventory parameters are currently updating." />
//           ) : (
//             <FlatList
//               data={TRENDING_NOW}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={{ paddingHorizontal: 16 }}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item: product }) => (
//                 <View style={{ width: width * 0.44 }} className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-2 mr-4">
//                   <View className="relative bg-gray-50 rounded-xl overflow-hidden">
//                     {product.image ? (
//                       <Image source={{ uri: product.image }} className="w-full h-40 object-cover" />
//                     ) : (
//                       <ImagePlaceholder heightClass="h-40" />
//                     )}
//                     {product.oldPrice && product.image && (
//                       <View className="absolute bottom-2 left-2 bg-black px-2 py-0.5 rounded">
//                         <Text className="text-white text-[10px] font-bold">SALE</Text>
//                       </View>
//                     )}
//                   </View>
//                   <View className="pt-2 px-1">
//                     <Text className="text-xs font-bold text-black tracking-tight" numberOfLines={1}>{product.name}</Text>
//                     <View className="flex-row items-center mt-1">
//                       <Ionicons name="star" size={12} color="black" />
//                       <Text className="text-[11px] font-medium text-black ml-1">{product.rating}</Text>
//                     </View>
//                     <View className="flex-row items-center justify-between mt-2">
//                       <View className="flex-row items-baseline">
//                         <Text className="text-sm font-black text-black">{product.price}</Text>
//                         {product.oldPrice && <Text className="text-[11px] text-gray-400 line-through ml-1.5">{product.oldPrice}</Text>}
//                       </View>
//                       <TouchableOpacity onPress={() => router.push("(drawer)/single-product")} className="bg-black p-2 rounded-lg">
//                         <Feather name="plus" size={14} color="white" />
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>
//               )}
//             />
//           )}
//         </View>

//         {/* 5. Real-time New Arrivals */}
//         <View className="mt-8 px-4">
//           <View className="flex-row justify-between items-center mb-4">
//             <Text className="text-lg font-black tracking-tight text-black">NEW ARRIVALS</Text>
//             <TouchableOpacity><Text className="text-xs font-bold text-gray-500 tracking-wider">BROWSE ALL</Text></TouchableOpacity>
//           </View>

//           {NEW_ARRIVALS_DATA.length === 0 ? (
//             <EmptySectionState heightClass="h-44" message="No fresh batch items or new arrivals discovered." />
//           ) : (
//             <View className="flex-row flex-wrap justify-between">
//               {NEW_ARRIVALS_DATA.map((product) => (
//                 <View key={product.id} style={{ width: (width - 44) / 2 }} className="bg-white mb-4 border border-gray-100 rounded-2xl overflow-hidden p-2">
//                   <View className="relative bg-gray-50 rounded-xl overflow-hidden">
//                     {product.image ? (
//                       <Image source={{ uri: product.image }} className="w-full h-44 object-cover" />
//                     ) : (
//                       <ImagePlaceholder heightClass="h-44" />
//                     )}
//                   </View>
//                   <View className="pt-2 px-1">
//                     <Text className="text-xs font-bold text-black tracking-tight" numberOfLines={1}>{product.name}</Text>
//                     <View className="flex-row items-center justify-between mt-2">
//                       <Text className="text-sm font-black text-black">{product.price}</Text>
//                       <TouchableOpacity onPress={() => router.push("(drawer)/single-product")} className="bg-black px-3 py-1.5 rounded-lg">
//                         <Text className="text-[10px] font-bold text-white tracking-wider">ADD</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>
//               ))}
//             </View>
//           )}
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }














import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // <-- Added MaterialCommunityIcons for gesture icons
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const BASE_BANNERS = [
  { id: '1', title: 'SUMMER ESSENTIALS', subtitle: 'UP TO 50% OFF', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800' },
  { id: '2', title: 'MINIMALIST LOOKBOOK', subtitle: 'NEW SEASON', image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800' },
  { id: '3', title: 'PREMIUM TRADITIONAL', subtitle: 'THE LUXURY COLLECTION', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800' },
  { id: '4', title: 'MODERN ACCESSORIES', subtitle: 'CHRONO & LEATHER GEAR', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800' }
];

// Append a clone of the first item to the end for seamless looping
const BANNERS_DATA = BASE_BANNERS.length > 0 ? [...BASE_BANNERS, { ...BASE_BANNERS[0], id: 'clone-1' }] : [];

const CATEGORIES_DATA = [
  { id: '1', name: 'Voile', icon: 'layers-outline' },
  { id: '2', name: 'Shadda', icon: 'ribbon-outline' },
  { id: '3', name: 'Lace', icon: 'sparkles-outline' },
  { id: '4', name: 'Ankara', icon: 'color-palette-outline' },
  { id: '5', name: 'Material', icon: 'cut-outline' },
  { id: '6', name: 'Jakard', icon: 'grid-outline' },
];

// Separate independent array for Category Item Showcases (Top product view)
const CATEGORY_SHOWCASE_DATA = [
  { id: 'cs1', name: 'Premium Voile Classic', previewPrice: '₦45,000', image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=400' },
  { id: 'cs2', name: 'Luxury Shadda Segment', previewPrice: '₦65,000', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400' },
  { id: 'cs3', name: 'Exclusive Royal Lace', previewPrice: '₦85,000', image: '' }, 
];

const FEATURED_PRODUCT = [
  { id: 'ff1', name: 'Premium Ankara Print', image: 'https://images.unsplash.com/photo-1610116306796-6ebd30d77fa1?w=400' },
  { id: 'ff2', name: 'Super Jakard Collection', image: 'https://images.unsplash.com/photo-1574169208507-84376144848b&w=400' },
  { id: 'ff3', name: 'Classic Suit Material', image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=400' }
];

const TRENDING_NOW = [
  { id: 'f1', name: 'Classic Leather Derby', price: '₦120,000', oldPrice: '₦180,000', rating: 4.9, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500' },
  { id: 'f2', name: 'Minimalist Chrono Watch', price: '₦195,000', rating: 4.8, image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500' },
  { id: 'f3', name: 'Premium Leather Bomber', price: '₦299,000', rating: 5.0, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500' }
];

const NEW_ARRIVALS_DATA = [
  { id: 'n1', name: 'Heavyweight Oversized Tee', price: '₦45,000', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500' },
  { id: 'n2', name: 'Tailored Linen Trousers', price: '₦85,000', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500' },
  { id: 'n3', name: 'Canvas Everyday Tote', price: '₦35,000', oldPrice: '₦50,000', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500' },
  { id: 'n4', name: 'Acetate Sunglasses', price: '₦65,000', image: '' },
];

// Reusable Section Header Component showing visual horizontal cues  =>  Swipe
function SectionHeader({ title, showSwipeIndicator = false, rightElement = null }) {
  return (
    <View className="px-4 mb-4 flex-row justify-between items-center">
      <Text className="text-lg font-black tracking-tight text-black">{title}</Text>
      
      {rightElement ? (
        rightElement
      ) : showSwipeIndicator ? (
        <View className="flex-row items-center bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
          <MaterialCommunityIcons name="gesture-swipe-horizontal" size={14} color="#9CA3AF" />
          <Text className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-wider">Swipe</Text>
          <Feather name="arrow-right" size={10} color="#9CA3AF" className="ml-0.5" />
        </View>
      ) : null}
    </View>
  );
}

// Centered Empty State helper that preserves layout height => No Match
function EmptySectionState({ message, heightClass = "h-44" }) {
  return (
    <View style={{ width: width - 32 }} className={`mx-4 bg-gray-50 border border-gray-100 rounded-2xl items-center justify-center p-6 ${heightClass}`}>
      <Ionicons name="information-circle-outline" size={26} color="#9CA3AF" />
      <Text className="text-gray-400 text-xs font-medium mt-2 text-center tracking-tight max-w-[250px]">
        {message}
      </Text>
    </View>
  );
}

// Global Image Placeholder Component => No image uploaded
function ImagePlaceholder({ heightClass = "h-44" }) {
  return (
    <View className={`w-full ${heightClass} bg-gray-100 items-center justify-center`}>
      <Ionicons name="image-outline" size={28} color="#9CA3AF" />
      <Text className="text-gray-400 text-[10px] font-medium mt-1">No image uploaded</Text>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  // Auto-scroll loop effect
  useEffect(() => {
    if (BANNERS_DATA.length <= 1) return;

    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      
      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  // Handle snapping back to start when sliding past the final clone card
  const handleScroll = (event) => {
    if (BANNERS_DATA.length <= 1) return;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = contentOffsetX / (width - 32);
    
    if (currentIndex >= BANNERS_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: 0,
        animated: false,
      });
      setActiveIndex(0);
    }
  };

  // handleMomentumScrollEnd
  const handleMomentumScrollEnd = (event) => {
    if (BANNERS_DATA.length <= 1) return;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / (width - 32));
    
    if (currentIndex >= 0 && currentIndex < BANNERS_DATA.length - 1) {
      setActiveIndex(currentIndex);
    }
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedCategory(null);
  };

  const getFilteredShowcaseItems = () => {
    return CATEGORY_SHOWCASE_DATA.filter(item => {
      const matchText = searchText.trim().toLowerCase();
      const matchCategory = selectedCategory ? selectedCategory.toLowerCase() : '';
      const itemName = item.name.toLowerCase();

      if (matchCategory && !itemName.includes(matchCategory)) return false;
      if (matchText && !itemName.includes(matchText)) return false;
      return true;
    });
  };

  const filteredShowcaseData = getFilteredShowcaseItems();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Sticky-Style Search Bar */}
        <View className="p-4 bg-white">
          <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-full">
            <Feather name="search" size={18} color="#6B7280" />
            <TextInput 
              placeholder="Search modern essentials..." 
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                if (selectedCategory) setSelectedCategory(null);
              }}
              className="flex-1 text-black text-sm ml-2 font-normal"
            />
            {(searchText.length > 0 || selectedCategory !== null) && (
              <TouchableOpacity onPress={clearFilters} className="p-1">
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 2. Promotional Banners Carousel */}
        {BANNERS_DATA.length === 0 ? (
          <EmptySectionState heightClass="h-48" message="No ongoing promotional events or banners available right now." />
        ) : (
          <FlatList 
            ref={flatListRef}
            data={BANNERS_DATA}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <View style={{ width: width - 32 }} className="mx-4 h-48 bg-black rounded-2xl overflow-hidden relative">
                {item.image ? (
                  <Image source={{ uri: item.image }} className="w-full h-full opacity-60 absolute" />
                ) : (
                  <View className="absolute inset-0 opacity-40"><ImagePlaceholder heightClass="h-full" /></View>
                )}
                <View className="p-6 justify-between h-full z-10">
                  <View>
                    <Text className="text-white text-[10px] font-bold tracking-widest bg-black/40 self-start px-2 py-1 rounded">LIMITED</Text>
                    <Text className="text-white text-2xl font-black mt-2 tracking-tight">{item.title}</Text>
                    <Text className="text-gray-300 text-sm font-medium mt-1">{item.subtitle}</Text>
                  </View>
                  <TouchableOpacity className="bg-white px-5 py-2.5 rounded-xl self-start">
                    <Text className="text-black font-bold text-xs tracking-wider">SHOP NOW</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        {/* 3. Categories Slider */}
        <View className="mt-8">
          {/* Header with Horizontal Swipe visual cue */}
          <SectionHeader title="SHOP BY CATEGORY" showSwipeIndicator={CATEGORIES_DATA.length > 0} />
          
          {CATEGORIES_DATA.length === 0 ? (
            <EmptySectionState heightClass="h-20" message="No categories available at the moment." />
          ) : (
            <FlatList
              data={CATEGORIES_DATA}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = selectedCategory === item.name;
                return (
                  <TouchableOpacity 
                    className="items-center mr-6" 
                    onPress={() => {
                      if (isSelected) {
                        setSelectedCategory(null);
                        setSearchText('');
                      } else {
                        setSelectedCategory(item.name);
                        setSearchText(item.name);
                      }
                    }}
                  >
                    <View className={`w-14 h-14 rounded-full items-center justify-center border ${isSelected ? 'bg-black border-black' : 'bg-gray-100 border-gray-200'}`}>
                      <Ionicons name={item.icon} size={22} color={isSelected ? 'white' : 'black'} />
                    </View>
                    <Text className={`text-xs font-semibold mt-2 tracking-tight ${isSelected ? 'text-black font-bold' : 'text-gray-800'}`}>{item.name}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>

        {/* Standalone Section: Category Item Showcases */}
        {CATEGORIES_DATA.length > 0 && (
          <View className="mt-6">
            {filteredShowcaseData.length === 0 ? (
              <EmptySectionState 
                heightClass="h-44" 
                message={`No category items match "${searchText || selectedCategory}". Try searching for another item.`} 
              />
            ) : (
              <FlatList
                data={filteredShowcaseData}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                keyExtractor={(item) => `cat-product-${item.id}`}
                renderItem={({ item }) => (
                  <View style={{ width: width * 0.44 }} className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-2 mr-4">
                    <View className="relative bg-gray-50 rounded-xl overflow-hidden">
                      {item.image ? (
                        <Image source={{ uri: item.image }} className="w-full h-44 object-cover" />
                      ) : (
                        <ImagePlaceholder heightClass="h-44" />
                      )}
                    </View>
                    <View className="pt-2 px-1">
                      <Text className="text-xs font-bold text-black tracking-tight" numberOfLines={1}>{item.name}</Text>
                      <View className="flex-row items-center justify-between mt-2">
                        <Text className="text-sm font-black text-black">{item.previewPrice}</Text>
                        <TouchableOpacity className="bg-black px-3 py-1.5 rounded-lg">
                          <Text className="text-[10px] font-bold text-white tracking-wider">ADD</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        )}

        {/* Category Fabric Showcases */}
        <View className="mt-8">
          {/* Header with Horizontal Swipe visual cue */}
          <SectionHeader 
            title="FEATURED PRODUCT" 
            rightElement={
              FEATURED_PRODUCT.length > 0 ? (
                <View className="flex-row items-center space-x-2">
                  <View className="flex-row items-center bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 mr-1.5">
                    <MaterialCommunityIcons name="gesture-swipe-horizontal" size={12} color="#9CA3AF" />
                    <Text className="text-[9px] font-bold text-gray-400 ml-1 uppercase">Swipe</Text>
                  </View>
                  <Text className="text-xs font-bold text-gray-400 tracking-wider">EXPLORE LINEUP</Text>
                </View>
              ) : null
            }
          />
          
          {FEATURED_PRODUCT.length === 0 ? (
            <EmptySectionState heightClass="h-48" message="No featured fabric groupings found." />
          ) : (
            <FlatList
              data={FEATURED_PRODUCT}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              keyExtractor={(item) => `fabric-${item.id}`}
              renderItem={({ item }) => (
                <View 
                  style={{ width: width * 0.44 }} 
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-2 mr-4"
                >
                  <View className="bg-gray-50 rounded-xl overflow-hidden">
                    {item.image ? (
                      <Image source={{ uri: item.image }} className="w-full h-36 object-cover" />
                    ) : (
                      <ImagePlaceholder heightClass="h-36" />
                    )}
                  </View>
                  <View className="pt-2 pb-1 px-1 flex-row justify-between items-center">
                    <View className="flex-1 pr-1">
                      <Text className="text-xs font-black text-black tracking-tight" numberOfLines={1}>{item.name.toUpperCase()}</Text>
                      <Text className="text-[10px] text-gray-400 font-medium mt-0.5">Explore Collection</Text>
                    </View>
                    <View className="bg-gray-100 p-1.5 rounded-lg">
                      <Feather name="arrow-right" size={12} color="black" />
                    </View>
                  </View>
                </View>
              )}
            />
          )}
        </View>

        {/* 4. Swipable Featured Showcases */}
        <View className="mt-8">
          {/* Header with Horizontal Swipe visual cue */}
          <SectionHeader 
            title="TRENDING NOW" 
            rightElement={
              TRENDING_NOW.length > 0 ? (
                <View className="flex-row items-center space-x-3">
                  <View className="flex-row items-center bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                    <MaterialCommunityIcons name="gesture-swipe-horizontal" size={12} color="#9CA3AF" />
                    <Text className="text-[9px] font-bold text-gray-400 ml-1 uppercase tracking-wider">Swipe</Text>
                  </View>
                  <TouchableOpacity><Text className="text-xs font-bold text-gray-500 tracking-wider">SEE ALL</Text></TouchableOpacity>
                </View>
              ) : null
            }
          />
          
          {TRENDING_NOW.length === 0 ? (
            <EmptySectionState heightClass="h-52" message="Trending inventory parameters are currently updating." />
          ) : (
            <FlatList
              data={TRENDING_NOW}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              keyExtractor={(item) => item.id}
              renderItem={({ item: product }) => (
                <View style={{ width: width * 0.44 }} className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-2 mr-4">
                  <View className="relative bg-gray-50 rounded-xl overflow-hidden">
                    {product.image ? (
                      <Image source={{ uri: product.image }} className="w-full h-40 object-cover" />
                    ) : (
                      <ImagePlaceholder heightClass="h-40" />
                    )}
                    {product.oldPrice && product.image && (
                      <View className="absolute bottom-2 left-2 bg-black px-2 py-0.5 rounded">
                        <Text className="text-white text-[10px] font-bold">SALE</Text>
                      </View>
                    )}
                  </View>
                  <View className="pt-2 px-1">
                    <Text className="text-xs font-bold text-black tracking-tight" numberOfLines={1}>{product.name}</Text>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="star" size={12} color="black" />
                      <Text className="text-[11px] font-medium text-black ml-1">{product.rating}</Text>
                    </View>
                    <View className="flex-row items-center justify-between mt-2">
                      <View className="flex-row items-baseline">
                        <Text className="text-sm font-black text-black">{product.price}</Text>
                        {product.oldPrice && <Text className="text-[11px] text-gray-400 line-through ml-1.5">{product.oldPrice}</Text>}
                      </View>
                      <TouchableOpacity onPress={() => router.push("(drawer)/single-product")} className="bg-black p-2 rounded-lg">
                        <Feather name="plus" size={14} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
          )}
        </View>

        {/* 5. Real-time New Arrivals */}
        <View className="mt-8 px-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-black tracking-tight text-black">NEW ARRIVALS</Text>
            <TouchableOpacity><Text className="text-xs font-bold text-gray-500 tracking-wider">BROWSE ALL</Text></TouchableOpacity>
          </View>

          {NEW_ARRIVALS_DATA.length === 0 ? (
            <EmptySectionState heightClass="h-44" message="No fresh batch items or new arrivals discovered." />
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {NEW_ARRIVALS_DATA.map((product) => (
                <View key={product.id} style={{ width: (width - 44) / 2 }} className="bg-white mb-4 border border-gray-100 rounded-2xl overflow-hidden p-2">
                  <View className="relative bg-gray-50 rounded-xl overflow-hidden">
                    {product.image ? (
                      <Image source={{ uri: product.image }} className="w-full h-44 object-cover" />
                    ) : (
                      <ImagePlaceholder heightClass="h-44" />
                    )}
                  </View>
                  <View className="pt-2 px-1">
                    <Text className="text-xs font-bold text-black tracking-tight" numberOfLines={1}>{product.name}</Text>
                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-sm font-black text-black">{product.price}</Text>
                      <TouchableOpacity onPress={() => router.push("(drawer)/single-product")} className="bg-black px-3 py-1.5 rounded-lg">
                        <Text className="text-[10px] font-bold text-white tracking-wider">ADD</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}







