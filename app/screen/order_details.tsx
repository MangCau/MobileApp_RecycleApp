import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  SafeAreaView,
  Alert
} from 'react-native';
import axiosInstance from '../constants/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants/api';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MenuBar from '../components/menubar';
type Material = {
  id: number;
  title: string;
  image: string | null;
  weight: string;
};
export default function OrderDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // State quản lý phương thức vận chuyển
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'selfDelivery' | null>(null);
  
  // State cho thu gom tại nhà
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState<'morning' | 'afternoon' | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState(new Date());
  const [collectionPoint, setCollectionPoint] = useState<{
    id: number;
    name: string;
    address: string;
    time: string;
  } | null>(null);
  // Kiểm tra xem đã nhập đủ thông tin chưa (cho thu gom tại nhà)
  const isPickupFormValid = name && phone && address && timeSlot;
  
  // Custom date picker with modal
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatWorkingDays = (
    days?: { day: string; startTime: string; endTime: string }[]
  ): string => {
    if (!Array.isArray(days)) return 'Không rõ thời gian';

    const dayMap: Record<string, string> = {
      Monday: 'T2',
      Tuesday: 'T3',
      Wednesday: 'T4',
      Thursday: 'T5',
      Friday: 'T6',
      Saturday: 'T7',
      Sunday: 'CN',
    };

    return days
      .map(({ day, startTime, endTime }) => {
        const startHour = new Date(startTime).getHours();
        const endHour = new Date(endTime).getHours();

        const parts = day
          .split('-')
          .map((d) => d.trim())
          .map((d) => dayMap[d] || d);

        const formattedDay = parts.join(' - ');
        return `${formattedDay}: ${startHour}h-${endHour}h`;
      })
      .join(' | ');
  };

  const fetchUserInfo = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        console.error('Không tìm thấy access token');
        return;
      }

      const res = await axiosInstance.get(API_ENDPOINTS.USER.GET_BY_ID(id), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data;
      if (user) {
        setName(user.name || '');
        setPhone(user.tel || '');
        setAddress(user.address || '');
      } else {
        console.error('Không tìm thấy thông tin người dùng');
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
    }
  };

  const fetchCollectionPoint = async (centerId: string) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        console.error('Không tìm thấy access token');
        return;
      }
      const res = await axiosInstance.get(API_ENDPOINTS.CENTER.GET_BY_ID(centerId));
      const center = res.data;

      if (!center) {
        console.error('Không tìm thấy thông tin center trong response:', res.data);
        return;
      }
      setCollectionPoint({
        id: center.id,
        name: center.name,
        address: center.address,
        time: formatWorkingDays(center.workingTimes)
      });
    } catch (error) {
      console.error('Lỗi khi lấy thông tin điểm thu gom:', error);
    }
  };
  useEffect(() => {
    if (params.centerId) {
      fetchCollectionPoint(params.centerId as string);
    }
  }, [params.centerId]);
  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem('user_id');
      if (id) {
        setUserId(id);
      }
    };
    loadUserId();
  }, []);
  useEffect(() => {
    if (deliveryMethod === 'pickup' && userId) {
      fetchUserInfo(userId);
    }
  }, [deliveryMethod, userId]);
  // Các ngày cho custom date picker
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 1; i <= 10; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      options.push(date);
    }
    
    return options;
  };
  
  const dateOptions = generateDateOptions();
  
  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    setShowDatePickerModal(false);
  };
  
  const extractTimeRange = (timeStr: string) => {
    const parts = timeStr.split(':');
    return parts.length > 1 ? parts.slice(1).join(':').trim() : timeStr;
  };
  // Xử lý nút xác nhận
  const handleConfirm = async () => {
    if (deliveryMethod === 'pickup' && !isPickupFormValid) return;
    const schedule = timeSlot === 'morning' ? '8h-12h' : timeSlot === 'afternoon' ? '13h-17h' : '';
    try {

      const centerId = Number(params.centerId);
      const rawData = Array.isArray(params.data) ? params.data[0] : params.data;
      const data = JSON.parse(rawData);
      const materials: Material[] = data.materials;
      console.log(data?.points?.toString())
      const items = materials.map((m): { typeName: string; quantity: number }  => ({
        typeName: m.title,
        quantity: Number(m.weight)
      }));

    const customerIdString = await AsyncStorage.getItem('user_id');
    const customerId = customerIdString ? Number(customerIdString) : null;

      const dto = {
        customerId,
        centerId,
        transport: deliveryMethod,
        status: 'pending',
        items,
        note: data.note || '',
        receiveDate: date?.toISOString(),
        schedule,
      };

      const response = await axiosInstance.post(API_ENDPOINTS.ORDER.CREATE_MATERIAL, dto);

      if (response.status === 201 || response.status === 200) {
        const orderData = response.data;

        const confirmParams: Record<string, string> = {
          deliveryMethod: deliveryMethod || '',
          totalWeight: items.reduce((sum, item) => sum + item.quantity, 0).toString(),
          orderId: orderData?.id?.toString() || '',
          totalPoints: orderData?.points?.toString() || '0',
        };

        if (deliveryMethod === 'pickup') {
          confirmParams.name = name;
          confirmParams.phone = phone;
          confirmParams.address = address;
          confirmParams.date = formatDate(date);
          confirmParams.timeSlot = timeSlot || '';
        } else if (deliveryMethod === 'selfDelivery' && collectionPoint) {
          confirmParams.pickupLocation = `${collectionPoint.name}: ${collectionPoint.address}`;

          confirmParams.time = collectionPoint.time;
        }
        //extractTimeRange(collectionPoint.time)
        router.push({
          pathname: '/screen/confirmation',
          params: confirmParams
        });
      } else {
        Alert.alert('Lỗi', 'Không thể tạo đơn hàng. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Lỗi tạo đơn hàng:', error);
      Alert.alert('Lỗi', 'Tạo đơn hàng thất bại. Vui lòng kiểm tra kết nối.');
    } 
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="chevron-left" size={20} color="#067F38" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TẠO ĐƠN</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Chọn phương thức vận chuyển */}
          <Text style={styles.sectionTitle}>Chọn phương thức vận chuyển</Text>
          
          <View style={styles.deliveryOptions}>
            <TouchableOpacity
              style={[
                styles.deliveryOption,
                deliveryMethod === 'pickup' && styles.selectedDeliveryOption
              ]}
              onPress={() => setDeliveryMethod('pickup')}
            >
              <Icon name="truck" size={28} color="#067F38" style={styles.deliveryIcon} />
              <Text style={styles.deliveryText}>Thu gom tại nhà</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.deliveryOption,
                deliveryMethod === 'selfDelivery' && styles.selectedDeliveryOption
              ]}
              onPress={() => setDeliveryMethod('selfDelivery')}
            >
              <Icon name="motorcycle" size={28} color="#067F38" style={styles.deliveryIcon} />
              <Text style={styles.deliveryText}>Tự vận chuyển đến điểm thu gom</Text>
            </TouchableOpacity>
          </View>

          {/* Form thu gom tại nhà */}
          {deliveryMethod === 'pickup' && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Thông tin người gửi</Text>
              
              <Text style={styles.inputLabel}>Họ và tên</Text>
              <TextInput
                style={styles.input}
                value={name}
                editable={false}
                selectTextOnFocus={false}
              />
              
              <Text style={styles.inputLabel}>Số điện thoại</Text>
              <TextInput
                style={styles.input}
                value={phone}
                editable={false}
                selectTextOnFocus={false}
                keyboardType="phone-pad"
              />
              
              <Text style={styles.inputLabel}>Địa chỉ thu gom</Text>
              <TextInput
                style={styles.input}
                value={address}
                editable={false}
                selectTextOnFocus={false}
              />
              
              <Text style={styles.inputLabel}>Ngày đến thu gom</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowDatePickerModal(true)}
              >
                <Text style={styles.dateText}>{formatDate(date)}</Text>
                <Icon name="calendar" size={20} color="#067F38" />
              </TouchableOpacity>
              
              <Text style={styles.inputLabel}>Chọn 1 trong 2 khung giờ</Text>
              <View style={styles.timeSlots}>
                <TouchableOpacity
                  style={[
                    styles.timeSlot,
                    timeSlot === 'morning' && styles.selectedTimeSlot
                  ]}
                  onPress={() => setTimeSlot('morning')}
                >
                  <Text style={styles.timeSlotText}>Sáng (8h-12h)</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.timeSlot,
                    timeSlot === 'afternoon' && styles.selectedTimeSlot
                  ]}
                  onPress={() => setTimeSlot('afternoon')}
                >
                  <Text style={styles.timeSlotText}>Chiều (13h-17h)</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Thông tin điểm thu gom */}
          {deliveryMethod === 'selfDelivery' && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Thông tin địa điểm thu gom</Text>
              
              <View style={styles.infoRow}>
                <Icon name="map-marker" size={20} color="red" style={styles.infoIcon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Địa chỉ</Text>
                  <Text style={styles.infoText}>{collectionPoint?.address}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Icon name="clock-o" size={20} color="red" style={styles.infoIcon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Thời gian nhận</Text>
                  <Text style={styles.infoText}>{collectionPoint?.time}</Text>
                </View>
              </View>
              
              <Text style={styles.noteText}>
                Lưu ý: Cần phân loại và đóng gói các kiện hàng nếu tự vận chuyển đến kho
              </Text>
            </View>
          )}

          {/* Nút xác nhận */}
          {deliveryMethod && (
            <TouchableOpacity
              style={[
                styles.confirmButton,
                (deliveryMethod === 'pickup' && !isPickupFormValid) && styles.disabledButton
              ]}
              onPress={handleConfirm}
              disabled={deliveryMethod === 'pickup' && !isPickupFormValid}
            >
              <Text style={styles.confirmButtonText}>XÁC NHẬN</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Custom Date Picker Modal */}
      <Modal
        visible={showDatePickerModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePickerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn ngày thu gom</Text>
            <ScrollView style={styles.dateList}>
              {dateOptions.map((optionDate, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateOption,
                    formatDate(date) === formatDate(optionDate) && styles.selectedDateOption
                  ]}
                  onPress={() => handleDateSelect(optionDate)}
                >
                  <Text style={[
                    styles.dateOptionText,
                    formatDate(date) === formatDate(optionDate) && styles.selectedDateOptionText
                  ]}>
                    {formatDate(optionDate)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDatePickerModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    backgroundColor: '#ffffff',
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  deliveryOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  deliveryOption: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  selectedDeliveryOption: {
    borderColor: '#067F38',
    borderWidth: 2,
  },
  deliveryIcon: {
    marginBottom: 10,
  },
  deliveryText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
  formContainer: {
    backgroundColor: '#f7f9f7',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#444',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  dateInput: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
  },
  timeSlots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeSlot: {
    width: '48%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#e6f7e9',
    borderColor: '#067F38',
  },
  timeSlotText: {
    fontSize: 14,
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
  noteText: {
    fontStyle: 'italic',
    fontSize: 14,
    color: '#666',
    marginTop: 15,
    lineHeight: 20,
  },
  confirmButton: {
    backgroundColor: '#34A262',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  dateList: {
    maxHeight: 300,
  },
  dateOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  selectedDateOption: {
    backgroundColor: '#e6f7e9',
  },
  dateOptionText: {
    fontSize: 16,
  },
  selectedDateOptionText: {
    color: '#067F38',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#067F38',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 