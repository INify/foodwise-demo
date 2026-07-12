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
  const [timeRange, setTimeRange] = useState('weekly');
  const impact = useImpact();

  // Pull-to-refresh state
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // Get blind box items (isBlindBox === true)
  const blindBoxItems = listings.filter(item => item.isBlindBox === true);

  // Get closing soon items: urgent AND NOT blind box
  const getClosingSoonItems = () => {
    const urgentNonBlindBox = listings.filter(item => 
      item.urgent === true && item.isBlindBox !== true
    );
    
    const nonUrgentNonBlindBox = listings.filter(item => 
      item.urgent !== true && item.isBlindBox !== true
    );
    
    const sortByCountdown = (items) => {
      return [...items].sort((a, b) => {
        const getMinutes = (str) => {
          if (!str) return 9999;
          const hours = parseInt(str.match(/(\d+)h/)?.[1] || '0');
          const mins = parseInt(str.match(/(\d+)m/)?.[1] || '0');
          return hours * 60 + mins;
        };
        return getMinutes(a.countdown) - getMinutes(b.countdown);
      });
    };

    const sortedUrgent = sortByCountdown(urgentNonBlindBox);
    const sortedNonUrgent = sortByCountdown(nonUrgentNonBlindBox);
    
    const combined = [...sortedUrgent, ...sortedNonUrgent];
    return combined.slice(0, 2);
  };

  const closingSoonItems = getClosingSoonItems();

  // Get unique vendors for Nearby Vendors
  const getUniqueVendors = () => {
    const vendorMap = {};
    listings.forEach(item => {
      if (!vendorMap[item.vendorName]) {
        vendorMap[item.vendorName] = {
          name: item.vendorName,
          image: item.vendorImage,
        };
      }
    });
    return Object.values(vendorMap).slice(0, 5);
  };

  const nearbyVendors = getUniqueVendors();

  // Get popular items (by rating or just first 4)
  const getPopularItems = () => {
    // Sort by rating if available, or just take first 4
    const sorted = [...listings].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return sorted.slice(0, 4);
  };

  const popularItems = getPopularItems();

  const filteredListings = listings.filter((item) => {
    const matchesSearch = item.foodName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVendor = role === 'vendor' ? item.vendorName === (user?.name || 'Your Store') : true;
    return matchesSearch && matchesVendor;
  });

  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const navigateToBrowse = () => {
    navigation.navigate('Browse');
  };

  // Render Blind Box section
  const renderBlindBox = () => {
    if (blindBoxItems.length === 0) return null;

    return (
      <View style={styles.blindBoxSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Blind Box Deals</Text>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.blindBoxScrollContainer}
        >
          {blindBoxItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.blindBoxCard}
              onPress={() => navigation.navigate('Detail', { listing: item })}
              activeOpacity={0.9}
            >
              <View style={styles.blindBoxGradient}>
                <View style={styles.blindBoxContent}>
                  <View style={styles.blindBoxIconContainer}>
                    <Text style={styles.blindBoxIcon}>🎁</Text>
                  </View>
                  <View style={styles.blindBoxInfo}>
                    <View style={styles.blindBoxTagContainer}>
                      <Text style={styles.blindBoxTag}>BLIND BOX</Text>
                      <Text style={styles.blindBoxCount}>{item.quantity || 0} left</Text>
                    </View>
                    <Text style={styles.blindBoxTitle} numberOfLines={1}>{item.foodName}</Text>
                    <Text style={styles.blindBoxSubtext} numberOfLines={1}>
                      Worth RM {(item.originalPrice || 0).toFixed(2)}+ · {item.vendorName}
                    </Text>
                  </View>
                  <View style={styles.blindBoxPriceContainer}>
                    <Text style={styles.blindBoxPrice}>RM {item.price.toFixed(2)}</Text>
                    <View style={styles.blindBoxTimeContainer}>
                      <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.6)" />
                      <Text style={styles.blindBoxTime}>{item.countdown || 'Soon'}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Render Closing Soon section
  const renderClosingSoon = () => {
    if (closingSoonItems.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="flame" size={18} color={colors.secondary} />
            <Text style={styles.sectionTitle}>Closing Soon</Text>
          </View>
          <TouchableOpacity onPress={navigateToBrowse}>
            <Text style={styles.seeAllText}>See All →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.closingSoonGrid}>
          {closingSoonItems.map((item) => (
            <View key={item.id} style={styles.closingSoonItemWrapper}>
              <ListingCard 
                listing={item} 
                onPress={() => navigation.navigate('Detail', { listing: item })} 
                debugMode={debugMode} 
                compact={true}
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Render Nearby Vendors
  const renderNearbyVendors = () => {
    if (nearbyVendors.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="storefront" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Nearby Vendors</Text>
          </View>
          <TouchableOpacity onPress={navigateToBrowse}>
            <Text style={styles.seeAllText}>See All →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vendorScrollContainer}>
          {nearbyVendors.map((vendor) => (
            <TouchableOpacity key={vendor.name} style={styles.vendorCard}>
              <View style={styles.vendorAvatar}>
                <Text style={styles.vendorEmoji}>🏪</Text>
              </View>
              <Text style={styles.vendorNameText} numberOfLines={1}>{vendor.name}</Text>
              <Text style={styles.vendorBadge}>🌿 Eco Partner</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Render Popular Now
  const renderPopularNow = () => {
    if (popularItems.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="star" size={18} color={colors.gold} />
            <Text style={styles.sectionTitle}>Popular Now</Text>
          </View>
          <TouchableOpacity onPress={navigateToBrowse}>
            <Text style={styles.seeAllText}>See All →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularScrollContainer}>
          {popularItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.popularCard}
              onPress={() => navigation.navigate('Detail', { listing: item })}
            >
              <Text style={styles.popularEmoji}>⭐</Text>
              <Text style={styles.popularName} numberOfLines={1}>{item.foodName}</Text>
              <Text style={styles.popularVendor} numberOfLines={1}>{item.vendorName}</Text>
              <Text style={styles.popularPrice}>RM {item.price.toFixed(2)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Main header renderer
  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
      {/* Welcome Header */}
      <View style={styles.customerHeaderRow}>
        <View>
          <Text style={styles.customerGreeting}>👋 Welcome back, {getDisplayName()}!</Text>
        </View>
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.grayDark} />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search surplus food near you…" 
          placeholderTextColor={colors.grayDark} 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
        />
      </View>

      {/* Blind Box Deals */}
      {renderBlindBox()}

      {/* Closing Soon */}
      {renderClosingSoon()}

      {/* Impact Card */}
      <View style={styles.impactCard}>
        <View style={styles.impactItem}><Text style={styles.impactNumber}>{impact[timeRange].mealsSaved}</Text><Text style={styles.impactLabel}>Meals Saved</Text></View>
        <View style={styles.impactDivider} />
        <View style={styles.impactItem}><Text style={styles.impactNumber}>{impact[timeRange].co2Saved}kg</Text><Text style={styles.impactLabel}>CO₂ Saved</Text></View>
        <View style={styles.impactDivider} />
        <View style={styles.impactItem}><Text style={styles.impactNumber}>{impact[timeRange].vendors}</Text><Text style={styles.impactLabel}>Vendors</Text></View>
      </View>

      {/* Nearby Vendors */}
      {renderNearbyVendors()}

      {/* Popular Now */}
      {renderPopularNow()}
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
        renderItem={({ item }) => (
          <ListingCard 
            listing={item} 
            onPress={() => navigation.navigate('Detail', { listing: item })} 
            debugMode={debugMode} 
          />
        )}
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
  container: { flex: 1, backgroundColor: colors.grayLight },
  listContent: { paddingBottom: 20 },

  header: {
    backgroundColor: colors.white,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  customerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerGreeting: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },

  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },

  // Blind Box
  blindBoxSection: {
    marginBottom: 16,
  },
  blindBoxScrollContainer: {
    gap: 12,
    paddingRight: 16,
  },
  blindBoxCard: {
    borderRadius: 16,
    overflow: 'hidden',
    width: 280,
  },
  blindBoxGradient: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 16,
  },
  blindBoxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  blindBoxIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blindBoxIcon: {
    fontSize: 24,
  },
  blindBoxInfo: {
    flex: 1,
  },
  blindBoxTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  blindBoxTag: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.secondary,
    backgroundColor: 'rgba(232, 93, 58, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(232, 93, 58, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    letterSpacing: 0.5,
  },
  blindBoxCount: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
  },
  blindBoxTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.white,
  },
  blindBoxSubtext: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 1,
  },
  blindBoxPriceContainer: {
    alignItems: 'flex-end',
  },
  blindBoxPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.white,
  },
  blindBoxTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  blindBoxTime: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
  },

  // Closing Soon
  closingSoonGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  closingSoonItemWrapper: {
    flex: 1,
  },

  // Impact Card
  impactCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  impactItem: { alignItems: 'center' },
  impactNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  impactLabel: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
  },
  impactDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  // Nearby Vendors
  vendorScrollContainer: {
    gap: 12,
    paddingRight: 16,
  },
  vendorCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: 100,
    borderWidth: 1,
    borderColor: colors.grayLight,
  },
  vendorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  vendorEmoji: {
    fontSize: 24,
  },
  vendorNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark,
    textAlign: 'center',
  },
  vendorBadge: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },

  // Popular Now
  popularScrollContainer: {
    gap: 12,
    paddingRight: 16,
  },
  popularCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    width: 120,
    borderWidth: 1,
    borderColor: colors.grayLight,
    alignItems: 'center',
  },
  popularEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  popularName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.dark,
    textAlign: 'center',
  },
  popularVendor: {
    fontSize: 10,
    color: colors.grayDark,
    textAlign: 'center',
    marginTop: 2,
  },
  popularPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 4,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.grayDark,
    marginTop: 4,
  },

  logoutButton: { padding: 8 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  debugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.grayLight,
    gap: 4,
  },
  debugButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.grayDark,
  },
  debugButtonTextActive: {
    color: colors.white,
  },
  debugButtonActive: {
    backgroundColor: colors.primary,
  },
});

export default HomeScreen;
