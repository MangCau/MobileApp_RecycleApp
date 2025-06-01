import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants/api';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuBar from '../components/menubar';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

export default function ShoppingBag() {
  const [cart, setCart] = useState([]); // [] for empty cart
  const router = useRouter();
  const [userPoints, setUserPoints] = useState<number>(1000);
  const [userAddress, setUserAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [cartSummary, setCartSummary] = useState<{
    items: any[],
    totalQuantity: number,
    totalPoints: number
  }>({ items: [], totalQuantity: 0, totalPoints: 0 });

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('access_token');
      const userId = await AsyncStorage.getItem('user_id');
      if (!token || !userId) {setIsLoading(false); return;}
      const res = await axios.get(API_ENDPOINTS.CART.GET_SUMMARY(Number(userId)), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserPoints(res.data.Points);
      setUserAddress(res.data.address);
      setCartSummary(res.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (rewardId: number, delta: number) => {
    const token = await AsyncStorage.getItem('access_token');
    const userId = await AsyncStorage.getItem('user_id');
    if (!token || !userId) return;

    const endpoint = delta > 0
      ? API_ENDPOINTS.CART.INCREASE(Number(userId))
      : API_ENDPOINTS.CART.DECREASE(Number(userId));

    try {
      await axios.patch(endpoint, { rewardId }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const enoughPoints = userPoints >= cartSummary.totalPoints && cartSummary.items.length > 0;
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
          <Icon name="chevron-left" size={28} color="#067F38" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GIỎ HÀNG</Text>
        <View style={{ width: 56 }} />
      </View>

      {/* Address Row */}
      <View style={styles.addressRow}>
        <Text style={styles.addressLabel}>Giao tới:</Text>
        <View style={styles.addressBox}>
          <Icon name="map-marker" size={18} color="#F44336" style={{ marginRight: 6 }} />
          <Text style={styles.addressText}>{userAddress || 'Chưa có địa chỉ'}</Text>
        </View>
      </View>

      {/* Cart Content */}
      {isLoading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color="#4AC37A" />
          <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
        </View>
      ) : cartSummary.items.length === 0 ? (
        <View style={styles.emptyCartWrapper}>
          <Image source={require('../../assets/images/empty_bag.png')} style={styles.emptyImage} />
          <Text style={styles.emptyTitle}>Chưa có mặt hàng nào</Text>
          <Text style={styles.emptyDesc}>Hãy tích điểm để đổi thưởng rồi quay lại nhận quà nhé!</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartSummary.items}
            keyExtractor={item => item.reward.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartCard}>
                <Image source={{ uri: item.reward.imageUrl }} style={styles.cartImage} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.cartName}>{item.reward.name}</Text>
                  <Text style={styles.cartPoints}>{item.reward.points} P</Text>
                </View>
                <View style={styles.quantityRow}>
                  <TouchableOpacity onPress={() => handleQuantityChange(item.reward.id, -1)}>
                    <Icon name="minus-circle" size={24} color="#A5D6A7" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => handleQuantityChange(item.reward.id, 1)}>
                    <Icon name="plus-circle" size={24} color="#4AC37A" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
          {/* Points Summary */}
          <View style={styles.pointsSummary}>
            <View style={styles.pointsRow}>
              <Text style={styles.pointsLabel}>Tổng điểm</Text>
              <Text style={styles.pointsValue}>{cartSummary.totalPoints} P</Text>
            </View>
            <View style={styles.pointsRow}>
              <Text style={styles.pointsLabel}>Điểm hiện có</Text>
              <Text style={[styles.pointsValue, { color: enoughPoints ? '#067F38' : '#F44336' }]}>{userPoints} P</Text>
            </View>
            {!enoughPoints && (
              <Text style={styles.notEnough}>Không đủ điểm để đổi thưởng</Text>
            )}
          </View>
          {/* Redeem Button */}
          <TouchableOpacity 
            style={[styles.redeemButton, !enoughPoints && { backgroundColor: '#E0E0E0' }]}
            disabled={!enoughPoints}
            onPress={() => {
              if (enoughPoints) router.push('/screen/shoppingbagsuccess');
            }}
          >
            <Text style={styles.redeemText}>ĐỔI THƯỞNG</Text>
          </TouchableOpacity>
        </>
      )}
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
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    textAlign: 'center',
    marginLeft: -56,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  addressLabel: {
    color: '#888',
    fontSize: 15,
    marginRight: 8,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  addressText: {
    fontSize: 15,
    color: '#222',
  },
  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 18,
    marginBottom: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cartImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  cartName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    marginBottom: 4,
  },
  cartPoints: {
    fontSize: 15,
    color: '#4AC37A',
    fontWeight: 'bold',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: '#222',
  },
  pointsSummary: {
    marginHorizontal: 24,
    marginTop: 10,
    marginBottom: 6,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  pointsLabel: {
    fontSize: 16,
    color: '#222',
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  notEnough: {
    color: '#F44336',
    fontSize: 14,
    marginTop: 2,
  },
  redeemButton: {
    backgroundColor: '#B5EACB',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 24,
    marginBottom: 10,
  },
  redeemText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  emptyCartWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 18,
    resizeMode: 'contain',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginHorizontal: 30,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

