import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { useListings } from '../../context/ListingContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrdersContext';
import { useImpact } from '../../context/ImpactContext';

const { width } = Dimensions.get('window');

const VendorDashboardScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { listings } = useListings();
  const { orders } = useOrders();
  const impact = useImpact();
  const vendorName = user?.name || 'Your Store';

  const vendorListings = listings.filter(l => l.vendorName === vendorName);
  const vendorOrders = orders;

  // --- Stats ---
  const totalOrdersCount = vendorOrders.length;
  const pendingCount = vendorOrders.filter(o => o.status === 'Pending' || o.status === 'Ready').length;
  const pickedUpCount = vendorOrders.filter(o => o.status === 'Picked Up').length;
  const totalRevenue = vendorOrders.reduce((sum, o) => sum + (o.totalPrice || o.price || 0), 0);
  const completionRate = totalOrdersCount > 0 ? (pickedUpCount / totalOrdersCount) * 100 : 0;

  const vendorStats = {
    totalListings: vendorListings.length,
    totalOrders: totalOrdersCount,
    pendingPickups: pendingCount,
    revenue: totalRevenue,
    completionRate: completionRate,
  };

  // --- Eco Level & Badge System ---
  const getVendorEcoLevel = (count) => {
    if (count >= 50) return { level: '🏆 Zero Waste Hero', color: '#FFD700', badge: 'Zero Waste Hero', progress: 100 };
    if (count >= 30) return { level: '♻️ Eco Champion', color: '#4CAF50', badge: 'Eco Champion', progress: 100 };
    if (count >= 15) return { level: '⭐ Community Star', color: '#2196F3', badge: 'Community Star', progress: (count / 30) * 100 };
    if (count >= 5) return { level: '🌿 Eco Partner', color: '#8BC34A', badge: 'Eco Partner', progress: (count / 15) * 100 };
    return { level: '🌱 Beginner', color: '#9E9E9E', badge: 'Beginner', progress: Math.min((count / 5) * 100, 100) };
  };

  const ecoLevel = getVendorEcoLevel(vendorStats.totalListings);

  // Badge milestones
  const badgeMilestones = [
    { id: 1, name: 'Beginner', icon: '🌱', required: 1, earned: vendorStats.totalListings >= 1 },
    { id: 2, name: 'Eco Partner', icon: '🌿', required: 5, earned: vendorStats.totalListings >= 5 },
    { id: 3, name: 'Community Star', icon: '⭐', required: 15, earned: vendorStats.totalListings >= 15 },
    { id: 4, name: 'Eco Champion', icon: '♻️', required: 30, earned: vendorStats.totalListings >= 30 },
    { id: 5, name: 'Zero Waste Hero', icon: '🏆', required: 50, earned: vendorStats.totalListings >= 50 },
  ];

  // --- AI Demand Prediction (simulated) ---
  const getAIPrediction = () => {
    // Simulate based on number of listings and orders
    const baseSellThrough = 60 + (vendorStats.totalListings * 2) + (vendorStats.totalOrders * 1.5);
    const sellThrough = Math.min(Math.round(baseSellThrough), 98);
    const suggestedProduction = sellThrough > 80 ? 'Maintain current production' : 'Reduce production by 15%';
    const tip = sellThrough > 80 
      ? '📈 High demand! Consider increasing production by 5%' 
      : '📉 Overproduction detected. Reduce by 15% to minimize waste';
    
    return { sellThrough, suggestedProduction, tip };
  };

  const aiPrediction = getAIPrediction();

  // --- Eco Score ---
  const calculateEcoScore = () => {
    const listingScore = Math.min(vendorStats.totalListings * 2, 40);
    const orderScore = Math.min(vendorStats.totalOrders * 1.5, 30);
    const completionScore = Math.min(Math.round(vendorStats.completionRate * 0.3), 30);
    return Math.min(listingScore + orderScore + completionScore, 100);
  };

  const ecoScore = calculateEcoScore();

  // --- Smart Match Data ---
  const getSmartMatch = () => {
    if (vendorListings.length === 0) return null;
    // Find the listing with highest potential demand
    const sorted = [...vendorListings].sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
    const topListing = sorted[0];
    return {
      foodName: topListing.foodName,
      price: topListing.price,
      matchScore: Math.min(70 + vendorStats.totalOrders * 3, 98),
    };
  };

  const smartMatch = getSmartMatch();

  return (
    <View style={styles.container}>
      <View style={[styles.vendorHeader, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="menu" size={28} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.vendorTitle}>{vendorName}</Text>
          <Text style={styles.vendorSubtitle}>Vendor Dashboard</Text>
        </View>
        <View style={styles.ecoBadgeHeader}>
          <Text style={styles.ecoBadgeHeaderText}>{ecoLevel.level}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.vendorScroll}>
        {/* 1. Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="restaurant" size={24} color={colors.primary} />
            <Text style={styles.statNumber}>{vendorStats.totalListings}</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="receipt" size={24} color={colors.secondary} />
            <Text style={styles.statNumber}>{vendorStats.totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="time" size={24} color="#1565C0" />
            <Text style={styles.statNumber}>{vendorStats.pendingPickups}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FCE4EC' }]}>
            <Ionicons name="cash" size={24} color="#C62828" />
            <Text style={styles.statNumber}>RM{vendorStats.revenue.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>

        {/* 2. Eco Level & Badge Progress */}
        <View style={styles.sectionCard}>
          <View style={styles.badgeHeader}>
            <Text style={styles.badgeTitle}>🏅 Vendor Eco Level</Text>
            <Text style={[styles.badgeLevel, { color: ecoLevel.color }]}>{ecoLevel.level}</Text>
          </View>
          <View style={styles.badgeProgressContainer}>
            <View style={styles.badgeProgressBar}>
              <View style={[styles.badgeProgressFill, { width: `${ecoLevel.progress}%`, backgroundColor: ecoLevel.color }]} />
            </View>
            <Text style={styles.badgeProgressText}>
              {vendorStats.totalListings} listings · Next: {badgeMilestones.find(b => !b.earned)?.name || 'Max Level!'}
            </Text>
          </View>
          <View style={styles.badgeRow}>
            {badgeMilestones.map((badge) => (
              <View key={badge.id} style={[styles.badgeItem, badge.earned && styles.badgeItemEarned]}>
                <Text style={styles.badgeIcon}>{badge.earned ? badge.icon : '🔒'}</Text>
                <Text style={[styles.badgeName, badge.earned && styles.badgeNameEarned]}>{badge.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 3. Eco Score */}
        <View style={[styles.sectionCard, { backgroundColor: '#F5F8F5' }]}>
          <View style={styles.ecoScoreHeader}>
            <Ionicons name="leaf" size={22} color={colors.primary} />
            <Text style={styles.ecoScoreTitle}>Eco Score</Text>
            <Text style={styles.ecoScoreValue}>{ecoScore}%</Text>
          </View>
          <View style={styles.ecoScoreBar}>
            <View style={[styles.ecoScoreFill, { width: `${ecoScore}%` }]} />
          </View>
          <View style={styles.ecoScoreDetails}>
            <View style={styles.ecoScoreDetail}>
              <Text style={styles.ecoScoreDetailLabel}>Listings</Text>
              <Text style={styles.ecoScoreDetailValue}>+{Math.min(vendorStats.totalListings * 2, 40)}</Text>
            </View>
            <View style={styles.ecoScoreDetail}>
              <Text style={styles.ecoScoreDetailLabel}>Orders</Text>
              <Text style={styles.ecoScoreDetailValue}>+{Math.min(vendorStats.totalOrders * 1.5, 30)}</Text>
            </View>
            <View style={styles.ecoScoreDetail}>
              <Text style={styles.ecoScoreDetailLabel}>Completion</Text>
              <Text style={styles.ecoScoreDetailValue}>+{Math.min(Math.round(vendorStats.completionRate * 0.3), 30)}</Text>
            </View>
          </View>
        </View>

        {/* 4. AI Demand Prediction */}
        <View style={[styles.sectionCard, { backgroundColor: '#FFF8E1' }]}>
          <View style={styles.aiHeader}>
            <Ionicons name="bulb-outline" size={22} color={colors.secondary} />
            <Text style={styles.aiTitle}>AI Demand Prediction</Text>
          </View>
          <View style={styles.aiContent}>
            <View style={styles.aiStat}>
              <Text style={styles.aiStatNumber}>{aiPrediction.sellThrough}%</Text>
              <Text style={styles.aiStatLabel}>Predicted sell-through</Text>
            </View>
            <View style={styles.aiDivider} />
            <View style={styles.aiStat}>
              <Text style={[styles.aiStatNumber, { color: colors.secondary }]}>
                {aiPrediction.sellThrough > 80 ? '📈' : '📉'}
              </Text>
              <Text style={styles.aiStatLabel}>{aiPrediction.suggestedProduction}</Text>
            </View>
          </View>
          <View style={styles.aiTipContainer}>
            <Text style={styles.aiTip}>{aiPrediction.tip}</Text>
          </View>
        </View>

        {/* 5. Smart Match */}
        {smartMatch && (
          <View style={[styles.sectionCard, { backgroundColor: '#E8F0FE' }]}>
            <View style={styles.matchHeader}>
              <Ionicons name="people" size={22} color="#1565C0" />
              <Text style={styles.matchTitle}>🤝 Smart Match</Text>
            </View>
            <View style={styles.matchContent}>
              <Text style={styles.matchFood}>{smartMatch.foodName}</Text>
              <View style={styles.matchScoreContainer}>
                <Text style={styles.matchScore}>{smartMatch.matchScore}%</Text>
                <Text style={styles.matchScoreLabel}>Match Score</Text>
              </View>
            </View>
            <Text style={styles.matchHint}>
              💡 This item has high demand potential. Consider featuring it!
            </Text>
          </View>
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
    alignItems: 'center' 
  },
  menuButton: { padding: 4, marginRight: 12 },
  headerTextContainer: { flex: 1 },
  vendorTitle: { fontSize: 20, fontWeight: 'bold', color: colors.white },
  vendorSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  ecoBadgeHeader: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  ecoBadgeHeaderText: { fontSize: 12, color: colors.white, fontWeight: '600' },

  vendorScroll: { flex: 1 },

  // Stats
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 8 },
  statCard: { 
    width: '47%', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 8, 
    shadowColor: colors.shadow, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 2 
  },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: colors.dark, marginTop: 8 },
  statLabel: { fontSize: 13, color: colors.grayDark, marginTop: 2 },

  // Section Card
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

  // Badge System
  badgeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badgeTitle: { fontSize: 16, fontWeight: '700', color: colors.dark },
  badgeLevel: { fontSize: 18, fontWeight: '800' },
  badgeProgressContainer: { marginBottom: 12 },
  badgeProgressBar: { height: 6, backgroundColor: colors.grayLight, borderRadius: 3, overflow: 'hidden' },
  badgeProgressFill: { height: '100%', borderRadius: 3 },
  badgeProgressText: { fontSize: 12, color: colors.grayDark, marginTop: 6 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  badgeItem: { alignItems: 'center', opacity: 0.4 },
  badgeItemEarned: { opacity: 1 },
  badgeIcon: { fontSize: 22 },
  badgeName: { fontSize: 9, color: colors.grayDark, marginTop: 2 },
  badgeNameEarned: { color: colors.dark, fontWeight: '600' },

  // Eco Score
  ecoScoreHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ecoScoreTitle: { fontSize: 16, fontWeight: '700', color: colors.dark, flex: 1, marginLeft: 8 },
  ecoScoreValue: { fontSize: 18, fontWeight: '800', color: colors.primary },
  ecoScoreBar: { height: 8, backgroundColor: colors.grayLight, borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  ecoScoreFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  ecoScoreDetails: { flexDirection: 'row', justifyContent: 'space-around' },
  ecoScoreDetail: { alignItems: 'center' },
  ecoScoreDetailLabel: { fontSize: 11, color: colors.grayDark },
  ecoScoreDetailValue: { fontSize: 14, fontWeight: '700', color: colors.primary },

  // AI Prediction
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  aiTitle: { fontSize: 16, fontWeight: '700', color: colors.dark, marginLeft: 8 },
  aiContent: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8 },
  aiStat: { alignItems: 'center' },
  aiStatNumber: { fontSize: 24, fontWeight: '800', color: colors.primary },
  aiStatLabel: { fontSize: 12, color: colors.grayDark, marginTop: 2 },
  aiDivider: { width: 1, backgroundColor: colors.grayLight },
  aiTipContainer: { 
    backgroundColor: 'rgba(232, 93, 58, 0.08)', 
    borderRadius: 8, 
    padding: 10, 
    marginTop: 8 
  },
  aiTip: { fontSize: 13, color: colors.dark, textAlign: 'center' },

  // Smart Match
  matchHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  matchTitle: { fontSize: 16, fontWeight: '700', color: colors.dark, marginLeft: 8 },
  matchContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  matchFood: { fontSize: 16, fontWeight: '600', color: colors.dark },
  matchScoreContainer: { alignItems: 'center' },
  matchScore: { fontSize: 22, fontWeight: '800', color: '#1565C0' },
  matchScoreLabel: { fontSize: 10, color: colors.grayDark },
  matchHint: { fontSize: 12, color: colors.grayDark, marginTop: 8, fontStyle: 'italic' },
});

export default VendorDashboardScreen;
