import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const NEW_ARRIVALS_DATA = [
  { id: 'n1', name: 'Heavyweight Oversized Tee', price: '₦45,000', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500' },
  { id: 'n2', name: 'Tailored Linen Trousers', price: '₦85,000', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500' },
  { id: 'n3', name: 'Canvas Everyday Tote', price: '₦35,000', oldPrice: '₦50,000', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500' },
  { id: 'n4', name: 'Acetate Sunglasses', price: '₦65,000', image: '' },
];

export default function NewArrivals({ EmptySectionState, ImagePlaceholder }) {
  const router = useRouter();
  const cardWidth = (width - 44) / 2;

  if (NEW_ARRIVALS_DATA.length === 0) {
    return <EmptySectionState heightClass="h-44" message="No fresh batch items or new arrivals discovered." />;
  }

  return (
    <View className="mt-8 px-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-black tracking-tight text-black">NEW ARRIVALS</Text>
        <TouchableOpacity>
          <Text className="text-xs font-bold text-gray-500 tracking-wider">BROWSE ALL</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {NEW_ARRIVALS_DATA.map((product) => (
          <View 
            key={product.id} 
            style={{ width: cardWidth }} 
            className="bg-white mb-4 border border-gray-100 rounded-2xl overflow-hidden p-2"
          >
            <View className="relative bg-gray-50 rounded-xl overflow-hidden">
              {product.image ? (
                <Image source={{ uri: product.image }} className="w-full h-44 object-cover" />
              ) : (
                <ImagePlaceholder heightClass="h-44" />
              )}
            </View>
            <View className="pt-2 px-1">
              <Text className="text-xs font-bold text-black tracking-tight" numberOfLines={1}>
                {product.name}
              </Text>
              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-sm font-black text-black">{product.price}</Text>
                <TouchableOpacity 
                  onPress={() => router.push("(drawer)/single-product")} 
                  className="bg-black px-3 py-1.5 rounded-lg"
                >
                  <Text className="text-[10px] font-bold text-white tracking-wider">ADD</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}