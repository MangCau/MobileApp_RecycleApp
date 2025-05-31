import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants/api';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function Instruction() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const toggleItem = (index: number) => {
    LayoutAnimation.easeInEaseOut();
    setActiveIndex(activeIndex === index ? null : index);
  };

  const fetchMaterials = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('Lỗi', 'Không tìm thấy token.');
        return;
      }

      const response = await axios.get(API_ENDPOINTS.MATERIAL.GET_ALL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data; // Giả sử trả về { data: [...] }
      setMaterials(data);
    } catch (error) {
      console.error('Lỗi tải vật liệu:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu vật liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#067F38" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {materials.map((item, index) => (
        <View key={item.id} style={styles.item}>
          <TouchableOpacity style={styles.header} onPress={() => toggleItem(index)}>
            <View style={styles.leftSection}>
                <Icon name="recycle" size={20} color="#067F38" />
            </View>
            <View style={styles.centerSection}>
                <Text style={styles.title}>{item.category}</Text>
            </View>
            <View style={styles.rightSection}>
                <Icon
                name={activeIndex === index ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#067F38"
                />
            </View>
            </TouchableOpacity>

          {activeIndex === index && (
            <View style={styles.content}>
              <Text style={styles.contentText}>Tổng quan: {item.description}</Text>
              <Text style={styles.contentText}>Hướng dẫn: {item.instruction}</Text>
              <Text style={styles.contentText}>Một số loại vật liệu và điểm quy đổi:</Text>
              {item.types.map((type: any, i: number) => (
                <Text key={i} style={styles.typeText}>
                  - {type.name} ({type.points} điểm)
                  {type.isHazardous ? ' - Nguy hiểm' : ''}
                </Text>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 8,

    paddingVertical: 8,
  },
  item: {
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  
  leftSection: {
    flex: 2, // 20%
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  
  centerSection: {
    flex: 6, // 60%
    justifyContent: 'center',
  },
  
  rightSection: {
    flex: 2, // 20%
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#067F38',
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    // borderColor: '#EBEBEB',
    // borderWidth: 1,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 20,
  },
  leftIcon: {
    marginRight: 10,
  },
  typeText: {
    fontSize: 16,
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
});
