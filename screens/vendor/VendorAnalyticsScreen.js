import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { useListings } from '../../context/ListingContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrdersContext';

const { width } = Dimensions.get('window');

const VendorAnalyticsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { listings } = useListings();
  const { orders } = useOrders();
  const vendorName = user?.name || 'Your Store';

  const vendorListings = listings.filter(l => l.vendorName === vendorName);
  const vendorOrders = orders;

  // --- Smart Match Data ---
  const getSmartMatches = () => {
    return vendorListings.map(listing => {
      const baseScore = 50;
      const priceScore = listing.price < 5 ? 20 : listing.price < 10 ? 10 : 0;
      const quantityScore = (listing.quantity || 0) > 5 ? 15 : (listing.quantity || 0) > 2 ? 8 : 0;
      const historyBonus = vendorOrders.filter(o => o.listingId === listing.id).length * 2;
      const score = Math.min(baseScore + priceScore + quantityScore + historyBonus, 98);
      return { ...listing, matchScore: Math.round(score) };
    }).sort((a, b) => b.matchScore - a.matchScore);
  };

  const smartMatches = getSmartMatches();

  // --- Peak Hours Analysis ---
  const getPeakHours = () => {
    const orderTimes = vendorOrders.map(o => {
      const time = o.pickupTime || o.time;
      if (!time) return 19;
      const hour = new Date(time).getHours();
      return isNaN(hour) ? 19 : hour;
    });
    
    if (orderTimes.length === 0) return { peak: '7:00 PM - 8:30 PM', confidence: 'Low' };
    
    const hourCounts = {};
    orderTimes.forEach(h => { hourCounts[h] = (hourCounts[h] || 0) + 1; });
    
    let maxCount = 0;
    let peakHour = 19;
    for (const [hour, count] of Object.entries(hourCounts)) {
      if (count > maxCount) {
        maxCount = count;
        peakHour = parseInt(hour);
      }
    }
    
    const start = peakHour;
    const end = peakHour + 1.5;
    const confidence = orderTimes.length > 5 ? 'High' : orderTimes.length > 2 ? 'Medium' : 'Low';
    
    return {
      peak: `${String(start).padStart(2, '0')}:00 - ${String(Math.floor(end)).padStart(2, '0')}:30 PM`,
      confidence
    };
  };

  const peakHours = getPeakHours();

  // --- Best Selling Items ---
  const getBestSelling = () => {
    const itemCounts = {};
    vendorOrders.forEach(o => {
      const name = o.listing?.foodName || 'Unknown';
      itemCounts[name] = (itemCounts[name] || 0) + (o.quantity || 1);
    });
    return Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
  };

  const bestSelling = getBestSelling();

  return (
    <View style={styles.container}>
      <View style={[styles.vendorHeader, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="menu" size={28} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.vendorTitle}>{vendorName}</Text>
          <Text style={styles.vendorSubtitle}>Analytics & Smart Match</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.vendorScroll}>
        {/* Smart Match List */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={22} color="#1565C0" />
            <Text style={styles.sectionTitle}>🤝 Smart Match Scores</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Items with highest demand potential — feature these to maximize sales
          </Text>
          {smartMatches.length === 0 ? (
            <Text style={styles.emptyText}>No listings to analyze. Add some food items first!</Text>
          ) : (
            smartMatches.slice(0, 5).map((item, index) => (
              <View key={item.id} style={styles.matchItem}>
                <View style={styles.matchItemLeft}>
                  <Text style={styles.matchItemRank}>#{index + 1}</Text>
                  <View>
                    <Text style={styles.matchItemName}>{item.foodName}</Text>
                    <Text style={styles.matchItemPrice}>RM {item.price.toFixed(2)}</Text>
                  </View>
                </View>
                <View style={styles.matchItemRight}>
                  <View style={[styles.matchScoreBadge, { 
                    backgroundColor: item.matchScore >= 80 ? '#E8F5E9' : 
                                    item.matchScore >= 60 ? '#FFF3E0' : '#F5F5F5' 
                  }]}>
                    <Text style={[styles.matchScoreText, {
                      color: item.matchScore >= 80 ? colors.success : 
                              item.matchScore >= 60 ? colors.secondary : colors.grayDark
                    }]}>
                      {item.matchScore}%
                    </Text>
                  </View>
                  <Text style={styles.matchItemStatus}>
                    {item.matchScore >= 80 ? '🔥 Hot' : item.matchScore >= 60 ? '📈 Trending' : '📊 Average'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Peak Hours Analysis */}
        <View style={[styles.sectionCard, { backgroundColor: '#F5F8F5' }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={22} color="#1565C0" />
            <Text style={styles.sectionTitle}>⏰ Peak Hours Analysis</Text>
          </View>
          <View style={styles.peakContainer}>
            <Text style={styles.peakTime}>{peakHours.peak}</Text>
            <View style={styles.peakConfidence}>
              <Text style={styles.peakConfidenceLabel}>Confidence:</Text>
              <Text style={[styles.peakConfidenceValue, { 
                color: peakHours.confidence === 'High' ? colors.success : 
                       peakHours.confidence === 'Medium' ? colors.secondary : colors.grayDark 
              }]}>
                {peakHours.confidence}
              </Text>
            </View>
          </View>
          <Text style={styles.peakHint}>
            💡 {peakHours.confidence === 'High' ? 'Schedule more staff during this time' : 
                peakHours.confidence === 'Medium' ? 'Collect more data for better insights' : 
                'Add more orders to improve prediction accuracy'}
          </Text>
        </View>

        {/* Best Selling Items */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="star" size={22} color={colors.gold} />
            <Text style={styles.sectionTitle}>⭐ Best Selling Items</Text>
          </View>
          {bestSelling.length === 0 ? (
            <Text style={styles.emptyText}>No orders yet. Start selling to see trends!</Text>
          ) : (
            bestSelling.map((item, index) => (
              <View key={item.name} style={styles.bestItem}>
                <Text style={styles.bestItemRank}>{index + 1}</Text>
                <Text style={styles.bestItemName}>{item.name}</Text>
                <Text style={styles.bestItemCount}>{item.count} orders</Text>
              </View>
            ))
          )}
        </View>

        {/* Waste Reduction Tip */}
        <View style={[styles.sectionCard, { backgroundColor: '#E8F5E9' }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="leaf" size={22} color={colors.primary} />
            <Text style={styles.sectionTitle}>🌱 Waste Reduction Tip</Text>
          </View>
          <Text style={styles.tipText}>
            {vendorListings.length > 10 
              ? 'You\'re doing great! Consider rotating your menu to attract more customers and reduce waste.'
              : 'Start by listing 5+ items to unlock the "Eco Partner" badge and attract more customers!'}
          </Text>
        </View>

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
    alignItems: 'center' 
  },
  menuButton: { padding: 4, marginRight: 12 },
  headerTextContainer: { flex: 1 },
  vendorTitle: { fontSize: 20, fontWeight: 'bold', color: colors.white },
  vendorSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  vendorScroll: { flex: 1 },
  sectionCard: { 
    backgroundColor: colors.white, 
    borderRadius: 16, 
    marginHorizontal: 12, 
    marginTop: 12, 
    padding: 16, 
    shadowColor: colors.shadow, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 4, 
    elevation: 2 
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.dark, marginLeft: 8 },
  sectionSubtitle: { fontSize: 12, color: colors.grayDark, marginBottom: 12 },
  emptyText: { fontSize: 14, color: colors.grayDark, textAlign: 'center', paddingVertical: 16 },

  // Smart Match
  matchItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.grayLight 
  },
  matchItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  matchItemRank: { fontSize: 14, fontWeight: '700', color: colors.grayDark, minWidth: 30 },
  matchItemName: { fontSize: 14, fontWeight: '600', color: colors.dark },
  matchItemPrice: { fontSize: 12, color: colors.grayDark },
  matchItemRight: { alignItems: 'flex-end', gap: 2 },
  matchScoreBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  matchScoreText: { fontSize: 14, fontWeight: '700' },
  matchItemStatus: { fontSize: 11, color: colors.grayDark },

  // Peak Hours
  peakContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  peakTime: { fontSize: 18, fontWeight: '700', color: colors.dark },
  peakConfidence: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  peakConfidenceLabel: { fontSize: 12, color: colors.grayDark },
  peakConfidenceValue: { fontSize: 13, fontWeight: '700' },
  peakHint: { fontSize: 12, color: colors.grayDark, marginTop: 8, fontStyle: 'italic' },

  // Best Selling
  bestItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 8, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.grayLight 
  },
  bestItemRank: { fontSize: 14, fontWeight: '700', color: colors.gold, minWidth: 30 },
  bestItemName: { fontSize: 14, fontWeight: '500', color: colors.dark, flex: 1 },
  bestItemCount: { fontSize: 13, color: colors.grayDark },

  // Tip
  tipText: { fontSize: 14, color: colors.dark, lineHeight: 20 },
});

export default VendorAnalyticsScreen;
