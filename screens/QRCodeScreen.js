import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { colors } from '../styles/colors';
import Button from '../components/Button';

const QRCodeScreen = ({ route, navigation }) => {
  const { order } = route.params || {};

  if (!order) return <View style={styles.emptyContainer}><Text>No order found</Text></View>;

  const { id, listing, quantity, totalPrice } = order;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.successHeader}>
          <Ionicons name="checkmark-circle" size={64} color={colors.success} />
          <Text style={styles.successTitle}>Order Confirmed!</Text>
          <Text style={styles.successSubtext}>Show this QR code to the vendor for pickup</Text>
        </View>

        <View style={styles.qrContainer}>
          <QRCode value={id} size={200} color={colors.primary} backgroundColor={colors.white} />
          <Text style={styles.qrCodeText}>Order ID: {id}</Text>
        </View>

        <View style={styles.orderDetails}>
          <Text style={styles.detailsTitle}>Order Details</Text>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Food</Text><Text style={styles.detailValue}>{listing.foodName}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Vendor</Text><Text style={styles.detailValue}>{listing.vendorName}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Quantity</Text><Text style={styles.detailValue}>× {quantity}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Total</Text><Text style={[styles.detailValue, styles.totalPrice]}>{totalPrice === 0 ? 'FREE' : `RM${totalPrice.toFixed(2)}`}</Text></View>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="✅ Simulate Pickup (Demo)" onPress={() => navigation.navigate('Home')} variant="primary" />
          <Button title="🏠 Go Home" onPress={() => navigation.navigate('Home')} variant="outline" style={styles.secondaryButton} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray },
  content: { padding: 16, paddingBottom: 40 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  successHeader: { alignItems: 'center', backgroundColor: colors.white, borderRadius: 16, padding: 24, marginBottom: 16, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: colors.dark, marginTop: 12 },
  successSubtext: { fontSize: 14, color: colors.grayDark, marginTop: 4, textAlign: 'center' },
  qrContainer: { backgroundColor: colors.white, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  qrCodeText: { fontSize: 14, color: colors.grayDark, marginTop: 16, fontFamily: 'monospace' },
  orderDetails: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  detailsTitle: { fontSize: 18, fontWeight: '600', color: colors.dark, marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  detailLabel: { fontSize: 14, color: colors.grayDark },
  detailValue: { fontSize: 14, color: colors.dark, fontWeight: '500' },
  totalPrice: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
  buttonContainer: { marginTop: 8 },
  secondaryButton: { marginTop: 12 },
});

export default QRCodeScreen;
