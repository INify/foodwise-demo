import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, Image, Alert, Platform, KeyboardAvoidingView 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../styles/colors';
import { useListings } from '../../context/ListingContext';
import { useAuth } from '../../context/AuthContext';

const AddListingScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { addListing } = useListings();
  const vendorName = user?.name || 'Your Store';

  // --- Form States ---
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(3);
  const [pickupStart, setPickupStart] = useState(null);
  const [pickupEnd, setPickupEnd] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [isBlindBox, setIsBlindBox] = useState(false);

  // --- Categories ---
  const categories = ['Rice', 'Bakery', 'Noodles', 'Drinks', 'Snacks', 'Other'];

  // --- Time Helpers ---
  const getTodayString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
      setPickupStart(selectedDate);
    }
  };

  const handleEndTimeChange = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setPickupEnd(selectedDate);
    }
  };

  // --- Image Picker ---
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
      setImage(result.assets[0].uri);
    }
  };

  // --- Quantity Controls ---
  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, 20));
  const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 0));

  // --- Submit ---
  const handleSubmit = () => {
    // Validation
    if (!foodName.trim()) {
      Alert.alert('Missing Info', 'Please enter the food name.');
      return;
    }
    if (!category) {
      Alert.alert('Missing Info', 'Please select a category.');
      return;
    }
    if (!price || parseFloat(price) < 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price.');
      return;
    }
    if (!image) {
      Alert.alert('Image Required', 'Please upload a photo of the food.');
      return;
    }
    if (!pickupStart || !pickupEnd) {
      Alert.alert('Missing Time', 'Please select pickup time window.');
      return;
    }

    const priceNum = parseFloat(price);
    const originalPriceNum = originalPrice ? parseFloat(originalPrice) : 0;
    const today = getTodayString();

    const newListing = {
      id: Date.now().toString(),
      vendorName: vendorName,
      vendorImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=50&h=50&fit=crop&crop=face',
      foodName: foodName.trim(),
      description: description.trim() || 'Fresh and delicious!',
      category: category,
      priceTier: priceNum === 0 ? 'free' : 'discounted',
      price: priceNum,
      originalPrice: originalPriceNum,
      quantity: quantity,
      pickupStart: formatTimeForStorage(pickupStart),
      pickupEnd: formatTimeForStorage(pickupEnd),
      image: image,
      isBlindBox: false,
      distance: '0.0 km',
      urgent: false,
      countdown: '2h 00m',
    };

    addListing(newListing);
    
    Alert.alert(
      'Success! 🎉',
      `${foodName} has been listed successfully.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color={colors.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>List Surplus Food</Text>
        </View>

        <Text style={styles.headerSubtitle}>Add items that would otherwise go to waste</Text>

        {/* Image Upload */}
        <TouchableOpacity style={styles.imageUploadContainer} onPress={handlePickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={48} color={colors.grayDark} />
              <Text style={styles.imagePlaceholderText}>Tap to add a photo</Text>
              <Text style={styles.imagePlaceholderSubtext}>A photo increases reservations by 3x</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Food Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>ITEM NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Nasi Lemak Set"
            placeholderTextColor="#999"
            value={foodName}
            onChangeText={setFoodName}
          />
        </View>

        {/* Category */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>CATEGORY</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.categoryChipText, category === cat && styles.categoryChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Prices Row */}
        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>ORIGINAL PRICE (RM)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#999"
              value={originalPrice}
              onChangeText={setOriginalPrice}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>YOUR PRICE (RM)</Text>
            <TextInput
              style={[styles.input, styles.priceInput]}
              placeholder="0.00"
              placeholderTextColor="#999"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Quantity */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>QUANTITY AVAILABLE</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
              <Ionicons name="remove" size={24} color={colors.dark} />
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
              <Ionicons name="add" size={24} color={colors.dark} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Pickup Time */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>PICKUP FROM</Text>
          <View style={styles.timeRow}>
            <TouchableOpacity style={styles.timeButton} onPress={() => setShowStartPicker(true)}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={[styles.timeText, !pickupStart && styles.timePlaceholder]}>
                {formatTimeForDisplay(pickupStart)}
              </Text>
            </TouchableOpacity>
            <Text style={styles.timeSeparator}>to</Text>
            <TouchableOpacity style={styles.timeButton} onPress={() => setShowEndPicker(true)}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={[styles.timeText, !pickupEnd && styles.timePlaceholder]}>
                {formatTimeForDisplay(pickupEnd)}
              </Text>
            </TouchableOpacity>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={pickupStart || new Date()}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleStartTimeChange}
            />
          )}
          {showEndPicker && (
            <DateTimePicker
              value={pickupEnd || new Date()}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleEndTimeChange}
            />
          )}
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>DESCRIPTION</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your food item..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>List Surplus Food</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.white} />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.grayLight },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  backButton: { padding: 4, marginRight: 8 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: colors.dark },
  headerSubtitle: { fontSize: 14, color: colors.grayDark, marginBottom: 24 },

  // Image Upload
  imageUploadContainer: { 
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  imagePlaceholder: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.grayLight,
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: colors.grayLight,
    margin: 2,
  },
  imagePlaceholderText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: colors.dark, 
    marginTop: 8 
  },
  imagePlaceholderSubtext: { 
    fontSize: 13, 
    color: colors.grayDark, 
    marginTop: 4 
  },
  imagePreview: { 
    width: '100%', 
    height: 200,
    borderRadius: 16,
  },

  // Form Group
  formGroup: { marginBottom: 20 },
  label: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: colors.grayDark, 
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.grayLight,
    color: colors.dark,
  },
  priceInput: {
    borderColor: colors.secondary,
    borderWidth: 2,
  },
  textArea: { 
    height: 100, 
    paddingTop: 14,
    textAlignVertical: 'top',
  },

  // Category
  categoryGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8 
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grayLight,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.grayDark,
  },
  categoryChipTextActive: {
    color: colors.white,
  },

  // Row
  row: { flexDirection: 'row' },

  // Quantity
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grayLight,
  },
  quantityValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark,
    minWidth: 40,
    textAlign: 'center',
  },

  // Time
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.grayLight,
    gap: 8,
  },
  timeText: {
    fontSize: 16,
    color: colors.dark,
    fontWeight: '500',
  },
  timePlaceholder: {
    color: '#999',
    fontWeight: '400',
  },
  timeSeparator: {
    fontSize: 14,
    color: colors.grayDark,
    fontWeight: '500',
  },

  // Submit Button
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
});

export default AddListingScreen;
