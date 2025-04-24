import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import MenuBar from '../components/menubar';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text>Droppint</Text>
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
  titleImage: {
    width: '75%',
    height: 200,
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 80,
  },
});
