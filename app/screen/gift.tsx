import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ImageBackground, ActivityIndicator } from 'react-native';
import axiosInstance from '../constants/axiosInstance';
import { API_ENDPOINTS } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuBar from '../components/menubar';
import { useRouter } from 'expo-router';

type Order = {
  id: string;
  code: string;
  datetime: string;
  status: OrderStatus;
};

type OrderStatus = 'pending' | 'completed' | 'cancelled';
export default function GiftScreen() {
  // Toggle between [] and ordersExample to test both states
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<OrderStatus>('pending');
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchRewardOrders(tab);
  }, [tab]);

   const fetchRewardOrders = async (status: OrderStatus) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('access_token');
      const userId = await AsyncStorage.getItem('user_id');
      if (!token) {
        console.error('Token not found');
        return;
      }
      const response = await axiosInstance.get(`${API_ENDPOINTS.ORDER.GET_HIS_REWARD(userId, status)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedOrders: Order[] = response.data.map((order: { id: number; code?: string; date: string; status: string }) => ({
        id: order.id.toString(),
        code: `#${order.code || order.id}`,
        datetime: formatDate(order.date),
        status: mapStatusText(order.status),
      }));
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Lỗi khi tải đơn đổi thưởng:', error);
      setOrders([]);
    }finally {
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

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity onPress={() => router.push({ pathname: '/screen/giftdetail', params: { id: item.id, code: item.code, date: item.datetime, status: item.status } })}>
      <ImageBackground source={require('../../assets/images/backgroundgift.png')} style={styles.orderCard} imageStyle={styles.orderCardBg}>
        <View style={styles.orderIcon}><Icon name="gift" size={24} color="#067F38" /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.orderCode}>{item.code}</Text>
          <Text style={styles.orderDate}>{item.datetime}</Text>
        </View>
        <View style={styles.statusBox}><Text style={styles.statusText}>{item.status}</Text></View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
          <Icon name="chevron-left" size={24} color="#067F38" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ĐƠN ĐỔI THƯỞNG</Text>
        <View style={{ width: 56 }} />
      </View>
      {/* Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabButton, tab === 'pending' && styles.tabActive]}
            onPress={() => setTab('pending')}
          >
            <Text style={[styles.tabText, tab === 'pending' && styles.tabTextActive]}>Đang tiến hành</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, tab === 'completed' && styles.tabActive]}
            onPress={() => setTab('completed')}
          >
            <Text style={[styles.tabText, tab === 'completed' && styles.tabTextActive]}>Đã hoàn thành</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, tab === 'cancelled' && styles.tabActive]}
            onPress={() => setTab('cancelled')}
          >
            <Text style={[styles.tabText, tab === 'cancelled' && styles.tabTextActive]}>Đã huỷ</Text>
          </TouchableOpacity>
        </View>
      {/* Content */}
      {loading ? (
        <View style={styles.emptyWrapper}>
          <ActivityIndicator size="large" color="#067F38" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Image source={require('../../assets/images/empty_bag.png')} style={styles.emptyImage} />
          <Text style={styles.emptyTitle}>Bạn chưa đổi phần quà nào</Text>
          <Text style={styles.emptyDesc}>Hãy tích điểm để đổi thưởng rồi quay lại nhận quà nhé!</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
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
    marginLeft: 0,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
    marginTop: 10,
  },
  tabButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 6,
  },
  tabActive: {
    backgroundColor: '#B5EACB',
    borderColor: '#B5EACB',
  },
  tabText: {
    color: '#888',
    fontSize: 15,
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyWrapper: {
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
  orderCard: {
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
  orderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  orderCode: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: '#888',
  },
  statusBox: {
    backgroundColor: '#B5EACB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 10,
  },
  statusText: {
    color: '#067F38',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  orderCardBg: {
    borderRadius: 16,
  },
});
