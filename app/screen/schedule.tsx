import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuBar from '../components/menubar';
import { useRouter } from 'expo-router';

export default function ScheduleScreen() {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  // Data cho các loại vật liệu tái chế
  const recycleItems = [
    { 
      id: 1, 
      title: 'Nhựa', 
      description: 'Chai nhựa, túi nhựa, thùng nhựa,...',
      image: require('../../assets/images/logo2.png')
    },
    { 
      id: 2, 
      title: 'Nhựa', 
      description: 'Chai nhựa, túi nhựa, thùng nhựa,...',
      image: require('../../assets/images/logo2.png')
    },
    { 
      id: 3, 
      title: 'Nhựa', 
      description: 'Chai nhựa, túi nhựa, thùng nhựa,...',
      image: require('../../assets/images/logo2.png')
    },
    { 
      id: 4, 
      title: 'Nhựa', 
      description: 'Chai nhựa, túi nhựa, thùng nhựa,...',
      image: require('../../assets/images/logo2.png')
    },
    { 
      id: 5, 
      title: 'Nhựa', 
      description: 'Chai nhựa, túi nhựa, thùng nhựa,...',
      image: require('../../assets/images/logo2.png')
    },
    { 
      id: 6, 
      title: 'Nhựa', 
      description: 'Chai nhựa, túi nhựa, thùng nhựa,...',
      image: require('../../assets/images/logo2.png')
    },
  ];

  const toggleItemSelection = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

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
                <Text style={styles.cardTitle}>{item.title}</Text>
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
      </ScrollView>

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
    marginTop: 40,
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
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
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
});
