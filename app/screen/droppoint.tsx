import { View, Text, StyleSheet, ScrollView, Image, ImageBackground, TextInput, Alert} from 'react-native';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../constants/axiosInstance';
import { API_ENDPOINTS } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuBar from '../components/menubar';
import { useRouter } from 'expo-router'; 
import DroppointCard from '../components/droppointCard';

const dayMap = {
    Monday: 'T2',
    Tuesday: 'T3',
    Wednesday: 'T4',
    Thursday: 'T5',
    Friday: 'T6',
    Saturday: 'T7',
    Sunday: 'CN',
} as const;

type DayKey = keyof typeof dayMap;

type CenterType = {
  id: number;
  name: string;
  address: string;
  imageUrl?: string;
  days: string;
};
type WorkingDay = {
  day: string;
  startTime: string;
  endTime: string;
};
type RawCenterType = {
  id: number;
  name: string;
  address: string;
  imageUrl?: string;
  days: WorkingDay[];
};
export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [centers, setCenters] = useState<CenterType[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<CenterType[]>([]);

  
  const fetchCenters = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const userId = await AsyncStorage.getItem('user_id');

      if (!token || !userId) {
        Alert.alert('Lỗi', 'Không tìm thấy token hoặc user ID');
        throw new Error('Missing token or user ID');
      }

      const res = await axiosInstance.get(API_ENDPOINTS.CENTER.GET_ALL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      console.error('Lỗi khi fetch centers:', error);
      throw error;
    }
  };

  const fetchAllCenters = async () => {
    const result = await fetchCenters();
    return result.data.map((center: RawCenterType): CenterType => ({
      name: center.name,
      address: center.address,
      days: formatWorkingDays(center.days),
      id: center.id,
      imageUrl: center.imageUrl,
    }));
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const formatted = await fetchAllCenters();
        setCenters(formatted);
      } catch (error) {
        console.error('Failed to fetch centers:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredCenters(centers);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = centers.filter(center =>
        center.name.toLowerCase().includes(lowerSearch)
      );
      setFilteredCenters(filtered);
    }
  }, [search, centers]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background2.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <TextInput
            placeholder="Tìm kiếm"
            placeholderTextColor="#aaa"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </ImageBackground>
                
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredCenters.map((item, index) => (
          <DroppointCard
            key={index}
            name={item.name}
            location={item.address}
            days={item.days}
            id={item.id}
            imageUrl={item.imageUrl}
          />
        ))}
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
    paddingHorizontal: 30,
    paddingBottom: 20, 
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  bgImage: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    height: 40,
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 14,
    borderColor: '#ffffff',
    borderWidth: 1,
  },
});
