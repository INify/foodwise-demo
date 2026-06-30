import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import ListingCard from '../components/ListingCard';
import { mockListings } from '../data/mockData';

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Halal', 'Non-Halal', 'Veggie'];

  const filteredListings = mockListings.filter((item) => {
    const matchesSearch = item.foodName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.grayDark} />
        <TextInput style={styles.searchInput} placeholder="Search for food..." placeholderTextColor={colors.grayDark} value={searchQuery} onChangeText={setSearchQuery} />
      </View>
      <View style={styles.impactCard}>
        <View style={styles.impactItem}><Text style={styles.impactNumber}>254</Text><Text style={styles.impactLabel}>Meals Saved</Text></View>
        <View style={styles.impactDivider} />
        <View style={styles.impactItem}><Text style={styles.impactNumber}>125.5kg</Text><Text style={styles.impactLabel}>CO₂ Saved</Text></View>
        <View style={styles.impactDivider} />
        <View style={styles.impactItem}><Text style={styles.impactNumber}>12</Text><Text style={styles.impactLabel}>Vendors</Text></View>
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
      <FlatList data={filteredListings} renderItem={({ item }) => <ListingCard listing={item} onPress={() => navigation.navigate('Detail', { listing: item })} />} keyExtractor={(item) => item.id} ListHeaderComponent={renderHeader} ListEmptyComponent={renderEmptyState} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray },
  listContent: { paddingBottom: 20 },
  header: { backgroundColor: colors.white, paddingTop: 16, paddingHorizontal: 16, paddingBottom: 8 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gray, borderRadius: 12, paddingHorizontal: 16, marginBottom: 16 },
  searchInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 12, fontSize: 16 },
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
});

export default HomeScreen;
