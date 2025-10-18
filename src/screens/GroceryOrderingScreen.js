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

const GroceryOrderingScreen = ({ onBack }) => {
  const [selectedStore, setSelectedStore] = useState(null);
  const [cart, setCart] = useState([]);

  const groceryStores = [
    {
      id: 1,
      name: 'NTUC FairPrice',
      category: 'Supermarket',
      rating: 4.5,
      deliveryTime: '30-45 min',
      icon: 'storefront',
      color: '#FF6B35',
    },
    {
      id: 2,
      name: 'Cold Storage',
      category: 'Premium',
      rating: 4.3,
      deliveryTime: '25-40 min',
      icon: 'snow',
      color: '#007AFF',
    },
    {
      id: 3,
      name: 'Giant',
      category: 'Hypermarket',
      rating: 4.2,
      deliveryTime: '35-50 min',
      icon: 'business',
      color: '#34C759',
    },
    {
      id: 4,
      name: 'Sheng Siong',
      category: 'Local',
      rating: 4.4,
      deliveryTime: '20-35 min',
      icon: 'home',
      color: '#FF3B30',
    },
  ];

  const popularItems = [
    { id: 1, name: 'Fresh Vegetables', icon: 'leaf', price: '$5-15' },
    { id: 2, name: 'Dairy Products', icon: 'water', price: '$3-12' },
    { id: 3, name: 'Meat & Seafood', icon: 'fish', price: '$8-25' },
    { id: 4, name: 'Bakery Items', icon: 'cafe', price: '$2-8' },
    { id: 5, name: 'Pantry Staples', icon: 'basket', price: '$3-10' },
    { id: 6, name: 'Frozen Foods', icon: 'snow', price: '$4-15' },
  ];

  const handleSelectStore = (store) => {
    setSelectedStore(store);
  };

  const handleAddToCart = (item) => {
    setCart(prev => [...prev, item]);
  };

  const handleOrderGroceries = () => {
    if (!selectedStore) {
      Alert.alert('Error', 'Please select a grocery store first');
      return;
    }

    const cartSummary = cart.length > 0 
      ? `\n\nItems in cart: ${cart.map(item => item.name).join(', ')}`
      : '\n\nYou can browse and add items after selecting the store.';

    Alert.alert(
      'Grocery Order Placed!',
      `Your order from ${selectedStore.name} has been placed. Estimated delivery time: ${selectedStore.deliveryTime}${cartSummary}`,
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
        <Text style={styles.headerTitle}>Order Groceries</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Choose Grocery Store</Text>
        
        {groceryStores.map((store) => (
          <TouchableOpacity
            key={store.id}
            style={[
              styles.storeCard,
              selectedStore?.id === store.id && styles.storeCardSelected,
            ]}
            onPress={() => handleSelectStore(store)}
          >
            <View style={styles.storeInfo}>
              <View style={styles.storeHeader}>
                <View style={[styles.storeIconContainer, { backgroundColor: store.color }]}>
                  <Ionicons name={store.icon} size={20} color="#FFFFFF" />
                </View>
                <View style={styles.storeDetails}>
                  <Text
                    style={[
                      styles.storeName,
                      selectedStore?.id === store.id && styles.storeNameSelected,
                    ]}
                  >
                    {store.name}
                  </Text>
                  <Text
                    style={[
                      styles.storeCategory,
                      selectedStore?.id === store.id && styles.storeCategorySelected,
                    ]}
                  >
                    {store.category}
                  </Text>
                </View>
              </View>
              
              <View style={styles.storeMeta}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text
                    style={[
                      styles.rating,
                      selectedStore?.id === store.id && styles.ratingSelected,
                    ]}
                  >
                    {store.rating}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.deliveryTime,
                    selectedStore?.id === store.id && styles.deliveryTimeSelected,
                  ]}
                >
                  {store.deliveryTime}
                </Text>
              </View>
            </View>
            
            {selectedStore?.id === store.id && (
              <View style={styles.selectedIndicator}>
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Popular Items */}
        {selectedStore && (
          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>Popular Items</Text>
            <View style={styles.itemsGrid}>
              {popularItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemCard}
                  onPress={() => handleAddToCart(item)}
                >
                  <Ionicons name={item.icon} size={24} color="#FF6B35" />
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Cart Summary */}
        {cart.length > 0 && (
          <View style={styles.cartSection}>
            <Text style={styles.sectionTitle}>Cart ({cart.length} items)</Text>
            {cart.map((item, index) => (
              <View key={index} style={styles.cartItem}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <TouchableOpacity onPress={() => setCart(prev => prev.filter((_, i) => i !== index))}>
                  <Ionicons name="trash" size={16} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Order Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.orderButton, !selectedStore && styles.orderButtonDisabled]}
          onPress={handleOrderGroceries}
          disabled={!selectedStore}
        >
          <Text style={styles.orderButtonText}>
            {selectedStore ? `Order from ${selectedStore.name}` : 'Select Store'}
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
  storeCard: {
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
  storeCardSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  storeInfo: {
    flex: 1,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeDetails: {
    marginLeft: 12,
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  storeNameSelected: {
    color: '#FFFFFF',
  },
  storeCategory: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  storeCategorySelected: {
    color: '#FFFFFF',
  },
  storeMeta: {
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
  itemsSection: {
    marginTop: 20,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    marginTop: 8,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
  },
  cartSection: {
    marginTop: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
  },
  cartItemName: {
    fontSize: 14,
    color: '#000000',
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

export default GroceryOrderingScreen;
