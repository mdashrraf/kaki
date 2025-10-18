import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const RideBookingScreen = ({ onBack }) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [rideType, setRideType] = useState('standard');

  const rideTypes = [
    { id: 'standard', name: 'Standard', icon: 'car', price: '$5-10' },
    { id: 'premium', name: 'Premium', icon: 'car-sport', price: '$10-15' },
    { id: 'xl', name: 'XL', icon: 'car', price: '$15-25' },
  ];

  const handleBookRide = () => {
    if (!pickupLocation.trim() || !destination.trim()) {
      Alert.alert('Error', 'Please enter both pickup and destination locations');
      return;
    }

    Alert.alert(
      'Ride Booked!',
      `Your ${rideType} ride from ${pickupLocation} to ${destination} has been booked. Estimated fare: ${rideTypes.find(r => r.id === rideType)?.price}`,
      [
        {
          text: 'OK',
          onPress: () => onBack(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book a Ride</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Pickup Location */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Pickup Location</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location" size={20} color="#FF6B35" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter pickup location"
              value={pickupLocation}
              onChangeText={setPickupLocation}
              placeholderTextColor="#999999"
            />
          </View>
        </View>

        {/* Destination */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Destination</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="flag" size={20} color="#FF6B35" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter destination"
              value={destination}
              onChangeText={setDestination}
              placeholderTextColor="#999999"
            />
          </View>
        </View>

        {/* Ride Type Selection */}
        <View style={styles.rideTypeSection}>
          <Text style={styles.sectionTitle}>Choose Ride Type</Text>
          <View style={styles.rideTypeContainer}>
            {rideTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.rideTypeCard,
                  rideType === type.id && styles.rideTypeCardSelected,
                ]}
                onPress={() => setRideType(type.id)}
              >
                <Ionicons
                  name={type.icon}
                  size={24}
                  color={rideType === type.id ? '#FFFFFF' : '#FF6B35'}
                />
                <Text
                  style={[
                    styles.rideTypeName,
                    rideType === type.id && styles.rideTypeNameSelected,
                  ]}
                >
                  {type.name}
                </Text>
                <Text
                  style={[
                    styles.rideTypePrice,
                    rideType === type.id && styles.rideTypePriceSelected,
                  ]}
                >
                  {type.price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Book Ride Button */}
        <TouchableOpacity style={styles.bookButton} onPress={handleBookRide}>
          <Text style={styles.bookButtonText}>Book Ride</Text>
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
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  rideTypeSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 15,
  },
  rideTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rideTypeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  rideTypeCardSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  rideTypeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
  },
  rideTypeNameSelected: {
    color: '#FFFFFF',
  },
  rideTypePrice: {
    fontSize: 12,
    color: '#666666',
  },
  rideTypePriceSelected: {
    color: '#FFFFFF',
  },
  bookButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RideBookingScreen;
