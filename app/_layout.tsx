import { Stack, useRouter } from 'expo-router';
import "./global.css";
import { Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import ProfileHeader from './components/profileHeader';

export default function Layout() {

  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" backgroundColor="#E5F7EB" translucent={false} />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screen/homepage"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screen/login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screen/register"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screen/schedule"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screen/create_order"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screen/order_details"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screen/confirmation"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screen/order_history"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screen/order_detail_view"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screen/management"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screen/account"
          options={{
            headerShown: true,
            title: "TÀI KHOẢN CỦA TÔI",
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 18,
              color: '#000000',
            },
            headerTintColor: '#067F38',
            headerRight: () => (
              <TouchableOpacity onPress={() => alert('Edit profile')}>
                <Text style={{ fontSize: 16, color: '#067F38', marginRight: 10 }}>Sửa</Text>
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Icon name="chevron-left" size={20} color="#067F38" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="screen/droppoint"
          options={{
            headerShown: true,
            title: "DANH SÁCH ĐIỂM THU GOM",
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 18,
              color: '#000000',
            },
            headerTintColor: '#067F38',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Icon name="chevron-left" size={20} color="#067F38" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="screen/droppointdetail"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      
    </View>
  );
}
