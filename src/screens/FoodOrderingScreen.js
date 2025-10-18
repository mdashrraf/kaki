import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      rating: 4.2,
      deliveryTime: '25-35 min',
      icon: 'pizza',
    },
    {
      id: 3,
      name: 'Subway',
      cuisine: 'Sandwiches',
      rating: 4.0,
      deliveryTime: '15-25 min',
      icon: 'subway',
    },
  ];

  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleAddToCart = (item) => {
    setCart([...cart, item]);
    Alert.alert('Added to Cart', `${item.name} has been added to your cart!`);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add some items to your cart first.');
      return;
    }
    Alert.alert('Order Placed', 'Your order has been placed successfully!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Order Food</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Popular Restaurants</Text>
        
        {restaurants.map((restaurant) => (
          <TouchableOpacity
            key={restaurant.id}
            style={[
              styles.restaurantCard,
              selectedRestaurant?.id === restaurant.id && styles.selectedCard
            ]}
            onPress={() => handleRestaurantSelect(restaurant)}
          >
            <View style={styles.restaurantInfo}>
              <Ionicons name={restaurant.icon} size={24} color="#FF6B35" />
              <View style={styles.restaurantDetails}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
                <Text style={styles.restaurantRating}>⭐ {restaurant.rating} • {restaurant.deliveryTime}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {selectedRestaurant && (
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Menu Items</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAddToCart({ name: 'Burger', price: 8.99 })}
            >
              <Text style={styles.menuItemName}>Burger</Text>
              <Text style={styles.menuItemPrice}>$8.99</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAddToCart({ name: 'Fries', price: 3.99 })}
            >
              <Text style={styles.menuItemName}>Fries</Text>
              <Text style={styles.menuItemPrice}>$3.99</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAddToCart({ name: 'Drink', price: 2.99 })}
            >
              <Text style={styles.menuItemName}>Drink</Text>
              <Text style={styles.menuItemPrice}>$2.99</Text>
            </TouchableOpacity>
          </View>
        )}

        {cart.length > 0 && (
          <View style={styles.cartSection}>
            <Text style={styles.sectionTitle}>Cart ({cart.length} items)</Text>
            {cart.map((item, index) => (
              <View key={index} style={styles.cartItem}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemPrice}>${item.price}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantDetails: {
    marginLeft: 15,
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  restaurantRating: {
    fontSize: 12,
    color: '#FF6B35',
    marginTop: 2,
  },
  menuSection: {
    marginTop: 20,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemName: {
    fontSize: 16,
    color: '#333',
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  cartSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  cartItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItemName: {
    fontSize: 16,
    color: '#333',
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  checkoutButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FoodOrderingScreen;