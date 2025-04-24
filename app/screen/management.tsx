import { View, Text, StyleSheet } from 'react-native';
import MenuBar from '../components/menubar';

export default function HomeScreen() {
  return (
          <View style={styles.container}>
                      
                      <View style={styles.content}>
                        <Text>Account</Text>
                      </View>
          
                      {/* Menu bar */}
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
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
  }
});
