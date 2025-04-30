import { View, Text, StyleSheet, ScrollView, Image, ImageBackground, TextInput} from 'react-native';
import React, { useState } from 'react';
import MenuBar from '../components/menubar';
import { useRouter } from 'expo-router'; 
import DroppointCard from '../components/droppointCard';

const droppoints = [
  {
    name: 'Eco Drop Zone 1',
    location: '123 Green St, Eco City',
    time: '8:00 AM - 5:00 PM',
    id: 111,
  },
  {
    name: 'Recycle Hub',
    location: '456 Blue Ave, Green Town',
    time: '9:00 AM - 6:00 PM',
    id: 112,
  },
  {
    name: 'Plastic Droppoint',
    location: '789 Red Rd, Cleanville',
    time: '7:30 AM - 4:00 PM',
    id: 113,
  },
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
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
        {droppoints.map((item, index) => (
          <DroppointCard
            key={index}
            name={item.name}
            location={item.location}
            time={item.time}
            id={item.id}
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
