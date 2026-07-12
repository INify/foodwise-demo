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
import HomeScreen from './screens/HomeScreen';
import BrowseScreen from './screens/BrowseScreen'; // 新增
import ListingDetailScreen from './screens/ListingDetailScreen';
import CartScreen from './screens/CartScreen';
import QRCodeScreen from './screens/QRCodeScreen';
import ImpactScreen from './screens/ImpactScreen';
import VendorDrawerNavigator from './navigation/VendorDrawerNavigator';

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
                    name="Home" 
                    component={HomeScreen} 
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen 
                    name="Browse" 
                    component={BrowseScreen} 
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
                  <Stack.Screen 
                    name="Impact" 
                    component={ImpactScreen} 
                    options={{ title: 'Your Impact' }}
                  />
                  <Stack.Screen 
                    name="VendorDrawer" 
                    component={VendorDrawerNavigator} 
                    options={{ headerShown: false }}
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
