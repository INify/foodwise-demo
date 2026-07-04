import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Image, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../styles/colors';
import { useListings } from '../context/ListingContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';

const VendorDashboard = ({ navigation, onLogout }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { listings, addListing, updateListing } = useListings();
  const { orders, updateOrderStatus } = useOrders();
  const vendorName = user?.name || 'Your Store';

  const vendorListings = listings.filter(l => l.vendorName === vendorName);

  // Show all orders in this demo (single device, no backend)
  const vendorOrders = orders;

  const totalOrdersCount = vendorOrders.length;
  const pendingCount = vendorOrders.filter(o => o.status === 'Pending' || o.status === 'Ready').length;
  const totalRevenue = vendorOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const vendorStats = {
    totalListings: vendorListings.length,
    totalOrders: totalOrdersCount,
    pendingPickups: pendingCount,
    revenue: totalRevenue,
  };

  const recentOrders = vendorOrders.map(o => ({
    id: o.id,
    customer: o.customerName || 'Customer',
    items: `${o.listing?.foodName || 'Item'} × ${o.quantity}`,
    status: o.status,
    time: new Date(o.pickupTime).toLocaleString(),
    _raw: o,
  }));

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
  const [pickupModalVisible, setPickupModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
    setModalPickupStart(null);
    setModalPickupEnd(null);
    setShowStartPicker(false);
    setShowEndPicker(false);
    setModalItemType('food');
    setModalCategory('Halal');
    setModalImage(null);
    setModalOriginalPrice('');
    setModalVisible(true);
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

    // Regular food items require an image; blind boxes use the mystery box asset
    if (!isBlindBox && !modalImage) {
      Alert.alert('Image Required', 'Please upload an image for regular food items. Blind box items do not require an image.');
      return;
    }

    // Determine price tier: free (price=0), special (blind box), or discounted
    const priceTier = price === 0 ? 'free' : isBlindBox ? 'special' : 'discounted';

    // Parse optional original price; 0 if not provided
    const originalPrice = modalOriginalPrice.trim() ? parseFloat(modalOriginalPrice) : 0;

    const today = getTodayString();

    const pickupStart = formatTimeForStorage(modalPickupStart);
    const pickupEnd = formatTimeForStorage(modalPickupEnd);

    const listingImage = isBlindBox
      ? require('../assets/images/mystery-box.png')
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
        <View>
          <Text style={styles.vendorTitle}>{vendorName}</Text>
          <Text style={styles.vendorSubtitle}>Vendor Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.vendorScroll}>
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

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {recentOrders.length === 0 ? (
            <Text style={styles.emptyListingsText}>No orders yet. Orders placed by customers will appear here.</Text>
          ) : (
            recentOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderItem}
                onPress={() => {
                  setSelectedOrder(order);
                  setPickupModalVisible(true);
                }}
              >
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
            ))
          )}
        </View>

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

      {/* Pickup Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={pickupModalVisible}
        onRequestClose={() => setPickupModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickupModalContent}>
            <View style={styles.pickupModalHeader}>
              <Text style={styles.pickupModalTitle}>Pickup Details</Text>
              <TouchableOpacity onPress={() => setPickupModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.grayDark} />
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <>
                <View style={[styles.pickupStatusBadge,
                  { backgroundColor: selectedOrder.status === 'Pending' ? '#FFF3E0' :
                    selectedOrder.status === 'Ready' ? '#E8F5E9' : '#F5F5F5' }]}>
                  <Ionicons
                    name={selectedOrder.status === 'Pending' ? 'time' : selectedOrder.status === 'Ready' ? 'checkmark-circle' : 'checkmark-done'}
                    size={20}
                    color={selectedOrder.status === 'Pending' ? colors.secondary :
                      selectedOrder.status === 'Ready' ? colors.success : colors.grayDark}
                  />
                  <Text style={[styles.pickupStatusText,
                    { color: selectedOrder.status === 'Pending' ? colors.secondary :
                      selectedOrder.status === 'Ready' ? colors.success : colors.grayDark }]}>
                    {selectedOrder.status}
                  </Text>
                </View>

                <View style={styles.pickupDetailRow}>
                  <Ionicons name="person-outline" size={18} color={colors.grayDark} />
                  <Text style={styles.pickupDetailLabel}>Customer</Text>
                  <Text style={styles.pickupDetailValue}>{selectedOrder.customer}</Text>
                </View>
                <View style={styles.pickupDetailRow}>
                  <Ionicons name="receipt-outline" size={18} color={colors.grayDark} />
                  <Text style={styles.pickupDetailLabel}>Order ID</Text>
                  <Text style={styles.pickupDetailValue}>{selectedOrder.id}</Text>
                </View>
                <View style={styles.pickupDetailRow}>
                  <Ionicons name="cart-outline" size={18} color={colors.grayDark} />
                  <Text style={styles.pickupDetailLabel}>Items</Text>
                  <Text style={styles.pickupDetailValue}>{selectedOrder.items}</Text>
                </View>
                <View style={styles.pickupDetailRow}>
                  <Ionicons name="time-outline" size={18} color={colors.grayDark} />
                  <Text style={styles.pickupDetailLabel}>Ordered</Text>
                  <Text style={styles.pickupDetailValue}>{selectedOrder.time}</Text>
                </View>

                {/* Status-based action buttons */}
                {selectedOrder.status === 'Pending' && (
                  <TouchableOpacity
                    style={[styles.pickupActionButton, { backgroundColor: colors.success, marginTop: 20 }]}
                    onPress={() => {
                      const orderId = selectedOrder._raw ? selectedOrder._raw.id : selectedOrder.id;
                      updateOrderStatus(orderId, 'Ready');
                      setPickupModalVisible(false);
                    }}
                  >
                    <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} />
                    <Text style={styles.pickupActionText}>Mark as Ready</Text>
                  </TouchableOpacity>
                )}
                {selectedOrder.status === 'Ready' && (
                  <>
                    <TouchableOpacity
                      style={[styles.pickupActionButton, { backgroundColor: colors.primary, marginTop: 20 }]}
                      onPress={() => {
                        setPickupModalVisible(false);
                        const raw = selectedOrder._raw || selectedOrder;
                        navigation.navigate('VendorScanner', { expectedOrder: raw });
                      }}
                    >
                      <Ionicons name="scan-outline" size={20} color={colors.white} />
                      <Text style={styles.pickupActionText}>Scan QR Code to Confirm Pickup</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.pickupActionButton, { backgroundColor: '#1565C0', marginTop: 12 }]}
                      onPress={() => {
                        const orderId = selectedOrder._raw ? selectedOrder._raw.id : selectedOrder.id;
                        updateOrderStatus(orderId, 'Picked Up');
                        setPickupModalVisible(false);
                      }}
                    >
                      <Ionicons name="hand-left-outline" size={20} color={colors.white} />
                      <Text style={styles.pickupActionText}>Mark as Picked Up (Manual)</Text>
                    </TouchableOpacity>
                  </>
                )}
                {selectedOrder.status === 'Picked Up' && (
                  <View style={[styles.pickupActionButton, { backgroundColor: '#E8F5E9', marginTop: 20, justifyContent: 'center' }]}>
                    <Ionicons name="checkmark-done-circle" size={20} color={colors.success} />
                    <Text style={[styles.pickupActionText, { color: colors.success }]}>Order Completed</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray },
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
  emptyListingsText: { fontSize: 14, color: colors.grayDark, textAlign: 'center', paddingVertical: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: colors.white, borderRadius: 20, padding: 24, width: '85%', height: '85%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  modalScroll: { flex: 1 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.dark, marginBottom: 20, textAlign: 'center' },
  modalLabel: { fontSize: 14, fontWeight: '600', color: colors.dark, marginBottom: 6 },
  modalInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, marginBottom: 16, backgroundColor: colors.gray },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  modalCancelButton: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: colors.gray, marginRight: 8, alignItems: 'center' },
  modalCancelText: { fontSize: 16, fontWeight: '600', color: colors.grayDark },
  modalSaveButton: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: colors.primary, marginLeft: 8, alignItems: 'center' },
  modalSaveText: { fontSize: 16, fontWeight: '600', color: colors.white },
  itemTypeContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  itemTypeButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: '#ddd', backgroundColor: colors.gray },
  itemTypeButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  itemTypeText: { fontSize: 13, fontWeight: '600', color: colors.grayDark },
  itemTypeTextActive: { color: colors.white },
  categoryContainer: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  categoryButton: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#ddd', backgroundColor: colors.gray, alignItems: 'center' },
  categoryButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryText: { fontSize: 11, fontWeight: '600', color: colors.grayDark },
  categoryTextActive: { color: colors.white },
  imagePickerButton: { marginBottom: 16, borderRadius: 12, overflow: 'hidden' },
  imagePickerPlaceholder: { alignItems: 'center', justifyContent: 'center', height: 150, borderWidth: 2, borderColor: '#ddd', borderStyle: 'dashed', borderRadius: 12, backgroundColor: colors.gray, gap: 8 },
  imagePickerText: { fontSize: 14, color: colors.grayDark },
  imagePreview: { width: '100%', height: 150, borderRadius: 12 },
  blindBoxInfoBox: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, borderRadius: 12, backgroundColor: '#FFF3E0', marginBottom: 16 },
  blindBoxInfoText: { flex: 1, fontSize: 13, color: colors.grayDark, lineHeight: 18 },
  timePickerButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 16, backgroundColor: colors.gray, gap: 8 },
  timePickerText: { fontSize: 16, color: colors.dark, fontWeight: '500' },
  timePickerPlaceholder: { color: '#999', fontWeight: '400' },
  pickupModalContent: { backgroundColor: colors.white, borderRadius: 20, padding: 24, width: '85%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  pickupModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  pickupModalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.dark },
  pickupStatusBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, marginBottom: 16, gap: 6 },
  pickupStatusText: { fontSize: 16, fontWeight: 'bold' },
  pickupDetailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.gray, gap: 8 },
  pickupDetailLabel: { fontSize: 14, color: colors.grayDark, flex: 1, marginLeft: 4 },
  pickupDetailValue: { fontSize: 14, color: colors.dark, fontWeight: '500', textAlign: 'right' },
  pickupActionButton: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, gap: 8 },
  pickupActionText: { fontSize: 15, fontWeight: '600', color: colors.white },
});

export default VendorDashboard;