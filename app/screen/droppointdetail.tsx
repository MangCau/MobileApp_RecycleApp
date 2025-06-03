import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import axiosInstance from '../constants/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants/api';
import { View, Text, StyleSheet, ScrollView, Image, ImageBackground, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import MenuBar from '../components/menubar';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState, useEffect } from 'react';

interface WorkingTime {
  day: string;
  startTime: string;
  endTime: string;
}

interface Contact {
  tel?: string;
  email?: string;
  other?: string;
}

interface Center {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  materials: Material[];
  workingTimes: WorkingTime[];
  contact: Contact;
}
interface Material {
  name: string;
  points: number;
  isHazardous: boolean;
}

export default function DroppointDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [center, setCenter] = useState<Center | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchCenterById = async (id: string) => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const userId = await AsyncStorage.getItem('user_id');

        if (!userId || !token) {
          Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng hoặc token');
          return;
        }
        const res = await axiosInstance.get(API_ENDPOINTS.CENTER.GET_BY_ID(id));
        return res.data;
      } catch (error) {
        console.error("Lỗi khi fetch center:", error);
        throw error;
      }
    };

    useEffect(() => {
      if (!id) return;
      const loadData = async () => {
        try {
          const data = await fetchCenterById(id as string);
          setCenter(data);
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu:", error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00bfff" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }
  if (!center) return <Text>Không tìm thấy điểm thu gom.</Text>;

  const { name, address, imageUrl, materials, contact, workingTimes } = center;

  const dayMap: { [key: string]: string } = {
    Monday: 'T2',
    Tuesday: 'T3',
    Wednesday: 'T4',
    Thursday: 'T5',
    Friday: 'T6',
    Saturday: 'T7',
    Sunday: 'CN',
  };

  const formattedTime = workingTimes
    .map(w => {
      const days = w.day.split('-').map(d => dayMap[d] || d).join(' - ');
      const start = new Date(w.startTime).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
      const end = new Date(w.endTime).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });

      return `${days}: ${start} - ${end}`;
    })
    .join('\n');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ImageBackground
                  source={imageUrl
                    ? { uri: imageUrl }
                    : require('../../assets/images/droppoint.jpg')}
                    style={styles.droppointImage}
                    resizeMode="cover"
                  >
                    <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
                        <Icon name="chevron-left" size={20} color="#067F38" />
                    </TouchableOpacity>
                </ImageBackground>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.nameDroppoint}>{name}</Text>
                <View style={styles.card}>
                    <View style={styles.location}>
                        <View style={styles.time}>
                            <Text style={styles.titleText}>Địa điểm</Text>
                        </View>
                        
                        <View style={styles.time}>
                            <Image
                                source={require('../../assets/images/mapimg.png')}
                                style={styles.mapImage}
                            />
                            <Text style={styles.detailText} numberOfLines={4} ellipsizeMode="tail">{address}</Text>
                        </View>
                    </View>
                    <View style={styles.time}>
                        <Text style={styles.titleText}>Thời gian mở cửa</Text>
                        <Text style={styles.detailText} numberOfLines={4} ellipsizeMode="tail">{formattedTime}</Text>
                    </View>
                </View>
                <View style={styles.card}>
                    <Text style={styles.titleText2}>Một số thông tin</Text>
                    <Text style={styles.titleText}>Các loại vật liệu thu gom</Text>
                    <View style={styles.cardDetail}>
                        {materials.map((material, index) => (
                            <Text key={index} style={styles.cardDetailText}>
                            {index + 1}. {material.name}
                            </Text>
                        ))}
                    </View>
                    <Text style={styles.titleText}>Thông tin liên hệ</Text>
                    <View style={styles.cardDetail}>
                        <Text style={styles.cardDetailText}>Số điện thoại: {contact?.tel || 'Không có'}</Text>
                        <Text style={styles.cardDetailText2}>Email: {contact?.email || 'Không có'}</Text>
                    </View>
                    <Text style={styles.titleText}>Thông tin khác</Text>
                    <View style={styles.cardDetail}>
                        <Text style={styles.cardDetailText3}>{contact?.other || 'Không có'}</Text>
                    </View>
                    
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
    paddingHorizontal: 30,
    paddingBottom: 20, 
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  header: {
    width: '100%',
    height: 250, 
  },
  droppointImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 30,
  },
  nameDroppoint: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#067F38',
    marginTop: 20,
    marginBottom: 20,
  },
  mapImage: {
    width: 60,
    height: 40,
    borderRadius: 8,
    marginRight: 50,
},
  card: {
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd', 
  },
  titleText: {
    fontSize: 16,
    marginBottom: 10,
  },
  titleText2: {
    fontSize: 16,
    marginBottom: 10,
    color:'#067F38',
    marginTop: 10,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 16,
    color: '#727171',
    flexShrink: 1,
 
  },
  location:{
    marginBottom: 10,
  },
  time: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginVertical: 5,
  },
  cardDetail: {
    marginBottom: 10,
    marginLeft: 20,
  },
  cardDetailText: {
    fontSize: 16,
    color: '#727171',
  },
  cardDetailText2: {
    fontSize: 16,
    color: '#727171',
    marginTop: 10,
  },
  cardDetailText3: {
    fontSize: 16,
    color: '#727171',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

