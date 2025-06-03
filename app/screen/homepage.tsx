import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../constants/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants/api';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuBar from '../components/menubar';
import Instruction from '../components/instruction_recycle';
import { useRouter } from 'expo-router';

type RecycleStat = {
  category: string;
  totalKg: number;
  percentage: number;
};

export default function HomeScreen() {
  const router = useRouter();
  const [totalWeight, setTotalWeight] = useState(0);
  const [statisticsData, setStatisticsData] = useState<RecycleStat[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchRecycleStatistics = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const userId = await AsyncStorage.getItem('user_id');
      if (!token) {
        Alert.alert('Lỗi', 'Không tìm thấy token.');
        return;
      }
      if (!userId) throw new Error('User ID not found');

      const response = await axiosInstance.get(API_ENDPOINTS.USER.GET_STAT(userId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      setStatisticsData(data);

      const total = data.reduce((sum: any, item: { totalKg: any; }) => sum + item.totalKg, 0);
      setTotalWeight(total);
    } catch (error) {
      console.error('Failed to fetch recycle statistics:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu thống kê.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecycleStatistics();
  }, []);

  const adjustedStatistics = React.useMemo(() => {
    if (statisticsData.length === 0) return [];

    const adjusted = statisticsData.map((item) => ({
      ...item,
      percentage: Math.round(Number(item.percentage)),
    }));
    const totalBeforeLast = adjusted
      .slice(0, -1)
      .reduce((sum, item) => sum + Math.round(Number(item.percentage)), 0);

    adjusted[adjusted.length - 1] = {
      ...adjusted[adjusted.length - 1],
      percentage: 100 - totalBeforeLast,
    };

    return adjusted;
  }, [statisticsData]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require('../../assets/images/logo2.png')}
          style={styles.titleImage}
          resizeMode="contain"
        />
        <View style={styles.imageWrapper}>
          <Image
            source={require('../../assets/images/circle.png')}
            style={styles.totalImage}
            resizeMode="contain"
          />
          <View style={styles.textOverlay}>
            <Text style={styles.weightNumber}>{totalWeight}</Text>
            <Text style={styles.weightUnit}>Kg</Text>
          </View>
        </View>

        <View style={styles.statisticTable}>
          {adjustedStatistics.map((item, index) => (
            <View key={index} style={styles.statisticRow}>
              <View style={[styles.statisticCell, { flex: 0.5 }]}>
                <Icon name="circle" size={14} color="#B0E8BC" />
              </View>
              <View style={[styles.statisticCell, { flex: 2 }]}>
                <Text style={styles.statisticText}>{item.category}</Text>
              </View>
              <View style={[styles.statisticCell, { flex: 1 }]}>
                <Text style={styles.statisticText}>{item.percentage}%</Text>
              </View>
              <View style={[styles.statisticCell, { flex: 1 }]}>
                <Text style={styles.statisticText}>{item.totalKg}kg</Text>
              </View>
            </View>
          ))}

          {/* Summary row */}
          <View style={[styles.statisticRow, { borderTopWidth: 1, borderColor: '#ccc', marginTop: 6 }]}>
            <View style={[styles.statisticCell, { flex: 0.5 }]} />
            <View style={[styles.statisticCell, { flex: 2 }]} />
            <View style={[styles.statisticCell, { flex: 1 }]}>
              <Text style={[styles.statisticText, { fontWeight: 'bold' }]}>Tổng</Text>
            </View>
            <View style={[styles.statisticCell, { flex: 1 }]}>
              <Text style={[styles.statisticText, { fontWeight: 'bold' }]}>{totalWeight}kg</Text>
            </View>
          </View>
        </View>

        <View style={styles.iconRow}>
          <View style={styles.iconItem}>
            <TouchableOpacity style={styles.iconCircle} onPress={() => router.push('/screen/schedule')}>
              <Icon name="calendar" size={20} color="#B0E8BC" />
            </TouchableOpacity>
            <Text style={styles.iconLabel}>Đặt lịch</Text>
          </View>
          <View style={styles.iconItem}>
            <TouchableOpacity style={styles.iconCircle} onPress={() => router.push('/screen/droppoint')}>
              <Icon name="map-marker" size={20} color="#B0E8BC" />
            </TouchableOpacity>
            <Text style={styles.iconLabel}>Điểm thu gom</Text>
          </View>
          <View style={styles.iconItem}>
            <TouchableOpacity style={styles.iconCircle} onPress={() => router.push('/screen/order_history')}>
              <Icon name="list-alt" size={20} color="#B0E8BC" />
            </TouchableOpacity>
            <Text style={styles.iconLabel}>Đơn thu gom</Text>
          </View>
        </View>

        {/* <TouchableOpacity style={styles.viewOrdersButton} onPress={() => router.push('/screen/order_history')}>
          <Text style={styles.viewOrdersText}>Xem đơn thu gom</Text>
          <Icon name="chevron-right" size={14} color="#067F38" />
        </TouchableOpacity> */}

        <View style={styles.greetingWrapper}>
          <Image
            source={require('../../assets/images/background1.png')}
            style={styles.greetingImage}
            resizeMode="cover"
          />
          <Text style={styles.greetingText}>
            Chào Mr Recycle. Mỗi món đồ bạn tái chế đều giúp ích cho hành tinh của chúng ta. Hãy làm cho ngày hôm nay trở nên có ý nghĩa!
          </Text>
        </View>

        <Text style={styles.text}>Hôm nay bạn tái chế gì?</Text>
        <View>
        <Instruction/>
        </View>
        




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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',

    paddingBottom: 20, 
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  titleImage: {
    width: '65%',
    height: 200,
    alignSelf: 'center',
    marginBottom: 2,
    marginTop: -20,
  },
  imageWrapper: {
    alignSelf: 'center',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
  },
  totalImage: {
    width: 140,
    height: 140,
  },
  textOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weightNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  weightUnit: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  statisticTable: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  statisticRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  statisticCell: {
    flex: 1,
    alignItems: 'center',
  },
  statisticText: {
    fontSize: 12,
  },
  greetingWrapper: {
    position: 'relative',
    width: '100%',
    height: 150, // Adjust based on your image
    marginBottom: 20,

    justifyContent: 'center',
  },
  
  greetingImage: {
    width: '100%',
    borderRadius: 10,
  },
  
  greetingText: {
    position: 'absolute',
    left: 10,
    right: 10,
    fontSize: 16,
    lineHeight: 22,
  },
  text: {
    fontSize: 16,
    left: 10,
    right: 10,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    marginTop: 30,
  },
  
  iconItem: {
    alignItems: 'center',
  },
  
  iconLabel: {
    marginTop: 4,
    fontSize: 14,
    color: '#067F38',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#B0E8BC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewOrdersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingVertical: 10,
  },
  viewOrdersText: {
    color: '#067F38',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 5,
  },
});
