import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import ListingCard from '../components/ListingCard';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingContext';

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { listings, addListing, updateListing } = useListings();
  const role = user?.role || 'customer';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Vendor listings derived from shared context
  const vendorListings = listings.filter(l => l.vendorName === 'Your Store');

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingListing, setEditingListing] = useState(null); // null = adding new, object = editing
  const [modalFoodName, setModalFoodName] = useState('');
  const [modalPrice, setModalPrice] = useState('');

  const categories = ['All', 'Halal', 'Non-Halal', 'Veggie'];

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
    const matchesVendor = role === 'vendor' ? item.vendorName === 'Your Store' : true;
    return matchesSearch && matchesCategory && matchesVendor;
  });

  const vendorStats = {
    totalListings: vendorListings.length,
    totalOrders: 24,
    pendingPickups: 7,
    revenue: 156.50,
  };

  const recentOrders = [
    { id: 'ORD-001', customer: 'Alice', items: 'Nasi Lemak × 2', status: 'Pending', time: '10 min ago' },
    { id: 'ORD-002', customer: 'Bob', items: 'Chicken Rice × 1', status: 'Ready', time: '25 min ago' },
    { id: 'ORD-003', customer: 'Carol', items: 'Roti Canai × 3', status: 'Picked Up', time: '1 hour ago' },
  ];

  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  // Open modal for adding a new listing
  const handleOpenAddModal = () => {
    setEditingListing(null);
    setModalFoodName('');
    setModalPrice('');
    setModalVisible(true);
  };

  // Open modal for editing an existing listing
  const handleOpenEditModal = (listing) => {
    setEditingListing(listing);
    setModalFoodName(listing.foodName);
    setModalPrice(String(listing.price));
    setModalVisible(true);
  };

  // Save the listing (add new or update existing)
  const handleSaveListing = () => {
    if (!modalFoodName.trim() || !modalPrice.trim()) return;

    const price = parseFloat(modalPrice);
    if (isNaN(price) || price < 0) return;

    if (editingListing) {
      // Update existing listing via shared context
      updateListing(editingListing.id, {
        foodName: modalFoodName.trim(),
        price,
      });
    } else {
      // Add new listing via shared context
      const newListing = {
        id: Date.now().toString(),
        vendorName: 'Your Store',
        vendorImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=50&h=50&fit=crop&crop=face',
        foodName: modalFoodName.trim(),
        description: 'Fresh and delicious!',
        category: 'Halal',
        priceTier: 'discounted',
        price: price,
        originalPrice: Math.round(price * 2),
        quantity: 10,
        expiryTime: '2026-07-02 20:00',
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
        isBlindBox: false,
        distance: '0.0 km',
      };
      addListing(newListing);
    }

    setModalVisible(false);
    setModalFoodName('');
    setModalPrice('');
    setEditingListing(null);
  };

  // Cancel modal
  const handleCancelModal = () => {
    setModalVisible(false);
    setModalFoodName('');
    setModalPrice('');
    setEditingListing(null);
  };

  // Vendor Dashboard View
  if (role === 'vendor') {
    return (
      <View style={styles.container}>
        {/* Custom Header */}
        <View style={[styles.vendorHeader, { paddingTop: insets.top + 16 }]}>
          <View>
            <Text style={styles.vendorTitle}>Your Store</Text>
            <Text style={styles.vendorSubtitle}>Vendor Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.vendorScroll}>
          {/* Stats Cards */}
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

          {/* Recent Orders */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            {recentOrders.map((order) => (
              <TouchableOpacity key={order.id} style={styles.orderItem}>
                <View style={styles.orderLeft}>
                  <Text style={styles.orderCustomer}>{order.customer}</Text>
                  <Text style={styles.orderItems}>{order.items}</Text>
                  <Text style={styles.orderTime}>{order.time}</Text>
                </View>
                <View style={[styles.orderStatus, 
                  { backgroundColor: order.status === 'Pending' ? '#FFF3E0' : 
                    order.status === 'Ready' ? '#E8F5E9' : '#F5F5F5' }]}>
                  <Text style={[styles.orderStatusText, 
                    { color: order.status === 'Pending' ? colors.secondary : 
                      order.status === 'Ready' ? colors.success : colors.grayDark }]}>
                    {order.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Your Listings */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Listings</Text>
              <TouchableOpacity style={styles.addButton} onPress={handleOpenAddModal}>
                <Ionicons name="add-circle" size={22} color={colors.primary} />
                <Text style={styles.addButtonText}>Add New</Text>
              </TouchableOpacity>
            </View>
            {vendorListings.length === 0 ? (
              <Text style={styles.emptyListingsText}>No listings yet. Tap "Add New" to create one!</Text>
            ) : (
              vendorListings.map((listing) => (
                <View key={listing.id} style={styles.vendorListingItem}>
                  <View style={styles.vendorListingInfo}>
                    <Text style={styles.vendorListingName}>{listing.foodName}</Text>
                    <Text style={styles.vendorListingMeta}>RM{listing.price.toFixed(2)} · {listing.quantity} left</Text>
                  </View>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleOpenEditModal(listing)}>
                    <Ionicons name="pencil" size={18} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          <TouchableOpacity style={styles.logoutButtonFull} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#C62828" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Add/Edit Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCancelModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingListing ? 'Edit Food Item' : 'Add New Food Item'}
              </Text>

              <Text style={styles.modalLabel}>Food Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Nasi Lemak"
                placeholderTextColor="#999"
                value={modalFoodName}
                onChangeText={setModalFoodName}
              />

              <Text style={styles.modalLabel}>Price (RM)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 4.00"
                placeholderTextColor="#999"
                value={modalPrice}
                onChangeText={setModalPrice}
                keyboardType="decimal-pad"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={handleCancelModal}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveListing}>
                  <Text style={styles.modalSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Customer View (original UI)
  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
      {/* Customer Header */}
      <View style={styles.customerHeaderRow}>
        <Text style={styles.customerGreeting}>👋 Welcome back!</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.grayDark} />
        </TouchableOpacity>
      </View>

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
      <FlatList
        data={filteredListings}
        renderItem={({ item }) => <ListingCard listing={item} onPress={() => navigation.navigate('Detail', { listing: item })} />}
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

  // Vendor specific
  vendorHeader: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vendorTitle: { fontSize: 22, fontWeight: 'bold', color: colors.white },
  vendorSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  vendorScroll: { flex: 1 },
  logoutButton: { padding: 8 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 8 },
  statCard: { width: '47%', borderRadius: 16, padding: 16, marginBottom: 8, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: colors.dark, marginTop: 8 },
  statLabel: { fontSize: 13, color: colors.grayDark, marginTop: 2 },
  sectionCard: { backgroundColor: colors.white, borderRadius: 16, marginHorizontal: 12, marginBottom: 12, padding: 16, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.dark, marginBottom: 12 },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.gray },
  orderLeft: { flex: 1 },
  orderCustomer: { fontSize: 15, fontWeight: '600', color: colors.dark },
  orderItems: { fontSize: 13, color: colors.grayDark, marginTop: 2 },
  orderTime: { fontSize: 12, color: '#999', marginTop: 2 },
  orderStatus: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  orderStatusText: { fontSize: 12, fontWeight: '600' },
  addButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  addButtonText: { fontSize: 14, color: colors.primary, fontWeight: '500', marginLeft: 4 },
  vendorListingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.gray },
  vendorListingInfo: { flex: 1 },
  vendorListingName: { fontSize: 15, fontWeight: '500', color: colors.dark },
  vendorListingMeta: { fontSize: 13, color: colors.grayDark, marginTop: 2 },
  editButton: { padding: 8 },
  logoutButtonFull: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, marginHorizontal: 12, marginTop: 8 },
  logoutText: { fontSize: 16, color: '#C62828', fontWeight: '500', marginLeft: 8 },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: colors.gray,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.gray,
    marginRight: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grayDark,
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    marginLeft: 8,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  emptyListingsText: {
    fontSize: 14,
    color: colors.grayDark,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default HomeScreen;