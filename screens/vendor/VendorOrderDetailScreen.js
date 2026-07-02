import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { colors } from '../../styles/colors';
import { useListings } from '../../context/ListingContext';

const getStatusStyle = (status) => {
  switch (status) {
    case 'Pending':
      return { bg: '#FFF3E0', text: colors.secondary };
    case 'Ready':
      return { bg: '#E8F5E9', text: colors.success };
    case 'Picked Up':
      return { bg: '#F5F5F5', text: colors.grayDark };
    default:
      return { bg: '#F5F5F5', text: colors.grayDark };
  }
};

const VendorOrderDetailScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { order } = route.params || {};
  const { listings } = useListings();

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={[styles.vendorHeader, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.vendorTitle}>Order Not Found</Text>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No order details available.</Text>
        </View>
      </View>
    );
  }

  const statusStyle = getStatusStyle(order.status);
  const listing = listings.find(l => l.id === order.listingId);
  const qrValue = order.qrCode || order.id;

  return (
    <View style={styles.container}>
      <View style={[styles.vendorHeader, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.vendorTitle}>Pickup Details</Text>
          <Text style={styles.vendorSubtitle}>{order.id}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: statusStyle.bg }]}>
          <Ionicons
            name={order.status === 'Pending' ? 'time' : order.status === 'Ready' ? 'checkmark-circle' : 'checkmark-done'}
            size={32}
            color={statusStyle.text}
          />
          <Text style={[styles.statusText, { color: statusStyle.text }]}>{order.status}</Text>
        </View>

        {/* Customer Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={18} color={colors.grayDark} />
            <Text style={styles.detailLabel}>Customer</Text>
            <Text style={styles.detailValue}>{order.customerName || order.customer}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="receipt-outline" size={18} color={colors.grayDark} />
            <Text style={styles.detailLabel}>Order ID</Text>
            <Text style={styles.detailValue}>{order.id}</Text>
          </View>
        </View>

        {/* Order Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          {listing && (
            <>
              <View style={styles.detailRow}>
                <Ionicons name="fast-food-outline" size={18} color={colors.grayDark} />
                <Text style={styles.detailLabel}>Item</Text>
                <Text style={styles.detailValue}>{listing.foodName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="pricetag-outline" size={18} color={colors.grayDark} />
                <Text style={styles.detailLabel}>Price</Text>
                <Text style={styles.detailValue}>{listing.price === 0 ? 'FREE' : `RM${listing.price.toFixed(2)}`}</Text>
              </View>
            </>
          )}
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color={colors.grayDark} />
            <Text style={styles.detailLabel}>Pickup Time</Text>
            <Text style={styles.detailValue}>{order.pickupTime || order.time}</Text>
          </View>
          {order.items && (
            <View style={styles.detailRow}>
              <Ionicons name="cart-outline" size={18} color={colors.grayDark} />
              <Text style={styles.detailLabel}>Items Ordered</Text>
              <Text style={styles.detailValue}>{order.items}</Text>
            </View>
          )}
        </View>

        {/* QR Code Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Customer QR Code</Text>
          <Text style={styles.qrHint}>Ask the customer to show this QR code at pickup</Text>
          <View style={styles.qrContainer}>
            <QRCode value={qrValue} size={180} color={colors.primary} backgroundColor={colors.white} />
            <Text style={styles.qrCodeText}>{qrValue}</Text>
          </View>
        </View>

        {/* Action Button */}
        {order.status !== 'Picked Up' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // TODO: Implement mark as picked up logic
              alert(`Order ${order.id} marked as picked up!`);
            }}
          >
            <Ionicons name="checkmark-circle-outline" size={22} color={colors.white} />
            <Text style={styles.actionButtonText}>Mark as Picked Up</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray },
  vendorHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: { padding: 4, marginRight: 12 },
  headerTextContainer: { flex: 1 },
  vendorTitle: { fontSize: 20, fontWeight: 'bold', color: colors.white },
  vendorSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  scroll: { flex: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 16, color: colors.grayDark },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  statusText: { fontSize: 18, fontWeight: 'bold' },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: 12,
    marginTop: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.dark, marginBottom: 12 },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    gap: 8,
  },
  detailLabel: { fontSize: 14, color: colors.grayDark, flex: 1, marginLeft: 4 },
  detailValue: { fontSize: 14, color: colors.dark, fontWeight: '500', textAlign: 'right' },
  qrHint: { fontSize: 13, color: colors.grayDark, marginBottom: 16, textAlign: 'center' },
  qrContainer: { alignItems: 'center', padding: 16 },
  qrCodeText: {
    fontSize: 12,
    color: colors.grayDark,
    marginTop: 12,
    fontFamily: 'monospace',
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 12,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: { fontSize: 16, fontWeight: '600', color: colors.white },
});

export default VendorOrderDetailScreen;