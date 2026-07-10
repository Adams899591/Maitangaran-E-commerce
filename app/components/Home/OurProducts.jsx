import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const { width } = Dimensions.get('window');

export default function OurProducts({ EmptySectionState, ImagePlaceholder }) {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const cardWidth = (width - 44) / 2;

  useEffect(() => {
    const fetchTrendingNow = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/products`);
        const res = response.data;

        // Safely set your backend response array
        if (res && res.Success && Array.isArray(res.Data)) {
          setProducts(res.Data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.log("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingNow();
  }, []);

  if (loading) {
    return (
      <View className="mt-8 h-44 items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (products.length === 0) {
    return <EmptySectionState heightClass="h-44" message="No fresh batch items or our products discovered." />;
  }

  return (
    <View className="mt-8 px-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-black tracking-tight text-black">Our Products</Text>
        <TouchableOpacity>
          <Text className="text-xs font-bold text-gray-500 tracking-wider">BROWSE ALL</Text>
        </TouchableOpacity>
      </View>

      {/* Grid container layout mapping over live array */}
      <View className="flex-row flex-wrap justify-between">
        {products.map((product) => {
          const hasDiscount = product.OnlineRate && Number(product.OnlineRate) < Number(product.SellingPrice);

          return (
            <View 
              key={product.ID} 
              style={{ width: cardWidth }} 
              className="bg-white mb-4 border border-gray-100 rounded-2xl overflow-hidden p-2"
            >
              {/* Image Section */}
              <View className="relative bg-gray-50 rounded-xl overflow-hidden">
                {product.SmallImage ? (
                  <Image source={{ uri: product.SmallImage }} className="w-full h-44 object-cover" />
                ) : (
                  <ImagePlaceholder heightClass="h-44" />
                )}
              </View>

              {/* Text Meta Content details */}
              <View className="pt-2 px-1">
                <Text className="text-xs font-bold text-black tracking-tight" numberOfLines={1}>
                  {product.ProductName}
                </Text>
                
                <View className="flex-row items-center justify-between mt-2">
                  <View className="flex-1">
                    {hasDiscount ? (
                      <>
                        {/* Discount rate */}
                        <Text className="text-sm font-black text-black">
                          ₦{Number(product.OnlineRate).toLocaleString()}
                        </Text>
                        {/* Old price crossed out in bold red */}
                        <Text className="text-[10px] font-bold text-red-600 line-through mt-0.5">
                          ₦{Number(product.SellingPrice).toLocaleString()}
                        </Text>
                      </>
                    ) : (
                      /* Fallback for regular or identical pricing rules */
                      <Text className="text-sm font-black text-black">
                        ₦{Number(product.SellingPrice).toLocaleString()}
                      </Text>
                    )}
                  </View>

                  {/* Interactivity Handler Link button */}
                  <TouchableOpacity 
                        //  This passes the product id to the single product page
                       onPress={() => router.push({ 
                          pathname: "(drawer)/single-product",
                          params: { id: product.ID } // Passing the product ID here
                        })}
                    // onPress={() => router.push("(drawer)/single-product")}
                    className="bg-black px-3 py-1.5 rounded-lg ml-1"
                  >
                    <Text className="text-[10px] font-bold text-white tracking-wider">ADD</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}