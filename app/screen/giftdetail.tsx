import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuBar from '../components/menubar';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function GiftDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // Example data, replace with real data as needed
  const order = {
    id: params.id || '123',
    code: params.code || '#ABC',
    date: params.date || '12:01 04/04/2025',
    status: params.status || 'Đã hoàn thành',
    address: 'ABCDEFGH',
    items: [
      { name: 'Túi xách tái chế', qty: 2, points: 258 },
      { name: 'Túi xách tái chế', qty: 2, points: 258 },
    ],
    totalPoints: 258 * 2,
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/images/backgroundgift.png')} style={styles.bg} imageStyle={styles.bgImg}>
        {/* Decorative background image */}
        <Image source={require('../../assets/images/backgroundgiftdetail.png')} style={styles.detailBgImg} resizeMode="cover" />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
            <Icon name="chevron-left" size={24} color="#067F38" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{order.date}</Text>
          <View style={{ width: 56 }} />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã đơn</Text>
            <Text style={styles.infoValue}>{order.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái</Text>
            <Text style={[styles.infoValue, { color: '#067F38' }]}>Đã hoàn thành</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Địa chỉ nhận</Text>
            <Text style={styles.infoValue}>ABCDEFGH</Text>
          </View>
          <View style={styles.sectionTitleWrapper}>
            <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
          </View>
          {order.items.map((item, idx) => (
            <View style={styles.itemRow} key={idx}>
              <Text style={styles.itemQty}>{item.qty}x</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPoints}>{item.points}P</Text>
            </View>
          ))}
          <View style={styles.itemRow}>
            <Text style={styles.itemQty}></Text>
            <Text style={styles.itemName}>Tổng điểm</Text>
            <Text style={[styles.itemPoints, { color: '#067F38' }]}>{order.totalPoints}P</Text>
          </View>
        </ScrollView>
      </ImageBackground>
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
});
