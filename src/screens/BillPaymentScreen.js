import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const BillPaymentScreen = ({ onBack }) => {
  const [selectedBill, setSelectedBill] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const bills = [
    {
      id: 1,
      name: 'Electricity Bill',
      provider: 'SP Group',
      amount: '$85.50',
      dueDate: 'Dec 15, 2024',
      icon: 'flash',
      color: '#FFD700',
    },
    {
      id: 2,
      name: 'Water Bill',
      provider: 'PUB',
      amount: '$32.20',
      dueDate: 'Dec 20, 2024',
      icon: 'water',
      color: '#007AFF',
    },
    {
      id: 3,
      name: 'Internet Bill',
      provider: 'Singtel',
      amount: '$45.00',
      dueDate: 'Dec 25, 2024',
      icon: 'wifi',
      color: '#34C759',
    },
    {
      id: 4,
      name: 'Mobile Bill',
      provider: 'StarHub',
      amount: '$28.90',
      dueDate: 'Dec 30, 2024',
      icon: 'phone-portrait',
      color: '#FF3B30',
    },
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit Card', icon: 'card' },
    { id: 'paynow', name: 'PayNow', icon: 'phone-portrait' },
    { id: 'bank', name: 'Bank Transfer', icon: 'business' },
  ];

  const handleSelectBill = (bill) => {
    setSelectedBill(bill);
    setAmount(bill.amount.replace('$', ''));
  };

  const handlePayBill = () => {
    if (!selectedBill) {
      Alert.alert('Error', 'Please select a bill to pay');
      return;
    }

    if (!amount.trim()) {
      Alert.alert('Error', 'Please enter payment amount');
      return;
    }

    Alert.alert(
      'Payment Successful!',
      `Your ${selectedBill.name} payment of $${amount} has been processed successfully using ${paymentMethods.find(p => p.id === paymentMethod)?.name}.`,
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
        <Text style={styles.headerTitle}>Pay Bills</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Select Bill to Pay</Text>
        
        {bills.map((bill) => (
          <TouchableOpacity
            key={bill.id}
            style={[
              styles.billCard,
              selectedBill?.id === bill.id && styles.billCardSelected,
            ]}
            onPress={() => handleSelectBill(bill)}
          >
            <View style={styles.billInfo}>
              <View style={styles.billHeader}>
                <View style={[styles.billIconContainer, { backgroundColor: bill.color }]}>
                  <Ionicons name={bill.icon} size={20} color="#FFFFFF" />
                </View>
                <View style={styles.billDetails}>
                  <Text
                    style={[
                      styles.billName,
                      selectedBill?.id === bill.id && styles.billNameSelected,
                    ]}
                  >
                    {bill.name}
                  </Text>
                  <Text
                    style={[
                      styles.billProvider,
                      selectedBill?.id === bill.id && styles.billProviderSelected,
                    ]}
                  >
                    {bill.provider}
                  </Text>
                </View>
              </View>
              
              <View style={styles.billMeta}>
                <Text
                  style={[
                    styles.billAmount,
                    selectedBill?.id === bill.id && styles.billAmountSelected,
                  ]}
                >
                  {bill.amount}
                </Text>
                <Text
                  style={[
                    styles.billDueDate,
                    selectedBill?.id === bill.id && styles.billDueDateSelected,
                  ]}
                >
                  Due: {bill.dueDate}
                </Text>
              </View>
            </View>
            
            {selectedBill?.id === bill.id && (
              <View style={styles.selectedIndicator}>
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Payment Amount */}
        {selectedBill && (
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Payment Amount</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor="#999999"
              />
            </View>
          </View>
        )}

        {/* Payment Method */}
        {selectedBill && (
          <View style={styles.paymentMethodSection}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentMethodContainer}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethodCard,
                    paymentMethod === method.id && styles.paymentMethodCardSelected,
                  ]}
                  onPress={() => setPaymentMethod(method.id)}
                >
                  <Ionicons
                    name={method.icon}
                    size={20}
                    color={paymentMethod === method.id ? '#FFFFFF' : '#FF6B35'}
                  />
                  <Text
                    style={[
                      styles.paymentMethodName,
                      paymentMethod === method.id && styles.paymentMethodNameSelected,
                    ]}
                  >
                    {method.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Pay Button */}
      {selectedBill && (
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.payButton} onPress={handlePayBill}>
            <Text style={styles.payButtonText}>
              Pay ${amount || '0.00'} for {selectedBill.name}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingTop: 80, // Added proper spacing from status bar
    paddingBottom: 16,
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
  billCard: {
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
  billCardSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  billInfo: {
    flex: 1,
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  billIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  billDetails: {
    marginLeft: 12,
    flex: 1,
  },
  billName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  billNameSelected: {
    color: '#FFFFFF',
  },
  billProvider: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  billProviderSelected: {
    color: '#FFFFFF',
  },
  billMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  billAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
  },
  billAmountSelected: {
    color: '#FFFFFF',
  },
  billDueDate: {
    fontSize: 12,
    color: '#666666',
  },
  billDueDateSelected: {
    color: '#FFFFFF',
  },
  selectedIndicator: {
    marginLeft: 10,
  },
  paymentSection: {
    marginTop: 20,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  paymentMethodSection: {
    marginTop: 20,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethodCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  paymentMethodCardSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  paymentMethodName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    marginTop: 8,
    textAlign: 'center',
  },
  paymentMethodNameSelected: {
    color: '#FFFFFF',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  payButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BillPaymentScreen;
