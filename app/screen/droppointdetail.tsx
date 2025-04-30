import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Image, ImageBackground, TouchableOpacity } from 'react-native';
import MenuBar from '../components/menubar';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

const data = {
    name: "LimLoop",
    location: "123 Đường ABC, Quận Bình Thạnh, TP.HCM",
    time: "8:00 - 17:00 từ Thứ 2 đến Thứ 7",
    materials: ["Nhựa", "Nhôm", "Thủy Tinh"],
    phonenumber: "0123 456 789",
    email: "recycle@example.com",
    moreinfo: "Vui lòng gọi điện trước khi đến.",
    image: require('../../assets/images/droppoint.jpg') // replace with your image path
  };

export default function DroppointDetail() {

    const { id } = useLocalSearchParams();
    const router = useRouter();

    const {
        name,
        location,
        time,
        materials,
        phonenumber,
        email,
        moreinfo,
        image
      } = data;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ImageBackground
                  source={image}
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
                            <Text style={styles.detailText} numberOfLines={4} ellipsizeMode="tail">{location}</Text>
                        </View>
                    </View>
                    <View style={styles.time}>
                        <Text style={styles.titleText}>Thời gian</Text>
                        <Text style={styles.detailText} numberOfLines={4} ellipsizeMode="tail">{time}</Text>
                    </View>
                </View>
                <View style={styles.card}>
                    <Text style={styles.titleText2}>Một số thông tin</Text>
                    <Text style={styles.titleText}>Các loại vật liệu thu gom</Text>
                    <View style={styles.cardDetail}>
                        {materials.map((material, index) => (
                            <Text key={index} style={styles.cardDetailText}>
                            {index + 1}. {material}
                            </Text>
                        ))}
                    </View>
                    <Text style={styles.titleText}>Thông tin liên hệ</Text>
                    <View style={styles.cardDetail}>
                        <Text style={styles.cardDetailText}>Số điện thoại: {phonenumber}</Text>
                        <Text style={styles.cardDetailText2}>Email: {email}</Text>
                    </View>
                    <Text style={styles.titleText}>Thông tin khác</Text>
                    <View style={styles.cardDetail}>
                        <Text style={styles.cardDetailText3}>{moreinfo}</Text>
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
});
