import React, { useState,useEffect } from 'react';
import axiosInstance from '../constants/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants/api';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuBar from '../components/menubar';
import { useRouter, useLocalSearchParams } from 'expo-router';

type Product = {
  id: number;
  name: string;
  imageUrl: any;
  points: number;
  favorite: boolean;
  description: string;
};
const screenWidth = Dimensions.get('window').width;

export default function ShoppingDetail() {
  const [isFavorite, setIsFavorite] = useState(false);
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProduct = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const userId = await AsyncStorage.getItem('user_id');

      if (!userId || !token) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng hoặc token');
        return;
      }

      const res = await axiosInstance.get(API_ENDPOINTS.REWARD.GET_BY_ID(id, userId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProduct(res.data);
      setIsFavorite(res.data.favorite);
    } catch (error) {
      console.error('Error fetching reward:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleToggleFavorite = async (rewardId: number) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const userId = await AsyncStorage.getItem('user_id');

      if (!userId || !token) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng hoặc token');
        return;
      }

      const res = await fetch(API_ENDPOINTS.REWARD.TOGGLE_FAVORITE(userId, rewardId), {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setIsFavorite(data.status === 'added');
    } catch (error) {
      console.error('Lỗi toggle yêu thích:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật yêu thích.');
    }
  };

  const handleRedeem = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const userId = await AsyncStorage.getItem('user_id');

      if (!userId || !token) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng hoặc token');
        return;
      }

      await axiosInstance.post(API_ENDPOINTS.CART.ADD(userId), {
        rewardId: product?.id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Thành công', 'Sản phẩm đã được thêm vào giỏ!');
      router.push('/screen/shoppingbag');
    } catch (error) {
      console.error('Lỗi đổi thưởng:', error);
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm vào giỏ.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#067F38" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Không tìm thấy sản phẩm.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
          <Icon name="chevron-left" size={24} color="#067F38" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{product.name}</Text>
        <TouchableOpacity style={styles.cartIconWrapper} onPress={() => router.push('/screen/shoppingbag')}>
          <Icon name="shopping-bag" size={22} color="#067F38" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: product.imageUrl }} style={styles.productImage} resizeMode="cover" />
        </View>

        {/* Product Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.productName}>{product.name}</Text>
            <TouchableOpacity onPress={() => handleToggleFavorite(product.id)}>
              <Icon name="heart" size={28} color={isFavorite ? '#B5A9FF' : '#ccc'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.productPoints}>{product.points} P</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>
      </ScrollView>

      {/* Redeem Button */}
      <View style={styles.redeemWrapper}>
        <TouchableOpacity style={styles.redeemButton} onPress={handleRedeem}>
          <Text style={styles.redeemText}>ĐỔI THƯỞNG</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Menu */}
      <View style={styles.footer}>
        <MenuBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingHorizontal: 18,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    textAlign: 'center',
    marginLeft: -40, // visually center between icons
  },
  cartIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 0,
    alignItems: 'center',
    paddingBottom: 20,
  },
  imageWrapper: {
    width: screenWidth,
    height: 180,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: screenWidth,
    height: 180,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: -30,
    marginHorizontal: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    width: screenWidth - 40,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
  },
  productPoints: {
    fontSize: 16,
    color: '#067F38',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 15,
    color: '#888',
    marginTop: 8,
    lineHeight: 22,
  },
  redeemWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  redeemButton: {
    backgroundColor: '#B5EACB',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  redeemText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

