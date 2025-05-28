import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuBar from '../components/menubar';
import { useRouter } from 'expo-router';

const product = {
  id: 1,
  name: 'TÚI XÁCH TÁI CHẾ',
  image: require('../../assets/images/shopping_card.png'),
  points: 129,
  favorite: false,
  description:
    'Túi tone là một trào lưu thời trang đang ngày càng được yêu thích vì độ tiện lợi của mẫu túi này. Bạn có thể tận dụng chiếc túi tone để đi chợ, đi học, đi làm,... Tuy nhiên, việc mua túi mới có thể gây lãng phí và tăng thêm lượng rác thải từ quần áo cũ. Vậy tại sao chúng ta không tận dụng những quần jeans cũ và biến chúng thành những chiếc túi tone độc đáo?',
};

const screenWidth = Dimensions.get('window').width;

export default function ShoppingDetail() {
  const [isFavorite, setIsFavorite] = useState(product.favorite);
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
          <Icon name="chevron-left" size={24} color="#067F38" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{product.name}</Text>
        <TouchableOpacity style={styles.cartIconWrapper} onPress={() => router.push('/screen/shoppingbag')}>
          <Icon name="shopping-bag" size={22} color="#067F38" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageWrapper}>
          <Image source={product.image} style={styles.productImage} resizeMode="cover" />
        </View>

        {/* Product Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.productName}>{product.name}</Text>
            <TouchableOpacity onPress={() => setIsFavorite(fav => !fav)}>
              <Icon name="heart" size={28} color={isFavorite ? '#B5A9FF' : '#ccc'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.productPoints}>{product.points} P</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>
      </ScrollView>

      {/* Redeem Button */}
      <View style={styles.redeemWrapper}>
        <TouchableOpacity style={styles.redeemButton}>
          <Text style={styles.redeemText}>ĐỔI THƯỞNG</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Menu */}
      <View style={styles.footer}>
        <MenuBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingHorizontal: 18,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    textAlign: 'center',
    marginLeft: -40, // visually center between icons
  },
  cartIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 0,
    alignItems: 'center',
    paddingBottom: 20,
  },
  imageWrapper: {
    width: screenWidth,
    height: 180,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: screenWidth,
    height: 180,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: -30,
    marginHorizontal: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    width: screenWidth - 40,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
  },
  productPoints: {
    fontSize: 16,
    color: '#067F38',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 15,
    color: '#888',
    marginTop: 8,
    lineHeight: 22,
  },
  redeemWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  redeemButton: {
    backgroundColor: '#B5EACB',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  redeemText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
});

