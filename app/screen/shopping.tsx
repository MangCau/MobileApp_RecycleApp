import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants/api';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuBar from '../components/menubar';
import { useRouter } from 'expo-router';

const categories = [
  { key: 'fashion', label: 'Thời trang', icon: 'shopping-bag', color: ['#FFD580', '#FFB347'] },
  { key: 'book', label: 'Sách', icon: 'book', color: ['#B5A9FF', '#7C5CFC'] },
  { key: 'lifestyle', label: 'Đời sống', icon: 'gift', color: ['#FFB6A9', '#FF7C7C'] },
  { key: 'health', label: 'Sức khỏe', icon: 'heartbeat', color: ['#A9FFD6', '#5CFCB0'] },
];

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 2;

export default function ShoppingScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchRewards = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const userId = await AsyncStorage.getItem('user_id');

      if (!userId || !token) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng hoặc token');
        return;
      }

      const response = await axios.get(API_ENDPOINTS.REWARD.GET_ALL + `?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { data } = response.data;
      setProducts(data);
    } catch (error: any) {
      console.error('Lỗi lấy danh sách phần thưởng:', error?.response?.data || error.message);
      Alert.alert('Lỗi', error?.response?.data?.message || 'Không thể tải danh sách phần thưởng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const filteredProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];

    const filtered = list.filter(item => {
      const matchCategory = selectedCategory ? item.type === selectedCategory : true;
      const matchSearch = search.trim()
        ? item.name.toLowerCase().includes(search.trim().toLowerCase())
        : true;
      return matchCategory && matchSearch;
    });

    return filtered.sort((a, b) => (b.isFavorite === true ? 1 : 0) - (a.isFavorite === true ? 1 : 0));
  }, [products, selectedCategory, search]);

  const renderCategory = (cat: typeof categories[number]) => (
    <TouchableOpacity
      key={cat.key}
      style={styles.categoryItem}
      onPress={() => setSelectedCategory(cat.key === selectedCategory ? null : cat.key)}
      activeOpacity={0.7}
    >
      <View style={[styles.categoryIcon, { backgroundColor: cat.color[0] }]}>
        <Icon name={cat.icon} size={24} color="#fff" />
      </View>
      <Text style={[styles.categoryLabel, selectedCategory === cat.key && { color: '#000' }]}>
        {cat.label}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: { item: typeof products[number] }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push({ pathname: '/screen/shoppingdetail', params: { id: item.id } })}
    >
      <View style={styles.productImageWrapper}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.productImage}
          resizeMode="contain"
        />
        <TouchableOpacity 
          style={styles.favoriteIcon}
          onPress={() => handleToggleFavorite(item.id)}
        >
          <Icon name="heart" size={20} color={item.isFavorite ? '#B5A9FF' : '#ccc'} />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPoints}>{item.points} P</Text>
      </View>
    </TouchableOpacity>
  );

  const handleToggleFavorite = async (rewardId: number) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const userId = await AsyncStorage.getItem('user_id');

      if (!userId || !token) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng hoặc token');
        return;
      }

      const res = await fetch(API_ENDPOINTS.REWARD.TOGGLE_FAVORITE(userId, rewardId), {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === rewardId
            ? { ...product, isFavorite: data.status === 'added' }
            : product
        )
      );
    } catch (error) {
      console.error('Lỗi toggle yêu thích:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật yêu thích.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Tìm kiếm + Giỏ hàng */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Icon name="search" size={18} color="#888" style={{ marginLeft: 10 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm"
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#888"
            />
          </View>
          <TouchableOpacity style={styles.cartIconWrapper} onPress={() => router.push('/screen/shoppingbag')}>
            <Icon name="shopping-bag" size={22} color="#4AC37A" />
          </TouchableOpacity>
        </View>

        {/* Danh mục */}
        <View style={styles.categoryRow}>
          {categories.map(renderCategory)}
        </View>

        {/* Danh sách sản phẩm */}
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={{ paddingBottom: 20 }}
          scrollEnabled={false}
          
        />
      </ScrollView>
      <View style={styles.footer}>
        <MenuBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingTop: 30, paddingHorizontal: 12, paddingBottom: 10 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    flex: 1,
    height: 44,
    paddingHorizontal: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    marginLeft: 8,
  },
  cartIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#C6F3D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  categoryItem: {
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    width: cardWidth,
    marginBottom: 8,
    marginHorizontal: 4,
    paddingBottom: 8,
  },
  productImageWrapper: {
    position: 'relative',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 120,
    marginTop: 24,
    resizeMode: 'contain',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 3,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    zIndex: 2,
    elevation: 2,
  },
  productInfo: {
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  productName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    marginBottom: 2,
  },
  productPoints: {
    fontSize: 13,
    color: '#888',
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
});
