import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuBar from '../components/menubar';
import { useRouter } from 'expo-router';

const categories = [
  { key: 'fashion', label: 'Thời trang', icon: 'shopping-bag', color: ['#FFD580', '#FFB347'] },
  { key: 'book', label: 'Sách', icon: 'book', color: ['#B5A9FF', '#7C5CFC'] },
  { key: 'lifestyle', label: 'Đời sống', icon: 'gift', color: ['#FFB6A9', '#FF7C7C'] },
  { key: 'health', label: 'Sức khỏe', icon: 'heartbeat', color: ['#A9FFD6', '#5CFCB0'] },
];

const products = [
  {
    id: 1,
    name: 'Túi xách tái chế',
    image: require('../../assets/images/shopping_card.png'),
    points: 129,
    favorite: true,
  },
  {
    id: 2,
    name: 'Túi xách tái chế',
    image: require('../../assets/images/shopping_card.png'),
    points: 129,
    favorite: false,
  },
  {
    id: 3,
    name: 'Túi xách tái chế',
    image: require('../../assets/images/shopping_card.png'),
    points: 129,
    favorite: false,
  },
  {
    id: 4,
    name: 'Túi xách tái chế',
    image: require('../../assets/images/shopping_card.png'),
    points: 129,
    favorite: false,
  },
];

const screenWidth = Dimensions.get('window').width;

export default function ShoppingScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  const renderCategory = (cat: typeof categories[number], idx: number) => (
    <TouchableOpacity
      key={cat.key}
      style={styles.categoryItem}
      onPress={() => setSelectedCategory(cat.key)}
      activeOpacity={0.7}
    >
      <View style={[styles.categoryIcon, { backgroundColor: cat.color[0] }]}> 
        <Icon name={cat.icon} size={24} color="#fff" />
      </View>
      <Text style={styles.categoryLabel}>{cat.label}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: { item: typeof products[number] }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => router.push('/screen/shoppingdetail')}
    >
      <View style={styles.productImageWrapper}>
        <Image source={item.image} style={styles.productImage} resizeMode="cover" />
        <TouchableOpacity style={styles.favoriteIcon}>
          <Icon name="heart" size={20} color={item.favorite ? '#B5A9FF' : '#ccc'} />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPoints}>{item.points} P</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Search Bar + Cart Icon */}
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

        {/* Categories */}
        <View style={styles.categoryRow}>
          {categories.map(renderCategory)}
        </View>

        {/* Product List */}
        <FlatList
          data={products}
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

const cardWidth = (screenWidth - 48) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingTop: 30,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
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
  },
  productImage: {
    width: '100%',
    height: 110,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    elevation: 2,
  },
  productInfo: {
    paddingHorizontal: 10,
    paddingTop: 8,
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
