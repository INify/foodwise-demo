import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/colors';

const ListingCard = ({ listing, onPress, debugMode, compact = false }) => {
  const { foodName, vendorName, price, originalPrice, image, pickupStart, pickupEnd, isBlindBox, priceTier, distance, quantity } = listing;

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

  const formatTimeRange = (start, end) => {
    const startStr = formatTime(start);
    const endStr = formatTime(end);
    return `${startStr} - ${endStr}`;
  };

  const isExpired = () => {
    if (debugMode) return false;
    if (!pickupEnd) return false;
    return new Date() > new Date(pickupEnd);
  };

  const expired = isExpired();
  const outOfStock = quantity === 0;
  const isDisabled = expired || outOfStock;

  // Compact mode styles
  if (compact) {
    return (
      <TouchableOpacity 
        style={[styles.compactCard, isDisabled && styles.cardExpired]} 
        onPress={onPress} 
        activeOpacity={0.8} 
        disabled={isDisabled}
      >
        <Image 
          source={typeof image === 'string' ? { uri: image } : image} 
          style={styles.compactImage}
          resizeMode={isBlindBox ? 'contain' : 'cover'}
        />
        {isBlindBox && (
          <View style={styles.compactBlindBoxBadge}>
            <Text style={styles.compactBlindBoxText}>🎁</Text>
          </View>
        )}
        {(expired || outOfStock) && (
          <View style={styles.compactStatusOverlay}>
            <Text style={styles.compactStatusText}>{expired ? 'EXPIRED' : 'SOLD'}</Text>
          </View>
        )}
        <View style={styles.compactContent}>
          <Text style={styles.compactFoodName} numberOfLines={1}>{foodName}</Text>
          <Text style={styles.compactVendorName} numberOfLines={1}>{vendorName}</Text>
          <View style={styles.compactFooter}>
            <View style={styles.compactPriceContainer}>
              {originalPrice > 0 && <Text style={styles.compactOriginalPrice}>RM{originalPrice.toFixed(2)}</Text>}
              <Text style={styles.compactPrice}>{price === 0 ? 'FREE' : `RM${price.toFixed(2)}`}</Text>
            </View>
            <View style={[styles.compactPriceTag, { backgroundColor: getPriceTagColor() }]}>
              <Text style={styles.compactPriceTagText}>{getPriceLabel()}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Full mode (original)
  return (
    <TouchableOpacity style={[styles.card, isDisabled && styles.cardExpired]} onPress={onPress} activeOpacity={0.8} disabled={isDisabled}>
      <Image 
        source={typeof image === 'string' ? { uri: image } : image} 
        style={[styles.image, isBlindBox && styles.blindBoxImage]}
        resizeMode={isBlindBox ? 'contain' : 'cover'}
      />
      {isBlindBox && (
        <View style={styles.blindBoxBadge}>
          <Text style={styles.blindBoxText}>🎁 BLIND BOX</Text>
        </View>
      )}
      {expired && (
        <View style={styles.expiredOverlay}>
          <Text style={styles.expiredText}>EXPIRED</Text>
        </View>
      )}
      {outOfStock && !expired && (
        <View style={styles.soldOutOverlay}>
          <Text style={styles.soldOutText}>SOLD OUT</Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.foodName, expired && styles.textExpired]} numberOfLines={1}>{foodName}</Text>
          <View style={[styles.priceTag, { backgroundColor: getPriceTagColor() }]}>
            <Text style={styles.priceTagText}>{getPriceLabel()}</Text>
          </View>
        </View>
        <Text style={[styles.vendorName, expired && styles.textExpired]}>{vendorName}</Text>
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            {originalPrice > 0 && <Text style={styles.originalPrice}>RM{originalPrice.toFixed(2)}</Text>}
            <Text style={styles.price}>{price === 0 ? 'FREE' : `RM${price.toFixed(2)}`}</Text>
          </View>
          <View style={styles.metaContainer}>
            {pickupStart && pickupEnd && (
              <Text style={[styles.metaText, expired && styles.textExpired]}>⏱ {formatTimeRange(pickupStart, pickupEnd)}</Text>
            )}
            <Text style={[styles.metaText, expired && styles.textExpired]}>📍 {distance}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // ===== FULL MODE STYLES =====
  card: { 
    backgroundColor: colors.white, 
    borderRadius: 16, 
    marginHorizontal: 16, 
    marginVertical: 8, 
    shadowColor: colors.shadow, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 4, 
    overflow: 'hidden' 
  },
  cardExpired: { opacity: 0.6 },
  image: { width: '100%', height: 180, backgroundColor: colors.gray },
  blindBoxImage: { backgroundColor: '#FFF3E0' },
  blindBoxBadge: { 
    position: 'absolute', 
    top: 12, 
    right: 12, 
    backgroundColor: colors.secondary, 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20, 
    shadowColor: colors.shadow, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4, 
    elevation: 5 
  },
  blindBoxText: { color: colors.white, fontWeight: 'bold', fontSize: 12 },
  expiredOverlay: { 
    position: 'absolute', 
    top: 12, 
    left: 12, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12 
  },
  expiredText: { color: colors.white, fontWeight: 'bold', fontSize: 11 },
  content: { padding: 16 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 4 
  },
  foodName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: colors.dark, 
    flex: 1, 
    marginRight: 8 
  },
  textExpired: { color: colors.grayDark },
  priceTag: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  priceTagText: { 
    color: colors.white, 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  vendorName: { 
    fontSize: 14, 
    color: colors.grayDark, 
    marginBottom: 12 
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  priceContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  originalPrice: { 
    fontSize: 14, 
    color: colors.grayDark, 
    textDecorationLine: 'line-through', 
    marginRight: 8 
  },
  price: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: colors.primary 
  },
  metaContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  metaText: { 
    fontSize: 12, 
    color: colors.grayDark, 
    marginLeft: 12 
  },
  soldOutOverlay: { 
    position: 'absolute', 
    top: 12, 
    left: 12, 
    backgroundColor: colors.danger, 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12 
  },
  soldOutText: { 
    color: colors.white, 
    fontWeight: 'bold', 
    fontSize: 11 
  },

  // ===== COMPACT MODE STYLES =====
  compactCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    flex: 1,
  },
  compactImage: {
    width: '100%',
    height: 100,
    backgroundColor: colors.gray,
  },
  compactBlindBoxBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
  },
  compactBlindBoxText: {
    fontSize: 10,
  },
  compactStatusOverlay: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  compactStatusText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 9,
  },
  compactContent: {
    padding: 10,
  },
  compactFoodName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.dark,
  },
  compactVendorName: {
    fontSize: 11,
    color: colors.grayDark,
    marginTop: 2,
  },
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  compactPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactOriginalPrice: {
    fontSize: 11,
    color: colors.grayDark,
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  compactPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  compactPriceTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  compactPriceTagText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: 'bold',
  },
});

export default ListingCard;
