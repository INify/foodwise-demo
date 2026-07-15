import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Image, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../styles/colors';
import { useListings } from '../../context/ListingContext';
import { useAuth } from '../../context/AuthContext';

const VendorListingsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { listings, addListing, updateListing } = useListings();
  const vendorName = user?.name || 'Your Store';

  const vendorListings = listings.filter(l => l.vendorName === vendorName);

  // --- Eco Level & Badge System for Listings ---
  const getVendorEcoLevel = (count) => {
    if (count >= 50) return { level: '🏆 Zero Waste Hero', color: '#FFD700', next: null, badge: 'Zero Waste Hero' };
    if (count >= 30) return { level: '♻️ Eco Champion', color: '#4CAF50', next: 50, badge: 'Eco Champion' };
    if (count >= 15) return { level: '⭐ Community Star', color: '#2196F3', next: 30, badge: 'Community Star' };
    if (count >= 5) return { level: '🌿 Eco Partner', color: '#8BC34A', next: 15, badge: 'Eco Partner' };
    return { level: '🌱 Beginner', color: '#9E9E9E', next: 5, badge: 'Beginner' };
  };

  const ecoLevel = getVendorEcoLevel(vendorListings.length);
  const progress = vendorListings.length > 0 && ecoLevel.next 
    ? Math.min((vendorListings.length / ecoLevel.next) * 100, 100) 
    : 0;

  // --- Navigate to Add Listing Screen ---
  const handleAddNew = () => {
    navigation.navigate('AddListing');
  };

  // --- Edit Modal States (保留编辑功能) ---
  const [modalVisible, setModalVisible] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [modalFoodName, setModalFoodName] = useState('');
  const [modalPrice, setModalPrice] = useState('');
  const [modalPickupStart, setModalPickupStart] = useState(null);
  const [modalPickupEnd, setModalPickupEnd] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [modalItemType, setModalItemType] = useState('food');
  const [modalCategory, setModalCategory] = useState('Halal');
  const [modalImage, setModalImage] = useState(null);
  const [modalOriginalPrice, setModalOriginalPrice] = useState('');

  const getTodayString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseTimeString = (timeStr) => {
    if (!timeStr) return null;
    const date = new Date(timeStr);
    return isNaN(date.getTime()) ? null : date;
  };

  const handleOpenEditModal = (listing) => {
    setEditingListing(listing);
    setModalFoodName(listing.foodName);
    setModalPrice(String(listing.price));
    setModalPickupStart(parseTimeString(listing.pickupStart));
    setModalPickupEnd(parseTimeString(listing.pickupEnd));
    setShowStartPicker(false);
    setShowEndPicker(false);
    setModalItemType(listing.isBlindBox ? 'blindbox' : 'food');
    setModalCategory(listing.category || 'Halal');
    setModalImage(listing.isBlindBox ? null : (typeof listing.image === 'string' ? listing.image : null));
    setModalOriginalPrice(listing.originalPrice ? String(listing.originalPrice) : '');
    setModalVisible(true);
  };

  const formatTimeForDisplay = (date) => {
    if (!date) return 'Select time';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatTimeForStorage = (date) => {
    if (!date) return null;
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${getTodayString()} ${hours}:${minutes}`;
  };

  const handleStartTimeChange = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setModalPickupStart(selectedDate);
    }
  };

  const handleEndTimeChange = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setModalPickupEnd(selectedDate);
    }
  };

  const handleSaveListing = () => {
    if (!modalFoodName.trim() || !modalPrice.trim()) {
      Alert.alert('Missing Information', 'Please fill in the food name and price.');
      return;
    }

    const price = parseFloat(modalPrice);
    if (isNaN(price) || price < 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price.');
      return;
    }

    const isBlindBox = modalItemType === 'blindbox';

    if (!isBlindBox && !modalImage) {
      Alert.alert('Image Required', 'Please upload an image for regular food items. Blind box items do not require an image.');
      return;
    }

    const priceTier = price === 0 ? 'free' : isBlindBox ? 'special' : 'discounted';
    const originalPrice = modalOriginalPrice.trim() ? parseFloat(modalOriginalPrice) : 0;
    const today = getTodayString();

    const pickupStart = formatTimeForStorage(modalPickupStart);
    const pickupEnd = formatTimeForStorage(modalPickupEnd);

    const listingImage = isBlindBox
      ? require('../../assets/images/mystery-box.png')
      : modalImage;

    if (editingListing) {
      updateListing(editingListing.id, {
        foodName: modalFoodName.trim(),
        price,
        isBlindBox,
        category: modalCategory,
        priceTier,
        originalPrice,
        image: listingImage,
        ...(pickupStart ? { pickupStart } : {}),
        ...(pickupEnd ? { pickupEnd } : {}),
      });
    } else {
      const newListing = {
        id: Date.now().toString(),
        vendorName: vendorName,
        vendorImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=50&h=50&fit=crop&crop=face',
        foodName: modalFoodName.trim(),
        description: isBlindBox ? 'Surprise item! What will you get?' : 'Fresh and delicious!',
        category: modalCategory,
        priceTier: priceTier,
        price: price,
        originalPrice: originalPrice,
        quantity: 10,
        pickupStart: pickupStart || `${today} 18:00`,
        pickupEnd: pickupEnd || `${today} 19:00`,
        image: listingImage,
        isBlindBox: isBlindBox,
        distance: '0.0 km',
        urgent: false,
        countdown: '2h 00m',
      };
      addListing(newListing);
    }

    setModalVisible(false);
    setModalFoodName('');
    setModalPrice('');
    setModalPickupStart(null);
    setModalPickupEnd(null);
    setShowStartPicker(false);
    setShowEndPicker(false);
    setModalItemType('food');
    setModalCategory('Halal');
    setModalImage(null);
    setModalOriginalPrice('');
    setEditingListing(null);
  };

  const handleCancelModal = () => {
    setModalVisible(false);
    setModalFoodName('');
    setModalPrice('');
    setModalPickupStart(null);
    setModalPickupEnd(null);
    setShowStartPicker(false);
    setShowEndPicker(false);
    setModalItemType('food');
    setModalCategory('Halal');
    setModalImage(null);
    setModalOriginalPrice('');
    setEditingListing(null);
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload images!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setModalImage(result.assets[0].uri);
    }
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
            <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
              <Ionicons name="add-circle" size={22} color={colors.primary} />
              <Text style={styles.addButtonText}>Add New</Text>
            </TouchableOpacity>
          </View>

          {/* Badge Progress in Listings */}
          <View style={styles.listingsBadgeContainer}>
            <View style={styles.listingsBadgeRow}>
              <Text style={styles.listingsBadgeLevel}>{ecoLevel.level}</Text>
              <Text style={styles.listingsBadgeCount}>{vendorListings.length} listings</Text>
            </View>
            {ecoLevel.next && (
              <View style={styles.listingsProgressContainer}>
                <View style={styles.listingsProgressBar}>
                  <View style={[styles.listingsProgressFill, { width: `${Math.min(progress, 100)}%`, backgroundColor: ecoLevel.color }]} />
                </View>
                <Text style={styles.listingsProgressText}>
                  {vendorListings.length} / {ecoLevel.next} → Next: {ecoLevel.badge}
                </Text>
              </View>
            )}
            {!ecoLevel.next && vendorListings.length >= 50 && (
              <Text style={styles.listingsMaxLevel}>🏆 Maximum Level Achieved!</Text>
            )}
          </View>

          {vendorListings.length === 0 ? (
            <Text style={styles.emptyListingsText}>No listings yet. Tap "Add New" to create one!</Text>
          ) : (
            vendorListings.map((listing) => (
              <View key={listing.id} style={styles.vendorListingItem}>
                <View style={styles.vendorListingInfo}>
                  <Text style={styles.vendorListingName}>{listing.foodName}</Text>
                  <Text style={styles.vendorListingMeta}>RM{listing.price.toFixed(2)} · {listing.quantity} left</Text>
                  {listing.isBlindBox && (
                    <View style={styles.blindBoxTag}>
                      <Text style={styles.blindBoxTagText}>🎁 Blind Box</Text>
                    </View>
                  )}
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

      {/* Edit Modal (保留，用于编辑已有 listing) */}
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

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalLabel}>Item Type</Text>
              <View style={styles.itemTypeContainer}>
                <TouchableOpacity
                  style={[styles.itemTypeButton, modalItemType === 'food' && styles.itemTypeButtonActive]}
                  onPress={() => setModalItemType('food')}
                >
                  <Ionicons name="restaurant-outline" size={18} color={modalItemType === 'food' ? colors.white : colors.grayDark} />
                  <Text style={[styles.itemTypeText, modalItemType === 'food' && styles.itemTypeTextActive]}>Regular Food</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.itemTypeButton, modalItemType === 'blindbox' && styles.itemTypeButtonActive]}
                  onPress={() => {
                    setModalItemType('blindbox');
                    setModalImage(null);
                  }}
                >
                  <Ionicons name="gift-outline" size={18} color={modalItemType === 'blindbox' ? colors.white : colors.grayDark} />
                  <Text style={[styles.itemTypeText, modalItemType === 'blindbox' && styles.itemTypeTextActive]}>Blind Box</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalLabel}>Food Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Nasi Lemak"
                placeholderTextColor="#999"
                value={modalFoodName}
                onChangeText={setModalFoodName}
              />

              <Text style={styles.modalLabel}>Category</Text>
              <View style={styles.categoryContainer}>
                <TouchableOpacity
                  style={[styles.categoryButton, modalCategory === 'Halal' && styles.categoryButtonActive]}
                  onPress={() => setModalCategory('Halal')}
                >
                  <Text style={[styles.categoryText, modalCategory === 'Halal' && styles.categoryTextActive]}>Halal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.categoryButton, modalCategory === 'Non-Halal' && styles.categoryButtonActive]}
                  onPress={() => setModalCategory('Non-Halal')}
                >
                  <Text style={[styles.categoryText, modalCategory === 'Non-Halal' && styles.categoryTextActive]}>Non-Halal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.categoryButton, modalCategory === 'Vegetarian' && styles.categoryButtonActive]}
                  onPress={() => setModalCategory('Vegetarian')}
                >
                  <Text style={[styles.categoryText, modalCategory === 'Vegetarian' && styles.categoryTextActive]}>Vegetarian</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalLabel}>Price (RM) {modalPrice === '0' || modalPrice === '0.00' ? '(Free!)' : ''}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 4.00 (enter 0 for free)"
                placeholderTextColor="#999"
                value={modalPrice}
                onChangeText={setModalPrice}
                keyboardType="decimal-pad"
              />

              <Text style={styles.modalLabel}>Original Price (RM) — Optional</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 8.00 (leave empty if none)"
                placeholderTextColor="#999"
                value={modalOriginalPrice}
                onChangeText={setModalOriginalPrice}
                keyboardType="decimal-pad"
              />

              <Text style={styles.modalLabel}>Pickup Start Time</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowStartPicker(true)}
              >
                <Ionicons name="time-outline" size={20} color={colors.primary} />
                <Text style={[styles.timePickerText, !modalPickupStart && styles.timePickerPlaceholder]}>
                  {formatTimeForDisplay(modalPickupStart)}
                </Text>
              </TouchableOpacity>

              {showStartPicker && (
                <DateTimePicker
                  value={modalPickupStart || new Date()}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleStartTimeChange}
                />
              )}

              <Text style={styles.modalLabel}>Pickup End Time</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowEndPicker(true)}
              >
                <Ionicons name="time-outline" size={20} color={colors.primary} />
                <Text style={[styles.timePickerText, !modalPickupEnd && styles.timePickerPlaceholder]}>
                  {formatTimeForDisplay(modalPickupEnd)}
                </Text>
              </TouchableOpacity>

              {showEndPicker && (
                <DateTimePicker
                  value={modalPickupEnd || new Date()}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleEndTimeChange}
                />
              )}

              {modalItemType === 'food' && (
                <>
                  <Text style={styles.modalLabel}>Food Image (Required)</Text>
                  <TouchableOpacity style={styles.imagePickerButton} onPress={handlePickImage}>
                    {modalImage ? (
                      <Image source={{ uri: modalImage }} style={styles.imagePreview} resizeMode="cover" />
                    ) : (
                      <View style={styles.imagePickerPlaceholder}>
                        <Ionicons name="image-outline" size={32} color={colors.grayDark} />
                        <Text style={styles.imagePickerText}>Tap to upload image</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </>
              )}

              {modalItemType === 'blindbox' && (
                <View style={styles.blindBoxInfoBox}>
                  <Ionicons name="gift-outline" size={24} color={colors.secondary} />
                  <Text style={styles.blindBoxInfoText}>
                    Blind box items use a mystery box image automatically — no photo upload needed!
                  </Text>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={handleCancelModal}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveListing}>
                  <Text style={styles.modalSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  vendorTitle: { fontSize: 22, fontWeight: 'bold', color: colors.white },
  vendorSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  vendorScroll: { flex: 1 },
  sectionCard: { 
    backgroundColor: colors.white, 
    borderRadius: 16, 
    marginHorizontal: 12, 
    marginTop: 16, 
    padding: 16, 
    shadowColor: colors.shadow, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 2 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: colors.dark, 
    marginBottom: 12 
  },
  addButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  addButtonText: { 
    fontSize: 14, 
    color: colors.primary, 
    fontWeight: '500', 
    marginLeft: 4 
  },

  // Badge Progress Styles
  listingsBadgeContainer: { 
    backgroundColor: '#F5F8F5', 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 12 
  },
  listingsBadgeRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  listingsBadgeLevel: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: colors.dark 
  },
  listingsBadgeCount: { 
    fontSize: 13, 
    color: colors.grayDark 
  },
  listingsProgressContainer: { 
    marginTop: 6 
  },
  listingsProgressBar: { 
    height: 4, 
    backgroundColor: colors.grayLight, 
    borderRadius: 2, 
    overflow: 'hidden' 
  },
  listingsProgressFill: { 
    height: '100%', 
    borderRadius: 2 
  },
  listingsProgressText: { 
    fontSize: 11, 
    color: colors.grayDark, 
    marginTop: 4 
  },
  listingsMaxLevel: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: colors.gold, 
    textAlign: 'center', 
    marginTop: 4 
  },

  vendorListingItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.gray 
  },
  vendorListingInfo: { flex: 1 },
  vendorListingName: { 
    fontSize: 15, 
    fontWeight: '500', 
    color: colors.dark 
  },
  vendorListingMeta: { 
    fontSize: 13, 
    color: colors.grayDark, 
    marginTop: 2 
  },
  blindBoxTag: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  blindBoxTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.secondary,
  },
  editButton: { padding: 8 },
  emptyListingsText: { 
    fontSize: 14, 
    color: colors.grayDark, 
    textAlign: 'center', 
    paddingVertical: 20 
  },

  // Modal Styles
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    backgroundColor: colors.white, 
    borderRadius: 20, 
    padding: 24, 
    width: '85%', 
    height: '85%', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 8 
  },
  modalScroll: { flex: 1 },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: colors.dark, 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  modalLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: colors.dark, 
    marginBottom: 6 
  },
  modalInput: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    fontSize: 16, 
    marginBottom: 16, 
    backgroundColor: colors.gray 
  },
  modalButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 8 
  },
  modalCancelButton: { 
    flex: 1, 
    paddingVertical: 14, 
    borderRadius: 12, 
    backgroundColor: colors.gray, 
    marginRight: 8, 
    alignItems: 'center' 
  },
  modalCancelText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: colors.grayDark 
  },
  modalSaveButton: { 
    flex: 1, 
    paddingVertical: 14, 
    borderRadius: 12, 
    backgroundColor: colors.primary, 
    marginLeft: 8, 
    alignItems: 'center' 
  },
  modalSaveText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: colors.white 
  },
  itemTypeContainer: { 
    flexDirection: 'row', 
    gap: 8, 
    marginBottom: 16 
  },
  itemTypeButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 6, 
    paddingVertical: 12, 
    borderRadius: 12, 
    borderWidth: 1.5, 
    borderColor: '#ddd', 
    backgroundColor: colors.gray 
  },
  itemTypeButtonActive: { 
    backgroundColor: colors.primary, 
    borderColor: colors.primary 
  },
  itemTypeText: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: colors.grayDark 
  },
  itemTypeTextActive: { 
    color: colors.white 
  },
  categoryContainer: { 
    flexDirection: 'row', 
    gap: 6, 
    marginBottom: 16 
  },
  categoryButton: { 
    flex: 1, 
    paddingVertical: 10, 
    borderRadius: 10, 
    borderWidth: 1.5, 
    borderColor: '#ddd', 
    backgroundColor: colors.gray, 
    alignItems: 'center' 
  },
  categoryButtonActive: { 
    backgroundColor: colors.primary, 
    borderColor: colors.primary 
  },
  categoryText: { 
    fontSize: 11, 
    fontWeight: '600', 
    color: colors.grayDark 
  },
  categoryTextActive: { 
    color: colors.white 
  },
  timePickerButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    marginBottom: 16, 
    backgroundColor: colors.gray, 
    gap: 8 
  },
  timePickerText: { 
    fontSize: 16, 
    color: colors.dark, 
    fontWeight: '500' 
  },
  timePickerPlaceholder: { 
    color: '#999', 
    fontWeight: '400' 
  },
  imagePickerButton: { 
    marginBottom: 16, 
    borderRadius: 12, 
    overflow: 'hidden' 
  },
  imagePickerPlaceholder: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 150, 
    borderWidth: 2, 
    borderColor: '#ddd', 
    borderStyle: 'dashed', 
    borderRadius: 12, 
    backgroundColor: colors.gray, 
    gap: 8 
  },
  imagePickerText: { 
    fontSize: 14, 
    color: colors.grayDark 
  },
  imagePreview: { 
    width: '100%', 
    height: 150, 
    borderRadius: 12 
  },
  blindBoxInfoBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    padding: 16, 
    borderRadius: 12, 
    backgroundColor: '#FFF3E0', 
    marginBottom: 16 
  },
  blindBoxInfoText: { 
    flex: 1, 
    fontSize: 13, 
    color: colors.grayDark, 
    lineHeight: 18 
  },
});

export default VendorListingsScreen;
