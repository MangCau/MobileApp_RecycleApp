import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuBar from '../components/menubar';
import Instruction from '../components/instruction_recycle';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const statisticsData = [ 
    //fetch data
    { material: 'Nhựa', percent: 2, weight: 2 },
    { material: 'Nhôm', percent: 5, weight: 3 },
    { material: 'Thủy tinh', percent: 5, weight: 10 },
    { material: 'Giấy', percent: 3, weight: 4 },
  ];

  const totalWeight = statisticsData.reduce((sum, item) => sum + item.weight, 0);

  
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
          {statisticsData.map((item, index) => (
            <View key={index} style={styles.statisticRow}>
              <View style={[styles.statisticCell, { flex: 0.5 }]}>
                <Icon name="circle" size={14} color="#B0E8BC" />
              </View>
              <View style={[styles.statisticCell, { flex: 2 }]}>
                <Text style={styles.statisticText}>{item.material}</Text>
              </View>
              <View style={[styles.statisticCell, { flex: 1 }]}>
                <Text style={styles.statisticText}>{item.percent}%</Text>
              </View>
              <View style={[styles.statisticCell, { flex: 1 }]}>
                <Text style={styles.statisticText}>{item.weight}kg</Text>
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
    marginTop: 30,
  },
  imageWrapper: {
    alignSelf: 'center',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalImage: {
    width: 200,
    height: 200,
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
    marginTop: 30,
    paddingHorizontal: 10,
  },
  statisticRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
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
    height: 200, // Adjust based on your image
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
    marginTop: 40,
  },
  
  iconItem: {
    alignItems: 'center',
  },
  
  iconLabel: {
    marginTop: 6,
    fontSize: 14,
    color: '#067F38',
  },
  iconCircle: {
    width: 50,
    height: 50,
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
