import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import ListingCard from '../components/ListingCard';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingContext';
import { useImpact } from '../context/ImpactContext';

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { listings, debugMode, toggleDebugMode } = useListings();
  const role = user?.role || 'customer';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [timeRange, setTimeRange] = useState('weekly');
  const impact = useImpact();

  const categories = ['All', 'Halal', 'Non-Halal', 'Vegetarian'];

  // Pull-to-refresh state (must be before any conditional returns)
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network fetch with a mock delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const filteredListings = listings.filter((item) => {
    const matchesSearch = item.foodName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesVendor = role === 'vendor' ? item.vendorName === (user?.name || 'Your Store') : true;
    return matchesSearch && matchesCategory && matchesVendor;
  });

  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  // Get display name from user object
  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  // Customer View (original UI)
  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
      {/* Customer Header */}
      <View style={styles.customerHeaderRow}>
        <Text style={styles.customerGreeting}>👋 Welcome back, {getDisplayName()}!</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={[styles.debugButton, debugMode && styles.debugButtonActive]} onPress={toggleDebugMode}>
            <Ionicons name="bug" size={18} color={debugMode ? colors.white : colors.grayDark} />
            <Text style={[styles.debugButtonText, debugMode && styles.debugButtonTextActive]}>
              {debugMode ? 'Debug: ON' : 'Debug'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={colors.grayDark} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.grayDark} />
        <TextInput style={styles.searchInput} placeholder="Search for food..." placeholderTextColor={colors.grayDark} value={searchQuery} onChangeText={setSearchQuery} />
      </View>
      <View style={styles.timeRangeRow}>
        {['daily', 'weekly', 'monthly'].map((range) => (
          <TouchableOpacity
            key={range}
            style={[styles.timeRangeButton, timeRange === range && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange(range)}
          >
            <Text style={[styles.timeRangeText, timeRange === range && styles.timeRangeTextActive]}>
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.impactCard}>
        <View style={styles.impactItem}><Text style={styles.impactNumber}>{impact[timeRange].mealsSaved}</Text><Text style={styles.impactLabel}>Meals Saved</Text></View>
        <View style={styles.impactDivider} />
        <View style={styles.impactItem}><Text style={styles.impactNumber}>{impact[timeRange].co2Saved}kg</Text><Text style={styles.impactLabel}>CO₂ Saved</Text></View>
        <View style={styles.impactDivider} />
        <View style={styles.impactItem}><Text style={styles.impactNumber}>{impact[timeRange].vendors}</Text><Text style={styles.impactLabel}>Vendors</Text></View>
      </View>
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity key={category} style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]} onPress={() => setSelectedCategory(category)}>
              <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="restaurant-outline" size={64} color={colors.grayDark} />
      <Text style={styles.emptyText}>No food available right now</Text>
      <Text style={styles.emptySubtext}>Check back later for new listings</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredListings}
        renderItem={({ item }) => <ListingCard listing={item} onPress={() => navigation.navigate('Detail', { listing: item })} debugMode={debugMode} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        progressViewOffset={insets.top + 80}
        contentInset={{ top: insets.top }}
        contentOffset={{ x: 0, y: -insets.top }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray },
  listContent: { paddingBottom: 20 },
  header: { backgroundColor: colors.white, paddingTop: 16, paddingHorizontal: 16, paddingBottom: 8 },

  // Customer specific
  customerHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  customerGreeting: { fontSize: 18, fontWeight: '600', color: colors.dark },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gray, borderRadius: 12, paddingHorizontal: 16, marginBottom: 16 },
  searchInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 12, fontSize: 16 },
  timeRangeRow: { flexDirection: 'row', marginBottom: 12, gap: 8 },
  timeRangeButton: { flex: 1, paddingVertical: 8, borderRadius: 8, backgroundColor: colors.gray, alignItems: 'center' },
  timeRangeButtonActive: { backgroundColor: colors.primary },
  timeRangeText: { fontSize: 13, fontWeight: '600', color: colors.grayDark },
  timeRangeTextActive: { color: colors.white },
  impactCard: { flexDirection: 'row', backgroundColor: colors.primary, borderRadius: 16, padding: 16, marginBottom: 16, justifyContent: 'space-around' },
  impactItem: { alignItems: 'center' },
  impactNumber: { fontSize: 20, fontWeight: 'bold', color: colors.white },
  impactLabel: { fontSize: 12, color: colors.white, opacity: 0.8 },
  impactDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  categoryContainer: { flexDirection: 'row', marginBottom: 8 },
  categoryButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: colors.gray },
  categoryButtonActive: { backgroundColor: colors.primary },
  categoryText: { fontSize: 14, fontWeight: '500', color: colors.grayDark },
  categoryTextActive: { color: colors.white },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { fontSize: 18, fontWeight: '600', color: colors.dark, marginTop: 16 },
  emptySubtext: { fontSize: 14, color: colors.grayDark, marginTop: 4 },

  logoutButton: { padding: 8 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  debugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.gray,
    gap: 4,
  },
  debugButtonText: { fontSize: 13, fontWeight: '600', color: colors.grayDark },
  debugButtonTextActive: { color: colors.white },
  debugButtonActive: { backgroundColor: colors.primary },
});

export default HomeScreen;
