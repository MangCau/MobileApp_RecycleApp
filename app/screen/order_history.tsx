import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import MenuBar from '../components/menubar';

// Định nghĩa kiểu dữ liệu cho đơn thu gom
type OrderStatus = 'pending' | 'completed' | 'cancelled';
type Order = {
  id: string;
  code: string;
  datetime: string;
  status: OrderStatus;
};

// Component hiển thị khi không có lịch sử đơn hàng
const EmptyOrdersView = () => (
  <View style={styles.emptyOrdersContainer}>
    <Image
      source={require('../../assets/images/favicon.png')}
      style={styles.emptyOrdersImage}
      resizeMode="contain"
    />
    <Text style={styles.emptyOrdersTitle}>Chưa có lịch sử hoạt động</Text>
    <Text style={styles.emptyOrdersText}>
      Hãy tham gia hoạt động tái chế cùng Greenify nhé!
    </Text>
  </View>
);

export default function OrderHistoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<OrderStatus>('pending');
  const [hasOrders, setHasOrders] = useState(true); // Đổi thành true để hiển thị danh sách đơn hàng mẫu

  // Dữ liệu mẫu cho các đơn thu gom
  const orders: Order[] = [
    { id: '1', code: 'LimLoop #123', datetime: '12:01 04/03/2025', status: 'completed' },
    { id: '2', code: 'LimLoop #234', datetime: '12:01 04/03/2025', status: 'completed' },
    { id: '3', code: 'LimLoop #456', datetime: '12:01 04/03/2025', status: 'completed' },
    { id: '4', code: 'LimLoop #567', datetime: '12:01 05/03/2025', status: 'pending' },
    { id: '5', code: 'LimLoop #678', datetime: '12:01 06/03/2025', status: 'pending' },
    { id: '6', code: 'LimLoop #789', datetime: '12:01 07/03/2025', status: 'cancelled' },
    { id: '7', code: 'LimLoop #890', datetime: '12:01 08/03/2025', status: 'cancelled' },
  ];

  // Lọc đơn thu gom theo trạng thái hiện tại
  const filteredOrders = orders.filter(order => order.status === activeTab);

  // Hàm chuyển đổi trạng thái sang tiếng Việt
  const getStatusText = (status: OrderStatus): string => {
    switch (status) {
      case 'pending': return 'Đang tiến hành';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return '';
    }
  };

  // Hàm lấy màu sắc cho trạng thái
  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'pending': return '#067F38';
      case 'completed': return '#067F38';
      case 'cancelled': return '#FF6B6B';
      default: return '#000000';
    }
  };

  // Hiển thị từng đơn thu gom
  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => {
        router.push({
          pathname: "/screen/order_detail_view" as any,
          params: {
            id: item.id,
            code: item.code.split('#')[1] || item.code,
            date: item.datetime,
            status: item.status,
            deliveryMethod: parseInt(item.id) % 2 === 0 ? 'pickup' : 'selfDelivery'
          }
        });
      }}
    >
      <View style={styles.orderIconContainer}>
        <Icon name="minus" size={20} color="#067F38" />
      </View>

      <View style={styles.orderContent}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderCode}>{item.code}</Text>
          <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>

        <Text style={styles.orderDate}>{item.datetime}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="chevron-left" size={20} color="#067F38" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ĐƠN THU GOM</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Content */}
      {hasOrders ? (
        <>
          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
              onPress={() => setActiveTab('pending')}
            >
              <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
                Đang tiến hành
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
              onPress={() => setActiveTab('completed')}
            >
              <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
                Đã hoàn thành
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
              onPress={() => setActiveTab('cancelled')}
            >
              <Text style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText]}>
                Đã hủy
              </Text>
            </TouchableOpacity>
          </View>

          {/* Order List */}
          <FlatList
            data={filteredOrders}
            renderItem={renderOrderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.orderList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không có đơn thu gom nào</Text>
              </View>
            }
          />
        </>
      ) : (
        <EmptyOrdersView />
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <MenuBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginTop: 40,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#B0E8BC',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  orderList: {
    padding: 15,
    paddingBottom: 80,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  orderIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#067F38',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  orderContent: {
    flex: 1,
    paddingRight: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  orderCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderDate: {
    fontSize: 13,
    color: '#777777',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#FFFFFF',
  },
  // Styles cho EmptyOrdersView
  emptyOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyOrdersImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyOrdersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333333',
  },
  emptyOrdersText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    lineHeight: 22,
  },
}); 