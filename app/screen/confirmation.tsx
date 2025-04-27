import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MenuBar from '../components/menubar';

export default function ConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Lấy dữ liệu từ tham số
  const deliveryMethod = params.deliveryMethod as string;
  const name = params.name as string;
  const phone = params.phone as string;
  const address = params.address as string;
  const dateStr = params.date as string;
  const timeSlot = params.timeSlot as string;
  const pickupLocation = params.pickupLocation as string;
  const totalWeight = params.totalWeight || '3'; // Mặc định 3kg
  
  // Định dạng khung giờ
  const formatTimeSlot = (slot: string) => {
    if (slot === 'morning') return 'Sáng (8h-12h)';
    if (slot === 'afternoon') return 'Chiều (13h-17h)';
    return '';
  };
  
  // Xử lý nút trở về
  const handleReturnHome = () => {
    router.push('/screen/homepage');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          {/* Biểu tượng thành công */}
          <View style={styles.successIconContainer}>
            <View style={styles.successIcon}>
              <Icon name="check" size={50} color="#FFFFFF" />
            </View>
          </View>
          
          {/* Thông báo thành công */}
          <Text style={styles.successMessage}>
            Đơn thu gom của bạn đã được gửi thành công. Vui lòng đợi nhân viên tới lấy. Xin cảm ơn
          </Text>
          
          {/* Tóm tắt chi tiết */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Tóm tắt chi tiết</Text>
            
            <View style={styles.infoRow}>
              <Icon name="map-marker" size={20} color="red" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Địa chỉ</Text>
                <Text style={styles.infoText}>
                  {deliveryMethod === 'pickup' ? address : pickupLocation}
                </Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="clock-o" size={20} color="red" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Thời gian nhận</Text>
                <Text style={styles.infoText}>
                  {deliveryMethod === 'pickup' 
                    ? `${dateStr || '30/06/2023'}, ${formatTimeSlot(timeSlot)}` 
                    : 'Thứ 2 - Thứ 6: 8h - 17h'}
                </Text>
              </View>
            </View>
            
            <View style={styles.weightInfo}>
              <Text style={styles.weightText}>Khối lượng: {totalWeight} kg</Text>
            </View>
            
            <View style={styles.divider} />
            
            <Text style={styles.pointsInfo}>
              Bạn sẽ được nhận 200 P{'\n'}
              sau khi đơn hoàn thành
            </Text>
          </View>
          
          {/* Nút trở về */}
          <TouchableOpacity style={styles.returnButton} onPress={handleReturnHome}>
            <Text style={styles.returnButtonText}>TRỞ VỀ</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  successIconContainer: {
    marginTop: 60,
    marginBottom: 20,
    alignItems: 'center',
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#067F38',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    lineHeight: 22,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#F1F9E9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  infoText: {
    fontSize: 14,
    color: '#444',
  },
  weightInfo: {
    marginBottom: 15,
  },
  weightText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 15,
  },
  pointsInfo: {
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    lineHeight: 20,
  },
  returnButton: {
    backgroundColor: '#34A262',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  returnButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
}); 