import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MenuBar from '../components/menubar';

export default function OrderDetailViewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Lấy thông tin đơn hàng từ params hoặc dùng giá trị mặc định
  const orderId = params.id as string || '1';
  const orderCode = params.code as string || '123';
  const orderDate = params.date as string || '12:01 04/03/2025';
  const orderStatus = params.status as string || 'pending';
  const deliveryMethod = params.deliveryMethod as string || 'pickup'; // 'pickup' hoặc 'selfDelivery'
  
  // Dữ liệu chi tiết đơn hàng - trong thực tế sẽ lấy từ API/database
  const orderDetails = {
    address: 'ABCDEFGHIJK',
    collectionTime: 'ABCDEFGHIJK',
    materials: [
      { name: 'Nhựa', weight: 2 },
      { name: 'Thủy tinh', weight: 2 },
    ],
    sender: {
      name: 'Mr ReCycle',
      phone: '01234567',
      address: 'ABCDEFG',
      date: '06/03/2025',
      time: '13h-17h',
    },
    totalPoints: '123P',
  };
  
  // Chuyển đổi trạng thái sang text tiếng Việt
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending': return 'Đang tiến hành';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return '';
    }
  };
  
  // Lấy màu cho trạng thái
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return '#3B82F6'; // Màu xanh dương
      case 'completed': return '#067F38'; // Màu xanh lá
      case 'cancelled': return '#FF6B6B'; // Màu đỏ
      default: return '#000000';
    }
  };
  
  // Lấy text cho phương thức vận chuyển
  const getDeliveryMethodText = (method: string): string => {
    return method === 'pickup' ? 'Thu gom tại nhà' : 'Tự vận chuyển';
  };
  
  // Xử lý hủy đơn hàng
  const handleCancel = () => {
    // Thực hiện hành động hủy đơn
    alert('Đơn hàng đã được hủy');
    router.back();
  };
  
  // Quyết định hiển thị thông tin người gửi dựa vào phương thức vận chuyển
  const shouldShowSenderInfo = deliveryMethod === 'pickup';
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="chevron-left" size={20} color="#067F38" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{orderDate}</Text>
        <View style={{ width: 20 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Thông tin cơ bản */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã đơn</Text>
              <Text style={styles.infoValue}>{orderCode}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Trạng thái</Text>
              <Text style={[styles.infoValue, { color: getStatusColor(orderStatus) }]}>
                {getStatusText(orderStatus)}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phương thức vận chuyển</Text>
              <Text style={styles.infoValue}>{getDeliveryMethodText(deliveryMethod)}</Text>
            </View>
          </View>
          
          {/* Thông tin điểm thu gom */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin điểm thu gom</Text>
            
            <View style={styles.locationInfo}>
              <View style={styles.locationRow}>
                <Icon name="map-marker" size={20} color="red" style={styles.locationIcon} />
                <View>
                  <Text style={styles.locationLabel}>Địa chỉ</Text>
                  <Text style={styles.locationValue}>{orderDetails.address}</Text>
                </View>
              </View>
              
              <View style={styles.locationRow}>
                <Icon name="clock-o" size={20} color="red" style={styles.locationIcon} />
                <View>
                  <Text style={styles.locationLabel}>Thời gian nhận</Text>
                  <Text style={styles.locationValue}>{orderDetails.collectionTime}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Thông tin đơn hàng */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
            
            {orderDetails.materials.map((material, index) => (
              <View key={index} style={styles.materialRow}>
                <Text style={styles.materialName}>{material.name}</Text>
                <Text style={styles.materialWeight}>{material.weight}kg</Text>
              </View>
            ))}
          </View>
          
          {/* Thông tin người gửi - chỉ hiển thị với phương thức thu gom tại nhà */}
          {shouldShowSenderInfo && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thông tin người gửi</Text>
              
              <View style={styles.senderInfo}>
                <View style={styles.senderRow}>
                  <Text style={styles.senderLabel}>Họ và tên</Text>
                  <Text style={styles.senderValue}>{orderDetails.sender.name}</Text>
                </View>
                
                <View style={styles.senderRow}>
                  <Text style={styles.senderLabel}>Số điện thoại</Text>
                  <Text style={styles.senderValue}>{orderDetails.sender.phone}</Text>
                </View>
                
                <View style={styles.senderRow}>
                  <Text style={styles.senderLabel}>Địa chỉ</Text>
                  <Text style={styles.senderValue}>{orderDetails.sender.address}</Text>
                </View>
                
                <View style={styles.senderRow}>
                  <Text style={styles.senderLabel}>Ngày</Text>
                  <Text style={styles.senderValue}>{orderDetails.sender.date}</Text>
                </View>
                
                <View style={styles.senderRow}>
                  <Text style={styles.senderLabel}>Thời gian</Text>
                  <Text style={styles.senderValue}>{orderDetails.sender.time}</Text>
                </View>
              </View>
            </View>
          )}
          
          {/* Tổng điểm nhận được */}
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsText}>
              Tổng điểm nhận được: {orderDetails.totalPoints}
            </Text>
          </View>
          
          {/* Nút hủy đơn - Chỉ hiển thị khi đơn hàng đang tiến hành */}
          {orderStatus === 'pending' && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>HỦY</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      
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
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#555555',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  locationInfo: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 15,
  },
  locationRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  locationIcon: {
    marginRight: 10,
    marginTop: 3,
  },
  locationLabel: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 14,
  },
  materialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  materialName: {
    fontSize: 14,
  },
  materialWeight: {
    fontSize: 14,
    fontWeight: '500',
  },
  senderInfo: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 15,
  },
  senderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  senderLabel: {
    fontSize: 14,
    color: '#555555',
  },
  senderValue: {
    fontSize: 14,
  },
  pointsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
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
}); 