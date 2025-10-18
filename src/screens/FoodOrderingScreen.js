import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FoodOrderingScreen = ({ onBack }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);

  const restaurants = [
    {
      id: 1,
      name: 'McDonald\'s',
      cuisine: 'Fast Food',
      rating: 4.5,
      deliveryTime: '20-30 min',
      icon: 'restaurant',
    },
    {
      id: 2,
      name: 'Pizza Hut',
      cuisine: 'Italian',
      rating: 4.3,
      deliveryTime: '25-35 min',
      icon: 'pizza',
    },
    {
      id: 3,
      name: 'KFC',
      cuisine: 'Chicken',
      rating: 4.2,
      deliveryTime: '15-25 min',
      icon: 'restaurant',
    },
    {
      id: 4,
      name: 'Subway',
      cuisine: 'Sandwiches',
      rating: 4.4,
      deliveryTime: '10-20 min',
      icon: 'fast-food',
    },
  ];

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleOrderFood = () => {
    if (!selectedRestaurant) {
      Alert.alert('Error', 'Please select a restaurant first');
      return;
    }

    Alert.alert(
      'Order Placed!',
      `Your order from ${selectedRestaurant.name} has been placed. Estimated delivery time: ${selectedRestaurant.deliveryTime}`,
      [
        {
          text: 'OK',
          onPress: () => onBack(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Food</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Choose Restaurant</Text>
        
        {restaurants.map((restaurant) => (
          <TouchableOpacity
            key={restaurant.id}
            style={[
              styles.restaurantCard,
              selectedRestaurant?.id === restaurant.id && styles.restaurantCardSelected,
            ]}
            onPress={() => handleSelectRestaurant(restaurant)}
          >
            <View style={styles.restaurantInfo}>
              <View style={styles.restaurantHeader}>
                <Ionicons
                  name={restaurant.icon}
                  size={24}
                  color={selectedRestaurant?.id === restaurant.id ? '#FFFFFF' : '#FF6B35'}
                />
                <View style={styles.restaurantDetails}>
                  <Text
                    style={[
                      styles.restaurantName,
                      selectedRestaurant?.id === restaurant.id && styles.restaurantNameSelected,
                    ]}
                  >
                    {restaurant.name}
                  </Text>
                  <Text
                    style={[
                      styles.restaurantCuisine,
                      selectedRestaurant?.id === restaurant.id && styles.restaurantCuisineSelected,
                    ]}
                  >
                    {restaurant.cuisine}
                  </Text>
                </View>
              </View>
              
              <View style={styles.restaurantMeta}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text
                    style={[
                      styles.rating,
                      selectedRestaurant?.id === restaurant.id && styles.ratingSelected,
                    ]}
                  >
                    {restaurant.rating}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.deliveryTime,
                    selectedRestaurant?.id === restaurant.id && styles.deliveryTimeSelected,
                  ]}
                >
                  {restaurant.deliveryTime}
                </Text>
              </View>
            </View>
            
            {selectedRestaurant?.id === restaurant.id && (
              <View style={styles.selectedIndicator}>
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Order Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.orderButton, !selectedRestaurant && styles.orderButtonDisabled]}
          onPress={handleOrderFood}
          disabled={!selectedRestaurant}
        >
          <Text style={styles.orderButtonText}>
            {selectedRestaurant ? `Order from ${selectedRestaurant.name}` : 'Select Restaurant'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 15,
  },
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  restaurantCardSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantDetails: {
    marginLeft: 12,
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  restaurantNameSelected: {
    color: '#FFFFFF',
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  restaurantCuisineSelected: {
    color: '#FFFFFF',
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 4,
    fontWeight: '500',
  },
  ratingSelected: {
    color: '#FFFFFF',
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666666',
  },
  deliveryTimeSelected: {
    color: '#FFFFFF',
  },
  selectedIndicator: {
    marginLeft: 10,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  orderButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  orderButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FoodOrderingScreen;
