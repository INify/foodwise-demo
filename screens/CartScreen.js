import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import Button from '../components/Button';

const CartScreen = ({ route, navigation }) => {
  const { listing, quantity } = route.params || {};
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!listing) return (<View style={styles.emptyContainer}><Text>Cart is empty</Text></View>);

  const totalPrice = listing.price * quantity;
  const isFree = listing.priceTier === 'free';

  const handleConfirmOrder = () => {
    setIsConfirmed(true);
    const qrId = `FOODWISE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    setTimeout(() => {
      navigation.navigate('QRCode', {
        order: { id: qrId, listing, quantity, totalPrice, pickupTime: new Date().toISOString() },
      });
    }, 1000);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.orderSummary}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{listing.foodName}</Text>
              <Text style={styles.itemVendor}>{listing.vendorName}</Text>
              <View style={styles.itemMeta}>
                <Text style={styles.itemQuantity}>× {quantity}</Text>
                {listing.isBlindBox && <View style={styles.blindBoxTag}><Text style={styles.blindBoxTagText}>🎁 Blind Box</Text></View>}
              </View>
            </View>
            <Text style={styles.itemPrice}>{isFree ? 'FREE' : `RM${totalPrice.toFixed(2)}`}</Text>
          </View>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.paymentRow}><Text style={styles.paymentLabel}>Subtotal</Text><Text style={styles.paymentValue}>{isFree ? 'FREE' : `RM${totalPrice.toFixed(2)}`}</Text></View>
          <View style={styles.paymentRow}><Text style={styles.paymentLabel}>Service Fee</Text><Text style={styles.paymentValue}>RM0.00</Text></View>
          <View style={styles.divider} />
          <View style={[styles.paymentRow, styles.totalRow]}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{isFree ? 'FREE' : `RM${totalPrice.toFixed(2)}`}</Text></View>
        </View>

        {!isConfirmed ? (
          <Button title={isFree ? 'Confirm Pickup' : `Pay RM${totalPrice.toFixed(2)}`} onPress={handleConfirmOrder} variant="primary" style={styles.confirmButton} />
        ) : (
          <View style={styles.confirmingContainer}><Ionicons name="checkmark-circle" size={48} color={colors.success} /><Text style={styles.confirmingText}>Processing order...</Text></View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray },
  content: { padding: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  orderSummary: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.dark, marginBottom: 16 },
  itemCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  itemInfo: { flex: 1, marginRight: 12 },
  itemName: { fontSize: 16, fontWeight: '600', color: colors.dark },
  itemVendor: { fontSize: 14, color: colors.grayDark, marginTop: 2 },
  itemMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  itemQuantity: { fontSize: 14, color: colors.grayDark },
  blindBoxTag: { backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginLeft: 8 },
  blindBoxTagText: { fontSize: 12, color: colors.secondary, fontWeight: '500' },
  itemPrice: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
  paymentSection: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  paymentLabel: { fontSize: 14, color: colors.grayDark },
  paymentValue: { fontSize: 14, color: colors.dark },
  divider: { height: 1, backgroundColor: colors.gray, marginVertical: 12 },
  totalRow: { paddingTop: 4 },
  totalLabel: { fontSize: 18, fontWeight: '600', color: colors.dark },
  totalValue: { fontSize: 22, fontWeight: 'bold', color: colors.primary },
  confirmButton: { marginBottom: 20 },
  confirmingContainer: { alignItems: 'center', padding: 20 },
  confirmingText: { fontSize: 16, color: colors.dark, marginTop: 12 },
});

export default CartScreen;
