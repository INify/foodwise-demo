import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import ListingCard from '../components/ListingCard';
import { useListings } from '../context/ListingContext';
import { useAuth } from '../context/AuthContext';

const BrowseScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { listings } = useListings();
  const { user } = useAuth();
  const role = user?.role || 'customer';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [timeRange, setTimeRange] = useState('weekly');

  // Get unique categories from listings
  const categories = ['All', ...new Set(listings.map(item => item.category).filter(Boolean))];

  // Filter listings based on search, category, and vendor
  const filteredListings = listings.filter((item) => {
    const matchesSearch = item.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesVendor = role === 'vendor' ? item.vendorName === (user?.name || 'Your Store') : true;
    return matchesSearch && matchesCategory && matchesVendor;
  });

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="restaurant-outline" size={64} color={colors.grayDark} />
      <Text style={styles.emptyText}>No listings found</Text>
      <Text style={styles.emptySubtext}>Try a different category or search term</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Browse Surplus</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.grayDark} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Find food near you…" 
            placeholderTextColor={colors.grayDark} 
            value={searchQuery} 
            onChangeText={setSearchQuery} 
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.grayDark} />
            </TouchableOpacity>
          )}
        </View>

        {/* Time Range */}
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

        {/* Category Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity 
              key={category} 
              style={[styles.categoryChip, selectedCategory === category && styles.categoryChipActive]} 
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.categoryChipText, selectedCategory === category && styles.categoryChipTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Listings */}
      <FlatList
        data={filteredListings}
        renderItem={({ item }) => (
          <ListingCard 
            listing={item} 
            onPress={() => navigation.navigate('Detail', { listing: item })} 
            debugMode={false}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.grayLight },
  listContent: { paddingBottom: 20 },

  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },

  timeRangeRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.grayLight,
    alignItems: 'center',
  },
  timeRangeButtonActive: {
    backgroundColor: colors.primary,
  },
  timeRangeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.grayDark,
  },
  timeRangeTextActive: {
    color: colors.white,
  },

  categoryScroll: {
    flexGrow: 0,
  },
  categoryContainer: {
    paddingVertical: 4,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.grayDark,
  },
  categoryChipTextActive: {
    color: colors.white,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
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
});

export default BrowseScreen;
