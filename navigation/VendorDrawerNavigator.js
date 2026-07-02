import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';
import { useAuth } from '../context/AuthContext';
import VendorDashboardScreen from '../screens/vendor/VendorDashboardScreen';
import VendorOrdersScreen from '../screens/vendor/VendorOrdersScreen';
import VendorListingsScreen from '../screens/vendor/VendorListingsScreen';
import VendorOrderDetailScreen from '../screens/vendor/VendorOrderDetailScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation, state, onLogout }) => {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', screen: 'VendorDashboard', icon: 'grid-outline' },
    { name: 'Orders', screen: 'VendorOrders', icon: 'receipt-outline' },
    { name: 'Listings', screen: 'VendorListings', icon: 'list-outline' },
  ];

  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={[styles.drawerContainer, { paddingTop: insets.top }]}>
      <View style={styles.drawerHeader}>
        <Ionicons name="storefront" size={40} color={colors.white} />
        <Text style={styles.drawerTitle}>FoodWise</Text>
        <Text style={styles.drawerSubtitle}>Vendor Panel</Text>
      </View>
      <View style={styles.menuContainer}>
        {menuItems.map((item) => {
          const isActive = state.index === menuItems.findIndex(m => m.screen === item.screen);
          return (
            <TouchableOpacity
              key={item.screen}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={isActive ? colors.primary : colors.grayDark}
              />
              <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const VendorDrawerNavigator = ({ onLogout }) => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} onLogout={onLogout} />
      )}
      screenOptions={{
        drawerType: 'front',
        drawerStyle: {
          width: 280,
        },
        headerShown: false,
      }}
    >
      <Drawer.Screen name="VendorDashboard" component={VendorDashboardScreen} />
      <Drawer.Screen name="VendorOrders" component={VendorOrdersScreen} />
      <Drawer.Screen name="VendorListings" component={VendorListingsScreen} />
      <Drawer.Screen
        name="VendorOrderDetail"
        component={VendorOrderDetailScreen}
        options={{ drawerLabel: () => null, drawerItemStyle: { display: 'none' } }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  drawerHeader: {
    backgroundColor: colors.primary,
    padding: 24,
    alignItems: 'center',
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 8,
  },
  drawerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  menuContainer: {
    paddingTop: 16,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    borderRadius: 12,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: '#E8F5E9',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
    marginLeft: 16,
  },
  menuItemTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    padding: 16,
    paddingBottom: 32,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.danger,
    marginLeft: 16,
  },
});

export default VendorDrawerNavigator;