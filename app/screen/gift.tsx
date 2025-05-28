import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuBar from '../components/menubar';
import { useRouter } from 'expo-router';

const ordersExample = [
  {
    id: '1',
    code: '#ABC',
    date: '12:01 04/03/2025',
    status: 'Đã hoàn thành',
  },
  {
    id: '2',
    code: '#ABC',
    date: '12:01 04/03/2025',
    status: 'Đã hoàn thành',
  },
  {
    id: '3',
    code: '#ABC',
    date: '12:01 04/03/2025',
    status: 'Đã hoàn thành',
  },
  {
    id: '4',
    code: '#ABC',
    date: '12:01 04/03/2025',
    status: 'Đã hoàn thành',
  },
];

export default function GiftScreen() {
  // Toggle between [] and ordersExample to test both states
  const [orders, setOrders] = useState(ordersExample); // [] for empty
  const [tab, setTab] = useState('done'); // 'progress', 'done', 'cancel'
  const router = useRouter();

  const renderOrder = ({ item }: { item: typeof ordersExample[number] }) => (
    <TouchableOpacity onPress={() => router.push({ pathname: '/screen/giftdetail', params: { id: item.id, code: item.code, date: item.date, status: item.status } })}>
      <ImageBackground source={require('../../assets/images/backgroundgift.png')} style={styles.orderCard} imageStyle={styles.orderCardBg}>
        <View style={styles.orderIcon}><Icon name="gift" size={24} color="#067F38" /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.orderCode}>{item.code}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
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
      {orders.length > 0 && (
        <View style={styles.tabRow}>
          <TouchableOpacity style={[styles.tabButton, tab === 'progress' && styles.tabActive]} onPress={() => setTab('progress')}>
            <Text style={[styles.tabText, tab === 'progress' && styles.tabTextActive]}>Đang tiến hành</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, tab === 'done' && styles.tabActive]} onPress={() => setTab('done')}>
            <Text style={[styles.tabText, tab === 'done' && styles.tabTextActive]}>Đã hoàn thành</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, tab === 'cancel' && styles.tabActive]} onPress={() => setTab('cancel')}>
            <Text style={[styles.tabText, tab === 'cancel' && styles.tabTextActive]}>Đã huỷ</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Content */}
      {orders.length === 0 ? (
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
