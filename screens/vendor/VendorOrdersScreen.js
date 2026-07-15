import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrdersContext';
import { useListings } from '../../context/ListingContext';

const VendorOrdersScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { orders } = useOrders();
  const { listings } = useListings();
  const vendorName = user?.name || 'Your Store';

  // Get vendor's orders
  const vendorOrders = orders;

  // --- Order Stats ---
  const totalOrdersCount = vendorOrders.length;
  const pickedUpCount = vendorOrders.filter(o => o.status === 'Picked Up').length;
  const pendingCount = vendorOrders.filter(o => o.status === 'Pending' || o.status === 'Ready').length;
  const completionRate = totalOrdersCount > 0 ? Math.round((pickedUpCount / totalOrdersCount) * 100) : 0;

  // Get completion rate emoji
  const getCompletionEmoji = () => {
    if (completionRate >= 90) return '🏆';
    if (completionRate >= 70) return '🌟';
    if (completionRate >= 50) return '📈';
    return '📊';
  };

  // Get order status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return colors.secondary;
      case 'Ready': return colors.success;
      case 'Picked Up': return colors.primary;
      default: return colors.grayDark;
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'Pending': return '#FFF3E0';
      case 'Ready': return '#E8F5E9';
      case 'Picked Up': return '#E3F2FD';
      default: return colors.grayLight;
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
          <Text style={styles.vendorSubtitle}>Recent Orders</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.vendorScroll}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📦 Orders Overview</Text>

          {/* --- Order Stats Row --- */}
          <View style={styles.orderStatsRow}>
            <View style={styles.orderStat}>
              <Text style={styles.orderStatNumber}>{totalOrdersCount}</Text>
              <Text style={styles.orderStatLabel}>Total Orders</Text>
            </View>
            <View style={styles.orderStatDivider} />
            <View style={styles.orderStat}>
              <Text style={[styles.orderStatNumber, { color: colors.success }]}>
                {pickedUpCount}
              </Text>
              <Text style={styles.orderStatLabel}>Completed</Text>
            </View>
            <View style={styles.orderStatDivider} />
            <View style={styles.orderStat}>
              <Text style={[styles.orderStatNumber, { color: colors.secondary }]}>
                {pendingCount}
              </Text>
              <Text style={styles.orderStatLabel}>Pending</Text>
            </View>
            <View style={styles.orderStatDivider} />
            <View style={styles.orderStat}>
              <Text style={[styles.orderStatNumber, { 
                color: completionRate >= 80 ? colors.success : 
                       completionRate >= 50 ? colors.secondary : colors.danger 
              }]}>
                {completionRate}%
              </Text>
              <Text style={styles.orderStatLabel}>Completion</Text>
            </View>
          </View>

          {/* --- Completion Rate Message --- */}
          <View style={styles.completionMessage}>
            <Text style={styles.completionEmoji}>{getCompletionEmoji()}</Text>
            <Text style={styles.completionText}>
              {completionRate >= 80 ? 'Excellent completion rate! Keep it up! 🎉' :
               completionRate >= 50 ? 'Good progress! Aim for 80%+ completion.' :
               totalOrdersCount === 0 ? 'No orders yet. Start listing food items!' :
               'Focus on completing pending orders to improve your rate.'}
            </Text>
          </View>

          {/* --- Orders List --- */}
          <Text style={[styles.sectionTitle, { marginTop: 16, fontSize: 16 }]}>Recent Orders</Text>
          {vendorOrders.length === 0 ? (
            <Text style={styles.emptyOrdersText}>No orders yet. Orders placed by customers will appear here.</Text>
          ) : (
            vendorOrders.map((order) => {
              // Find listing for this order
              const listing = listings.find(l => l.id === order.listingId);
              return (
                <TouchableOpacity
                  key={order.id}
                  style={styles.orderItem}
                  onPress={() => navigation.navigate('VendorOrderDetail', { order })}
                  activeOpacity={0.7}
                >
                  <View style={styles.orderLeft}>
                    <View style={styles.orderHeader}>
                      <Text style={styles.orderCustomer}>{order.customerName || 'Customer'}</Text>
                      <View style={[styles.orderStatus, { backgroundColor: getStatusBg(order.status) }]}>
                        <Text style={[styles.orderStatusText, { color: getStatusColor(order.status) }]}>
                          {order.status}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.orderItems}>
                      {listing?.foodName || 'Item'} × {order.quantity || 1}
                    </Text>
                    <Text style={styles.orderTime}>
                      🕐 {order.pickupTime ? new Date(order.pickupTime).toLocaleString() : 'Pickup time not set'}
                    </Text>
                  </View>
                  <View style={styles.orderRight}>
                    <Text style={styles.orderPrice}>
                      RM{(order.totalPrice || order.price || 0).toFixed(2)}
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color={colors.grayDark} />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: colors.dark, 
    marginBottom: 12 
  },

  // --- Order Stats ---
  orderStatsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    backgroundColor: '#F5F8F5', 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 12 
  },
  orderStat: { alignItems: 'center' },
  orderStatNumber: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: colors.primary 
  },
  orderStatLabel: { 
    fontSize: 11, 
    color: colors.grayDark, 
    marginTop: 2 
  },
  orderStatDivider: { 
    width: 1, 
    backgroundColor: colors.grayLight 
  },

  // --- Completion Message ---
  completionMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    gap: 8,
  },
  completionEmoji: { fontSize: 20 },
  completionText: { 
    flex: 1, 
    fontSize: 13, 
    color: colors.dark, 
    fontWeight: '500' 
  },

  // --- Orders List ---
  orderItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.grayLight 
  },
  orderLeft: { flex: 1 },
  orderHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  orderCustomer: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: colors.dark 
  },
  orderStatus: { 
    paddingHorizontal: 10, 
    paddingVertical: 3, 
    borderRadius: 10 
  },
  orderStatusText: { 
    fontSize: 11, 
    fontWeight: '600' 
  },
  orderItems: { 
    fontSize: 13, 
    color: colors.grayDark, 
    marginTop: 2 
  },
  orderTime: { 
    fontSize: 12, 
    color: '#999', 
    marginTop: 2 
  },
  orderRight: { 
    alignItems: 'flex-end', 
    marginLeft: 8 
  },
  orderPrice: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: colors.primary 
  },
  emptyOrdersText: { 
    fontSize: 14, 
    color: colors.grayDark, 
    textAlign: 'center', 
    paddingVertical: 20 
  },
});

export default VendorOrdersScreen;
