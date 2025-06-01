import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuBar from '../components/menubar';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface OrderItem {
  name: string;
  qty: number;
  points: number;
}

interface Order {
  id: string;
  code: string;
  date: string;
  status: string;
  address: string;
  items: OrderItem[];
  totalPoints: number;
}

export interface OrderDetail {
  id: string;
  code: string;
  items: OrderItem[];
  date: string;
  status: string;
  totalPoints: number;
  address: string;
}
export default function GiftDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const fetchRewardOrderById = async (orderId: string): Promise<OrderDetail> => {
    const token = await AsyncStorage.getItem('access_token');
    const userId = await AsyncStorage.getItem('user_id');
    if (!token || !userId) throw new Error('Chưa đăng nhập');

    const res = await axios.get(API_ENDPOINTS.ORDER.GET_DETAIL_REWARD(orderId), {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = res.data;

    return {
      id: data.id,
      code: data.code,
      date: data.date,
      status: data.status,
      address: data.address || 'Chưa có địa chỉ',
      items: data.items.map((item: any) => ({
        name: item.name,
        qty: item.quantity,
        points: item.points,
      })),
      totalPoints: data.items.reduce(
        (sum: number, i: any) => sum + i.points * i.quantity,
        0
      ),
    };
  };
  const loadOrder = async (orderId: string) => {
    try {
      setLoading(true);
      const fetchedOrder = await fetchRewardOrderById(orderId);
      setOrder({
        id: fetchedOrder.id,
        code: `#${fetchedOrder.code || fetchedOrder.id}`,
        date: formatDate(fetchedOrder.date),
        status: mapStatusText(fetchedOrder.status),
        address: fetchedOrder.address,
        items: fetchedOrder.items,
        totalPoints: fetchedOrder.totalPoints,
      });
    } catch (error) {
      console.error('Không thể load chi tiết đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${h}:${m} ${d}/${mo}/${y}`;
  };
  const mapStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Đang tiến hành';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã huỷ';
      default:
        return status;
    }
  };
  useEffect(() => {
    const orderId = params.id as string;
    if (orderId) {
      loadOrder(orderId);
    }
  }, [params.id]);
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#067F38" />
      </View>
    );
  }
  return (
    <ImageBackground
      source={require('../../assets/images/backgroundgift.png')}
      style={styles.container}
      imageStyle={{ opacity: 0.08 }}
    >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
            <Icon name="chevron-left" size={24} color="#067F38" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{order?.date || 'Chi tiết đơn hàng'}</Text>
          <View style={{ width: 56 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.orderCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã đơn</Text>
              <Text style={styles.infoValue}>{order?.code || 'Id đơn hàng'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Trạng thái</Text>
              <Text style={[styles.infoValue, { color: '#067F38' }]}>{order?.status}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Địa chỉ nhận</Text>
              <Text style={styles.infoValue}>{order?.address || 'Chưa có địa chỉ'}</Text>
            </View>
          </View>
          <View style={styles.sectionTitleWrapper}>
            <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
          </View>
          {order && order.items.map((item, idx) => (
            <View style={styles.itemRow} key={idx}>
              <Text style={styles.itemQty}>{item.qty}x</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPoints}>{item.points}P</Text>
            </View>
          ))}
          <View style={styles.itemRow}>
            <Text style={styles.itemQty}></Text>
            <Text style={styles.itemName}>Tổng điểm</Text>
            <Text style={[styles.itemPoints, { color: '#067F38' }]}>{order?.totalPoints || '0'}P</Text>
          </View>
        </ScrollView>
      <View style={styles.footer}>
        <MenuBar />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bg: {
    flex: 1,
    resizeMode: 'cover',
  },
  bgImg: {
    resizeMode: 'cover',
    opacity: 0.18,
  },
  detailBgImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.18,
    zIndex: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingHorizontal: 18,
    paddingBottom: 10,
    backgroundColor: 'transparent',
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
    marginLeft: 0,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 30,
    zIndex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 15,
    color: '#222',
  },
  infoValue: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  sectionTitleWrapper: {
    marginTop: 18,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemQty: {
    fontSize: 15,
    color: '#222',
    width: 32,
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 15,
    color: '#222',
    flex: 1,
    textAlign: 'center'
  },
  itemPoints: {
    fontSize: 15,
    color: '#888',
    fontWeight: 'bold',
    width: 60,
    textAlign: 'right',
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  orderCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#FFFFFFDD',
    overflow: 'hidden',
  },

  orderItemsCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFFDD',
    marginBottom: 20,
  },
  orderCardBg: {
    resizeMode: 'cover',
    borderRadius: 16,
    opacity: 0.15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
