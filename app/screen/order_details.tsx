import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import MenuBar from '../components/menubar';

export default function OrderDetailsScreen() {
  const router = useRouter();
  
  // State quản lý phương thức vận chuyển
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'selfDelivery' | null>(null);
  
  // State cho thu gom tại nhà
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState<'morning' | 'afternoon' | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState(new Date());
  
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
  
  // Xử lý nút xác nhận
  const handleConfirm = () => {
    if (deliveryMethod === 'pickup' && !isPickupFormValid) {
      return; // Không làm gì nếu form chưa hợp lệ
    }
    
    // Chuẩn bị tham số để truyền sang trang xác nhận
    const params: Record<string, string> = {
      deliveryMethod: deliveryMethod || '',
      totalWeight: '3' // Mặc định là 3kg
    };
    
    if (deliveryMethod === 'pickup') {
      params.name = name;
      params.phone = phone;
      params.address = address;
      params.date = formatDate(date);
      params.timeSlot = timeSlot || '';
    } else {
      params.pickupLocation = 'LimLoop: 140/9/4 đường số 12, P.Bình Hưng';
    }
    
    // Chuyển sang trang xác nhận
    router.push({
      pathname: '/screen/confirmation',
      params: params
    });
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
                onChangeText={setName}
                placeholder="Mr Recycle"
              />
              
              <Text style={styles.inputLabel}>Số điện thoại</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="0123456789"
                keyboardType="phone-pad"
              />
              
              <Text style={styles.inputLabel}>Địa chỉ thu gom</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Địa chỉ cụ thể"
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
                  <Text style={styles.infoText}>LimLoop: 140/9/4 đường số 12, P.Bình Hưng</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Icon name="clock-o" size={20} color="red" style={styles.infoIcon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Thời gian nhận</Text>
                  <Text style={styles.infoText}>Thứ 2 - Thứ 6: 8h - 17h</Text>
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