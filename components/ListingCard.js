import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/colors';

const ListingCard = ({ listing, onPress }) => {
  const { foodName, vendorName, price, originalPrice, image, expiryTime, isBlindBox, priceTier, distance } = listing;

  const getPriceTagColor = () => {
    if (priceTier === 'free') return colors.success;
    if (priceTier === 'special') return colors.secondary;
    return colors.primary;
  };

  const getPriceLabel = () => {
    if (priceTier === 'free') return 'FREE';
    if (priceTier === 'special') return 'SPECIAL';
    return 'DISCOUNTED';
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: image }} style={styles.image} />
      {isBlindBox && (
        <View style={styles.blindBoxBadge}>
          <Text style={styles.blindBoxText}>🎁 BLIND BOX</Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.foodName} numberOfLines={1}>{foodName}</Text>
          <View style={[styles.priceTag, { backgroundColor: getPriceTagColor() }]}>
            <Text style={styles.priceTagText}>{getPriceLabel()}</Text>
          </View>
        </View>
        <Text style={styles.vendorName}>{vendorName}</Text>
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            {originalPrice > 0 && <Text style={styles.originalPrice}>RM{originalPrice.toFixed(2)}</Text>}
            <Text style={styles.price}>{price === 0 ? 'FREE' : `RM${price.toFixed(2)}`}</Text>
          </View>
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>⏱ {formatTime(expiryTime)}</Text>
            <Text style={styles.metaText}>📍 {distance}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 16, marginHorizontal: 16, marginVertical: 8, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, overflow: 'hidden' },
  image: { width: '100%', height: 180, backgroundColor: colors.gray },
  blindBoxBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: colors.secondary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
  blindBoxText: { color: colors.white, fontWeight: 'bold', fontSize: 12 },
  content: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  foodName: { fontSize: 18, fontWeight: 'bold', color: colors.dark, flex: 1, marginRight: 8 },
  priceTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  priceTagText: { color: colors.white, fontSize: 10, fontWeight: 'bold' },
  vendorName: { fontSize: 14, color: colors.grayDark, marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceContainer: { flexDirection: 'row', alignItems: 'center' },
  originalPrice: { fontSize: 14, color: colors.grayDark, textDecorationLine: 'line-through', marginRight: 8 },
  price: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
  metaContainer: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 12, color: colors.grayDark, marginLeft: 12 },
});

export default ListingCard;
