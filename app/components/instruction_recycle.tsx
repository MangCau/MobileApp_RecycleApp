import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const instructions = [
  { title: 'Item 1', content: 'Hướng dẫn tái chế cho vật liệu 1...' },
  { title: 'Item 2', content: 'Hướng dẫn tái chế cho vật liệu 2...' },
  { title: 'Item 3', content: 'Hướng dẫn tái chế cho vật liệu 3...' },
];

export default function Instruction() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    LayoutAnimation.easeInEaseOut();
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      {instructions.map((item, index) => (
        <View key={index} style={styles.item}>
          <TouchableOpacity style={styles.header} onPress={() => toggleItem(index)}>
            <View style={styles.leftSection}>
                <Icon name="recycle" size={20} color="#067F38" />
            </View>
            <View style={styles.centerSection}>
                <Text style={styles.title}>{item.title}</Text>
            </View>
            <View style={styles.rightSection}>
                <Icon
                name={activeIndex === index ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#067F38"
                />
            </View>
            </TouchableOpacity>

          {activeIndex === index && (
            <View style={styles.content}>
              <Text style={styles.contentText}>{item.content}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 8,

    paddingVertical: 8,
  },
  item: {
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  
  leftSection: {
    flex: 2, // 20%
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  
  centerSection: {
    flex: 6, // 60%
    justifyContent: 'center',
  },
  
  rightSection: {
    flex: 2, // 20%
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#067F38',
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    // borderColor: '#EBEBEB',
    // borderWidth: 1,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 20,
  },
  leftIcon: {
    marginRight: 10,
  },
  
});
