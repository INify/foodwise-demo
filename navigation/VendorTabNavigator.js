import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

import VendorDashboardScreen from '../screens/vendor/VendorDashboardScreen';
import VendorListingsScreen from '../screens/vendor/VendorListingsScreen';
import VendorOrdersScreen from '../screens/vendor/VendorOrdersScreen';
import VendorScannerScreen from '../screens/vendor/VendorScannerScreen';
import VendorAnalyticsScreen from '../screens/vendor/VendorAnalyticsScreen';

const Tab = createBottomTabNavigator();

const VendorTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Listings') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Scanner') {
            iconName = focused ? 'scan' : 'scan-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.grayDark,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.grayLight,
          paddingBottom: 8,
          paddingTop: 4,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={VendorDashboardScreen} />
      <Tab.Screen name="Listings" component={VendorListingsScreen} />
      <Tab.Screen name="Orders" component={VendorOrdersScreen} />
      <Tab.Screen name="Scanner" component={VendorScannerScreen} />
      <Tab.Screen name="Analytics" component={VendorAnalyticsScreen} />
    </Tab.Navigator>
  );
};

export default VendorTabNavigator;
