import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
type DroppointCardProps = {
    name: string;
    location: string;
    days: string;
    id: number;
    imageUrl?: string;
};

const screenWidth = Dimensions.get('window').width;

export default function DroppointCard({ name, location, days, id, imageUrl }: DroppointCardProps) {


    const router = useRouter();

    const handlePress = () => {
        router.push({
            pathname: '/screen/droppointdetail',
            params: { id: String(id) },
          });
      };
    

    return (
        <TouchableOpacity onPress={handlePress} style={styles.droppointCard}>
            <View style={styles.imgPart}>
                <Image
                    source={
                        imageUrl
                            ? { uri: imageUrl }
                            : require('../../assets/images/droppoint.jpg')
                    }   
                    style={styles.image}
                />
            </View>

            <View style={styles.infoPart}>
                <Text style={styles.nameText}>{name}</Text>
                <View style={styles.detail}>
                    <Icon name="map-marker" size={20} color="#9F9898" style={styles.icon} />
                    <Text style={styles.detailText}>{location}</Text>
                </View>
                <View style={styles.detail}>
                    <Icon name="clock-o" size={20} color="#9F9898" style={styles.icon} />
                    <Text style={styles.detailText}>{days}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    droppointCard: {
        width: screenWidth - 32,
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginVertical: 8,
        alignItems: 'center',
        alignSelf: 'center',
    },
    imgPart: {
        flex: 3,
        marginRight: 10,
    },
    image: {
        width: 90,
        height: 70,
        borderRadius: 8,
    },
    infoPart: {
        flex: 7,
        justifyContent: 'flex-start',
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#067F38',
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    icon: {
        marginRight: 10,
    },
    detailText: {
        fontSize: 14,
        color: '#555',
        flexShrink: 1,
    },
});
