import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';

const VendorOrdersScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const vendorName = user?.name || 'Your Store';

  const recentOrders = [
    { id: 'ORD-001', customer: 'Alice', items: 'Nasi Lemak × 2', status: 'Pending', time: '10 min ago' },
    { id: 'ORD-002', customer: 'Bob', items: 'Chicken Rice × 1', status: 'Ready', time: '25 min ago' },
    { id: 'ORD-003', customer: 'Carol', items: 'Roti Canai × 3', status: 'Picked Up', time: '1 hour ago' },
  ];

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
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {recentOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderItem}
              onPress={() => navigation.navigate('VendorOrderDetail', { order })}
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
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.dark, marginBottom: 12 },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.gray },
  orderLeft: { flex: 1 },
  orderCustomer: { fontSize: 15, fontWeight: '600', color: colors.dark },
  orderItems: { fontSize: 13, color: colors.grayDark, marginTop: 2 },
  orderTime: { fontSize: 12, color: '#999', marginTop: 2 },
  orderStatus: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  orderStatusText: { fontSize: 12, fontWeight: '600' },
});

export default VendorOrdersScreen;