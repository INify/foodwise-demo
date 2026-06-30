import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './context/AuthContext';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ListingDetailScreen from './screens/ListingDetailScreen';
import CartScreen from './screens/CartScreen';
import QRCodeScreen from './screens/QRCodeScreen';
import ImpactScreen from './screens/ImpactScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
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
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
