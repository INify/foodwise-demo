import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

// Import the Tab Navigator instead of individual screens
import VendorTabNavigator from './VendorTabNavigator';

// Keep individual screens for drawer items if needed
import VendorListingsScreen from '../screens/vendor/VendorListingsScreen';
import VendorOrdersScreen from '../screens/vendor/VendorOrdersScreen';
import VendorScannerScreen from '../screens/vendor/VendorScannerScreen';
import VendorAnalyticsScreen from '../screens/vendor/VendorAnalyticsScreen';

const Drawer = createDrawerNavigator();

const VendorDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveBackgroundColor: colors.primary,
        drawerActiveTintColor: colors.white,
        drawerInactiveTintColor: colors.dark,
        drawerLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
      }}
    >
      {/* Main Dashboard uses the Tab Navigator */}
      <Drawer.Screen 
        name="Dashboard" 
        component={VendorTabNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          title: 'Dashboard',
        }}
      />
      <Drawer.Screen 
        name="Listings" 
        component={VendorListingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="restaurant" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Orders" 
        component={VendorOrdersScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Scanner" 
        component={VendorScannerScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="scan" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Analytics" 
        component={VendorAnalyticsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default VendorDrawerNavigator;
