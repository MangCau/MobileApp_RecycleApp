import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter, usePathname } from 'expo-router';

export default function MenuBar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { icon: 'home', route: '/screen/homepage' },
    { icon: 'calendar', route: '/screen/schedule' },
    { icon: 'shopping-cart', route: '/screen/shopping' },
    { icon: 'bars', route: '/screen/management' },
  ] as const;

  return (
    <View style={styles.menuContainer}>
      {menuItems.map((item, index) => {
        const isActive = pathname === item.route;
        return (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => router.push(item.route)}
          >
            <Icon
              name={item.icon}
              size={24}
              color={isActive ? 'green' : '#444'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  menuItem: {
    alignItems: 'center',
  },
});
