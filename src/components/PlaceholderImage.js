import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const PlaceholderImage = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F5F5F5', '#E8E8E8']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.person}>
            <View style={styles.head} />
            <View style={styles.body} />
          </View>
          <View style={styles.table}>
            <View style={styles.cup} />
            <View style={styles.books} />
          </View>
          <View style={styles.plant} />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    height: height * 0.35,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  person: {
    alignItems: 'center',
    marginBottom: 20,
  },
  head: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D4C5B9',
    marginBottom: 10,
  },
  body: {
    width: 80,
    height: 100,
    backgroundColor: '#E8D5C7',
    borderRadius: 8,
  },
  table: {
    position: 'absolute',
    left: 20,
    bottom: 40,
    alignItems: 'center',
  },
  cup: {
    width: 20,
    height: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
  },
  books: {
    width: 30,
    height: 40,
    backgroundColor: '#8B4513',
    borderRadius: 4,
  },
  plant: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    width: 30,
    height: 40,
    backgroundColor: '#228B22',
    borderRadius: 15,
  },
});

export default PlaceholderImage;
