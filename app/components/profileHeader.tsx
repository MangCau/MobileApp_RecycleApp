import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface Stats {
  points: number;
  kg: number;
  orders: number;
}

// Update the interface for ProfileHeader props
interface ProfileHeaderProps {
  name: string;
  id: number; 
  stats: Stats;
}

export default function ProfileHeader({ name, id, stats }: ProfileHeaderProps) {
  return (
    <View style={styles.contentOverlay}>
      <Image
        source={require('../../assets/images/ava.png')}
        style={styles.avaImage}
      />
      <Text style={styles.nameText}>{name}</Text>
      <Text style={styles.idText}>{id}</Text> 

      <View style={styles.statPart}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.points}</Text>
          <Text style={styles.statLabel}>Điểm</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.kg}</Text>
          <Text style={styles.statLabel}>Kg</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.orders}</Text>
          <Text style={styles.statLabel}>Đơn</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentOverlay: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginTop: 50,
  },
  avaImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: '#ccc',
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
  idText: {
    fontSize: 12,
    color: '#333',
    marginTop: 2,
  },
  statPart: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#067F38',
  },
  statLabel: {
    fontSize: 16,
    marginTop: 4,
  },
  separator: {
    width: 1,
    height: 40,
    backgroundColor: '#067F38',
  },
});
