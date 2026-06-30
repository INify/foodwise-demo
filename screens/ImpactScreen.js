import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';
import { impactData } from '../data/mockData';

const ImpactScreen = () => {
  const insets = useSafeAreaInsets();
  const { totalMealsSaved, totalCO2Saved, totalVendors, totalCustomers, weeklyData, topVendors } = impactData;

  const getMaxMeals = () => Math.max(...weeklyData.map(d => d.meals), 1);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Text style={styles.headerTitle}>🌍 Our Impact</Text>
        <Text style={styles.headerSubtext}>Together, we're making a difference</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.statCardGreen]}><Text style={styles.statNumber}>{totalMealsSaved}</Text><Text style={styles.statLabel}>Meals Saved</Text><Text style={styles.statIcon}>🍽️</Text></View>
        <View style={[styles.statCard, styles.statCardOrange]}><Text style={styles.statNumber}>{totalCO2Saved}kg</Text><Text style={styles.statLabel}>CO₂ Saved</Text><Text style={styles.statIcon}>🌱</Text></View>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.statCardBlue]}><Text style={styles.statNumber}>{totalVendors}</Text><Text style={styles.statLabel}>Vendors</Text><Text style={styles.statIcon}>🏪</Text></View>
        <View style={[styles.statCard, styles.statCardPurple]}><Text style={styles.statNumber}>{totalCustomers}</Text><Text style={styles.statLabel}>Customers</Text><Text style={styles.statIcon}>👥</Text></View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Vendors</Text>
        {topVendors.map((vendor, index) => (
          <View key={index} style={styles.vendorCard}>
            <View style={styles.vendorRank}><Text style={styles.vendorRankText}>#{index + 1}</Text></View>
            <View style={styles.vendorInfo}><Text style={styles.vendorName}>{vendor.name}</Text><Text style={styles.vendorStats}>{vendor.saved} meals saved</Text></View>
            <View style={styles.vendorBadge}><Text style={styles.vendorBadgeText}>{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</Text></View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray },
  header: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingBottom: 32, alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: colors.white },
  headerSubtext: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 16, marginTop: -16, gap: 12, marginBottom: 32 },
  statCard: { flex: 1, backgroundColor: colors.white, borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, position: 'relative', overflow: 'hidden' },
  statCardGreen: { borderTopColor: colors.primary, borderTopWidth: 4 },
  statCardOrange: { borderTopColor: colors.secondary, borderTopWidth: 4 },
  statCardBlue: { borderTopColor: '#2196F3', borderTopWidth: 4 },
  statCardPurple: { borderTopColor: '#9C27B0', borderTopWidth: 4 },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: colors.dark, marginTop: 4 },
  statLabel: { fontSize: 12, color: colors.grayDark, marginTop: 2 },
  statIcon: { fontSize: 24, marginTop: 4 },
  section: { backgroundColor: colors.white, borderRadius: 16, padding: 16, margin: 16, marginBottom: 8, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.dark, marginBottom: 16 },
  vendorCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.gray },
  vendorRank: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.gray, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  vendorRankText: { fontSize: 12, fontWeight: 'bold', color: colors.grayDark },
  vendorInfo: { flex: 1 },
  vendorName: { fontSize: 14, fontWeight: '500', color: colors.dark },
  vendorStats: { fontSize: 12, color: colors.grayDark },
  vendorBadge: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  vendorBadgeText: { fontSize: 24 },
});

export default ImpactScreen;
