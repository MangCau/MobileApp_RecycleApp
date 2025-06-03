import { View, Text, StyleSheet, ScrollView, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';
import MenuBar from '../components/menubar';
import  { useState, useEffect } from 'react';
import axiosInstance from '../constants/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants/api';
import ProfileHeader from '../components/profileHeader';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router'; 

export default function Management() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const userId = await AsyncStorage.getItem('user_id');

      if (!token || !userId) {
        Alert.alert('Lỗi', 'Không tìm thấy token hoặc userId');
        return;
      }

      const response = await axiosInstance.get(API_ENDPOINTS.USER.GET_BY_ID(userId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserInfo(response.data);
    } catch (error) {
      console.error('Lỗi lấy thông tin người dùng:', error);
      Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng');
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất không?",
      [
        {
          text: "Huỷ",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Đăng xuất",
          onPress: () => {
            // Log out handle here
            console.log("User logged out");
            router.replace('/screen/login') 
          },
          style: "destructive"
        }
      ]
    );
  };

  const sections = [
    { title: 'Thông tin tài khoản', icon: 'user', targetScreen: '/account' },
    { title: 'Giỏ hàng', icon: 'shopping-cart', targetScreen: '/cart' },
    { title: 'Quà đã đổi', icon: 'gift', targetScreen: '/gifts' },
    { title: 'Lịch sử tái chế', icon: 'history', targetScreen: '/recycle-history' },
    { title: 'Video', icon: 'video', targetScreen: '/video' },
    { title: 'Thông báo', icon: 'bell', targetScreen: '/notifications' },
    { title: 'Đăng xuất', icon: 'sign-out', targetScreen: '/logout' },
  ];


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ImageBackground
          source={require('../../assets/images/background2.png')}
          style={styles.bgImage}
          resizeMode="cover"
        >
          {userInfo && (
            <ProfileHeader
              name={userInfo.name}
              id={userInfo.id}
              stats={{
                points: userInfo.totalPoints ?? 0,
                orders: userInfo.totalOrders ?? 0,
                kg: userInfo.totalKg ?? 0,
              }}
            />
          )}
        </ImageBackground>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity onPress={() => router.push('/screen/account')}>
        <View style={styles.manageCard}>
          <Icon name="user" size={20} color="#067F38" />
          <Text style={styles.textCard}>Thông tin tài khoản</Text>
          <Icon name="arrow-right" size={20} color="#067F38" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/screen/shoppingbag')}>
        <View style={styles.manageCard}>
          <Icon name="shopping-cart" size={20} color="#067F38" />
          <Text style={styles.textCard}>Giỏ hàng</Text>
          <Icon name="arrow-right" size={20} color="#067F38" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/screen/gift')}>
        <View style={styles.manageCard}>
          <Icon name="gift" size={20} color="#067F38" />
          <Text style={styles.textCard}>Quà đã đổi</Text>
          <Icon name="arrow-right" size={20} color="#067F38" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/screen/order_history')}>
        <View style={styles.manageCard}>
          <Icon name="history" size={20} color="#067F38" />
          <Text style={styles.textCard}>Lịch sử tái chế</Text>
          <Icon name="arrow-right" size={20} color="#067F38" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {}}>
        <View style={styles.manageCard}>
          <Icon name="video-camera" size={20} color="#067F38" />
          <Text style={styles.textCard}>Video</Text>
          <Icon name="arrow-right" size={20} color="#067F38" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {}}>
        <View style={styles.manageCard}>
          <Icon name="bell" size={20} color="#067F38" />
          <Text style={styles.textCard}>Thông báo</Text>
          <Icon name="arrow-right" size={20} color="#067F38" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity  onPress={handleLogout}>
        <View style={styles.manageCard}>
          <Icon name="sign-out" size={20} color="#FF0000" />
          <Text style={styles.textCard}>Đăng xuất</Text>
          <Icon name="arrow-right" size={20} color="#FF0000" />
        </View>
      </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <MenuBar />
      </View>
    </View>
  );

}

// export const options = {
//   headerShown: false,
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    width: '100%',
    height: 300, 
  },
  bgImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    //paddingHorizontal: 30,
    paddingBottom: 20, 
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
  },

  manageCard: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingVertical: 20, 
    paddingHorizontal: 30,
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd', 
  },
  textCard: {
    fontSize: 16,
  },
});


