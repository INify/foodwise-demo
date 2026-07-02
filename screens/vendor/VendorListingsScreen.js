import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { useListings } from '../../context/ListingContext';
import { useAuth } from '../../context/AuthContext';

const VendorListingsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { listings, addListing, updateListing } = useListings();
  const vendorName = user?.name || 'Your Store';

  const vendorListings = listings.filter(l => l.vendorName === vendorName);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [modalFoodName, setModalFoodName] = useState('');
  const [modalPrice, setModalPrice] = useState('');
  const [modalPickupStart, setModalPickupStart] = useState('');
  const [modalPickupEnd, setModalPickupEnd] = useState('');

  const getTodayString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleOpenAddModal = () => {
    setEditingListing(null);
    setModalFoodName('');
    setModalPrice('');
    setModalPickupStart('');
    setModalPickupEnd('');
    setModalVisible(true);
  };

  const handleOpenEditModal = (listing) => {
    setEditingListing(listing);
    setModalFoodName(listing.foodName);
    setModalPrice(String(listing.price));
    setModalPickupStart(listing.pickupStart || '');
    setModalPickupEnd(listing.pickupEnd || '');
    setModalVisible(true);
  };

  const handleSaveListing = () => {
    if (!modalFoodName.trim() || !modalPrice.trim()) return;

    const price = parseFloat(modalPrice);
    if (isNaN(price) || price < 0) return;

    const today = getTodayString();

    let pickupStart = modalPickupStart.trim();
    let pickupEnd = modalPickupEnd.trim();

    if (pickupStart && !pickupStart.includes('-')) {
      pickupStart = `${today} ${pickupStart}`;
    }
    if (pickupEnd && !pickupEnd.includes('-')) {
      pickupEnd = `${today} ${pickupEnd}`;
    }

    if (editingListing) {
      updateListing(editingListing.id, {
        foodName: modalFoodName.trim(),
        price,
        ...(pickupStart ? { pickupStart } : {}),
        ...(pickupEnd ? { pickupEnd } : {}),
      });
    } else {
      const newListing = {
        id: Date.now().toString(),
        vendorName: vendorName,
        vendorImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=50&h=50&fit=crop&crop=face',
        foodName: modalFoodName.trim(),
        description: 'Fresh and delicious!',
        category: 'Halal',
        priceTier: 'discounted',
        price: price,
        originalPrice: Math.round(price * 2),
        quantity: 10,
        pickupStart: pickupStart || `${today} 18:00`,
        pickupEnd: pickupEnd || `${today} 19:00`,
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
        isBlindBox: false,
        distance: '0.0 km',
      };
      addListing(newListing);
    }

    setModalVisible(false);
    setModalFoodName('');
    setModalPrice('');
    setModalPickupStart('');
    setModalPickupEnd('');
    setEditingListing(null);
  };

  const handleCancelModal = () => {
    setModalVisible(false);
    setModalFoodName('');
    setModalPrice('');
    setModalPickupStart('');
    setModalPickupEnd('');
    setEditingListing(null);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.vendorHeader, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="menu" size={28} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.vendorTitle}>{vendorName}</Text>
          <Text style={styles.vendorSubtitle}>Your Listings</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.vendorScroll}>
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

        <View style={{ height: 40 }} />
      </ScrollView>

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

            <Text style={styles.modalLabel}>Pickup Start Time (HH:MM)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 18:00"
              placeholderTextColor="#999"
              value={modalPickupStart}
              onChangeText={setModalPickupStart}
            />

            <Text style={styles.modalLabel}>Pickup End Time (HH:MM)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 19:00"
              placeholderTextColor="#999"
              value={modalPickupEnd}
              onChangeText={setModalPickupEnd}
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
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray },
  vendorHeader: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center' },
  menuButton: { padding: 4, marginRight: 12 },
  headerTextContainer: { flex: 1 },
  vendorTitle: { fontSize: 22, fontWeight: 'bold', color: colors.white },
  vendorSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  vendorScroll: { flex: 1 },
  sectionCard: { backgroundColor: colors.white, borderRadius: 16, marginHorizontal: 12, marginTop: 16, padding: 16, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.dark, marginBottom: 12 },
  addButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  addButtonText: { fontSize: 14, color: colors.primary, fontWeight: '500', marginLeft: 4 },
  vendorListingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.gray },
  vendorListingInfo: { flex: 1 },
  vendorListingName: { fontSize: 15, fontWeight: '500', color: colors.dark },
  vendorListingMeta: { fontSize: 13, color: colors.grayDark, marginTop: 2 },
  editButton: { padding: 8 },
  emptyListingsText: { fontSize: 14, color: colors.grayDark, textAlign: 'center', paddingVertical: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: colors.white, borderRadius: 20, padding: 24, width: '85%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.dark, marginBottom: 20, textAlign: 'center' },
  modalLabel: { fontSize: 14, fontWeight: '600', color: colors.dark, marginBottom: 6 },
  modalInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, marginBottom: 16, backgroundColor: colors.gray },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  modalCancelButton: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: colors.gray, marginRight: 8, alignItems: 'center' },
  modalCancelText: { fontSize: 16, fontWeight: '600', color: colors.grayDark },
  modalSaveButton: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: colors.primary, marginLeft: 8, alignItems: 'center' },
  modalSaveText: { fontSize: 16, fontWeight: '600', color: colors.white },
});

export default VendorListingsScreen;