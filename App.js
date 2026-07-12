import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { ListingProvider } from './context/ListingContext';
import { ImpactProvider } from './context/ImpactContext';
import { OrdersProvider } from './context/OrdersContext';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ListingDetailScreen from './screens/ListingDetailScreen';
import CartScreen from './screens/CartScreen';
import QRCodeScreen from './screens/QRCodeScreen';

// Import Navigators
import AppNavigator from './navigation/AppNavigator';
import VendorTabNavigator from './navigation/VendorTabNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ListingProvider>
          <ImpactProvider>
            <OrdersProvider>
              <StatusBar style="auto" />
              <NavigationContainer>
                <Stack.Navigator 
                  initialRouteName="Login"
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: '#2E7D32',
                    },
                    headerTintColor: '#FFFFFF',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                  }}
                >
                  <Stack.Screen 
                    name="Login" 
                    component={LoginScreen} 
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen 
                    name="Register" 
                    component={RegisterScreen} 
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen 
                    name="MainApp" 
                    component={AppNavigator} 
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen 
                    name="VendorApp" 
                    component={VendorTabNavigator} 
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen 
                    name="Detail" 
                    component={ListingDetailScreen} 
                    options={{ title: 'Food Details' }}
                  />
                  <Stack.Screen 
                    name="Cart" 
                    component={CartScreen} 
                    options={{ title: 'Your Order' }}
                  />
                  <Stack.Screen 
                    name="QRCode" 
                    component={QRCodeScreen} 
                    options={{ title: 'Pickup QR Code' }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </OrdersProvider>
          </ImpactProvider>
        </ListingProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
