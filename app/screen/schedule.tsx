import React, { useState, useEffect } from 'react';
import axiosInstance from '../constants/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants/api';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuBar from '../components/menubar';
import { useRouter } from 'expo-router';

interface RecycleItem {
  id: number;
  name: string;
  description: string;
  image: any;
}

export default function ScheduleScreen() {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [recycleItems, setRecycleItems] = useState<RecycleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecycleTypes = async (setRecycleItems: (items: RecycleItem[]) => void) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('access_token');
      const response = await axiosInstance.get(`${API_ENDPOINTS.TYPE.GET_ALL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const types = response.data.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.imageUrl && item.imageUrl.trim() !== ''
          ? { uri: item.imageUrl }
          : require('../../assets/images/logo2.png'),
      }));

      setRecycleItems(types);
    } catch (error) {
      console.error('Error fetching recycle items:', error);
    } finally {
    setLoading(false);
  }
  };
  

  const toggleItemSelection = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  useEffect(() => {
    fetchRecycleTypes(setRecycleItems);
  }, []);

  const hasSelectedItems = selectedItems.length > 0;

  const handleRecycle = () => {
    if (hasSelectedItems) {
      // Đảm bảo mảng selectedItems có dữ liệu trước khi truyền
      try {
        const itemsToPass = JSON.stringify(selectedItems);
        router.push({
          pathname: '/screen/create_order',
          params: { selectedItems: itemsToPass }
        });
      } catch (error) {
        console.error('Error serializing selected items:', error);
        // Fallback nếu có lỗi khi chuyển dữ liệu
        router.push('/screen/create_order');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 30 }} />
        <Text style={styles.headerTitle}>TÁI CHẾ</Text>
        <View style={styles.notificationContainer}>
          <Icon name="list-alt" size={24} color="#B0E8BC" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>1</Text>
          </View>
        </View>
      </View>

      <View style={styles.questionBar}>
        <Text style={styles.questionText}>Hôm nay bạn tái chế gì?</Text>
        <TouchableOpacity>
          <Text style={styles.pointsLink}>Cách quy đổi điểm</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.cardsGrid}>
            {recycleItems.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={[
                    styles.card,
                    isSelected && styles.selectedCard
                  ]}
                  onPress={() => toggleItemSelection(item.id)}
                >
                  <Image 
                    source={item.image} 
                    style={styles.cardImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Icon name="check" size={12} color="#ffffff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}
        <TouchableOpacity 
          style={[
            styles.recycleButton,
            !hasSelectedItems && styles.disabledButton
          ]}
          disabled={!hasSelectedItems}
          onPress={handleRecycle}
        >
          <Text style={styles.recycleButtonText}>TÁI CHẾ NGAY</Text>
        </TouchableOpacity>

      <View style={styles.footer}>
        <MenuBar />
      </View>
    </View>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: 'red',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  questionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F3F8F3',
    borderBottomWidth: 1,
    borderBottomColor: '#E5EFE5',
  },
  questionText: {
    fontSize: 16,
  },
  pointsLink: {
    fontSize: 16,
    color: '#FF6B6B',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 30,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  selectedCard: {
    borderColor: '#34A262',
    borderWidth: 2,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#34A262',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  recycleButton: {
    backgroundColor: '#34A262',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
  recycleButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
