import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Platform,
  Modal,
  FlatList,
  SafeAreaView
} from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import axiosInstance from '../constants/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import MenuBar from '../components/menubar';

type WeightRecord = {
  [key: number]: string;
};

export default function CreateOrderScreen() {
  const router = useRouter();
  const [collectionPoints, setCollectionPoints] = useState<{ id: number, address: string }[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [selectedRecycleItems, setSelectedRecycleItems] = useState<
    { id: number; title: string; image: any }[]
  >([]);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const params = useLocalSearchParams();
  let selectedItems: number[] = [];

  try {
    if (params.selectedItems) {
      selectedItems = JSON.parse(params.selectedItems as string);
    }
  } catch (error) {
    console.error('Error parsing selectedItems:', error);
  }

  // State cho khối lượng của từng vật liệu
  const [weights, setWeights] = useState<WeightRecord>(() => {
    const initialWeights: WeightRecord = {};
    selectedRecycleItems.forEach(item => {
      initialWeights[item.id] = '2';
    });
    return initialWeights;
  });

  // State cho modal chọn số kg
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);
  const weightOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '15', '20', '25', '30', '50'];

  // State cho hình ảnh
  const [image, setImage] = useState<string | null>(null);

  // State cho ghi chú
  const [note, setNote] = useState('');

  const fetchSelectedRecycleItems = async (ids: number[]) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) return;

      const fetchedItems = await Promise.all(
        ids.map(async (id) => {
          const res = await axiosInstance.get(API_ENDPOINTS.TYPE.GET_TYPE_BY_ID(id), {
            headers: { Authorization: `Bearer ${token}` },
          });
          return {
            id,
            title: res.data.name,
            image: res.data.imageUrl && res.data.imageUrl.trim() !== ''
              ? { uri: res.data.imageUrl }
              : require('../../assets/images/logo2.png'),
          };
        })
      );

      setSelectedRecycleItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching selected items:', error);
    }
  };

  const fetchCenters = async (
    setCollectionPoints: React.Dispatch<React.SetStateAction<{ id: number, address: string }[]>>,
    setSelectedPoint: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        return;
      }
      const res = await axiosInstance.get(API_ENDPOINTS.CENTER.GET_ALL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const centers = res.data?.data || [];

      const formatted = centers.map((center: any) => ({
        id: center.id,
        address: `${center.name}: ${center.address}`,
      }));

      setCollectionPoints(formatted);

      if (formatted.length > 0) {
        setSelectedPoint(prev => prev ?? formatted[0].id);
      }
    } catch (error) {
      console.error('Error fetching centers:', error);
    }
  };
  useEffect(() => {
    if (selectedItems.length > 0) {
      fetchSelectedRecycleItems(selectedItems);
    }
  }, [selectedItems]);
  useEffect(() => {
    fetchCenters(setCollectionPoints, setSelectedPoint);
  }, []);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleWeightSelect = (weight: string) => {
    if (currentItemId !== null) {
      setWeights({
        ...weights,
        [currentItemId]: weight
      });
    }
    setShowWeightModal(false);
  };

  const handlePointSelect = (pointId: number) => {
    setSelectedPoint(pointId);
    setShowPointsModal(false);
  };

  const openWeightSelector = (itemId: number) => {
    setCurrentItemId(itemId);
    setShowWeightModal(true);
  };

  const getSelectedPointAddress = () => {
    const point = collectionPoints.find(p => p.id === selectedPoint);
    return point ? point.address : '';
  };

  const handleContinue = () => {
    if (selectedPoint === null) {
      console.error('Chưa chọn điểm thu gom');
      return;
    }
    const selectedMaterials = selectedRecycleItems.map((item) => ({
      ...item,
      weight: weights[item.id] || '1',
    }));

    const orderData = {
      materials: selectedMaterials,
      image,
      collectionPoint: getSelectedPointAddress(),
      note,
    };

    router.push({
      pathname: '/screen/order_details',
      params: {
        centerId: selectedPoint.toString(),
        data: JSON.stringify(orderData),
      },
    });
  };


  // Render weight option item để tránh lỗi text strings
  const renderWeightOption = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => handleWeightSelect(item)}
    >
      <Text style={styles.modalItemText}>{item} kg</Text>
    </TouchableOpacity>
  );

  // Render collection point item để tránh lỗi text strings
  const renderCollectionPoint = ({ item }: { item: { id: number; address: string } }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => handlePointSelect(item.id)}
    >
      <Text style={styles.modalItemText}>{item.address}</Text>
    </TouchableOpacity>
  );

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

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Chọn khối lượng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn khối lượng</Text>
          {selectedRecycleItems.length > 0 ? (
            selectedRecycleItems.map((item) => (
              <View key={item.id} style={styles.weightItem}>
                <View style={styles.itemInfo}>
                  <Image source={item.image} style={styles.itemImage} />
                  <Text style={styles.itemTitle}>{item.title}</Text>
                </View>
                <TouchableOpacity
                  style={styles.weightSelector}
                  onPress={() => openWeightSelector(item.id)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.weightText}>{weights[item.id]} kg</Text>
                    <Icon name="chevron-down" size={16} color="#067F38" />
                  </View>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Không có vật liệu nào được chọn</Text>
          )}
        </View>

        {/* Hình chụp túi đồ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hình chụp túi đồ</Text>
          <TouchableOpacity style={styles.imageUploader} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.uploadedImage} />
            ) : (
              <Icon name="plus" size={40} color="#AAAAAA" />
            )}
          </TouchableOpacity>
        </View>

        {/* Chọn điểm thu gom */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn địa điểm thu gom</Text>
          <TouchableOpacity
            style={styles.pointSelector}
            onPress={() => setShowPointsModal(true)}
          >
            <Text style={styles.pointText}>{getSelectedPointAddress()}</Text>
            <Icon name="chevron-down" size={16} color="#067F38" />
          </TouchableOpacity>
        </View>

        {/* Ghi chú */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú (nếu có):</Text>
          <TextInput
            style={styles.noteInput}
            multiline
            numberOfLines={4}
            value={note}
            onChangeText={setNote}
            placeholder="Nhập ghi chú ở đây"
            placeholderTextColor="#AAAAAA"
          />
        </View>

        {/* Nút Tiếp */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>TIẾP</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal chọn khối lượng */}
      <Modal
        visible={showWeightModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWeightModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn khối lượng</Text>
            <FlatList
              data={weightOptions}
              keyExtractor={(item) => item}
              renderItem={renderWeightOption}
              ListEmptyComponent={<Text style={styles.emptyText}>Không có lựa chọn</Text>}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowWeightModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal chọn điểm thu gom */}
      <Modal
        visible={showPointsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPointsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn điểm thu gom</Text>
            <FlatList
              data={collectionPoints}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCollectionPoint}
              ListEmptyComponent={<Text style={styles.emptyText}>Không có điểm thu gom</Text>}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPointsModal(false)}
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
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    padding: 15,
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  weightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  weightSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  weightText: {
    fontSize: 14,
    marginRight: 10,
  },
  imageUploader: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  pointSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  pointText: {
    fontSize: 14,
    flex: 1,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#F8F8F8',
    textAlignVertical: 'top',
    height: 120,
  },
  continueButton: {
    backgroundColor: '#34A262',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 20,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
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
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginVertical: 20,
  },
}); 