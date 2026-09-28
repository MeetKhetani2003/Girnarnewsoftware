import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#020617" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0f172a',
          },
          headerTintColor: '#f8fafc',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#020617',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="parties" options={{ title: 'Parties & Khata Ledger' }} />
        <Stack.Screen name="inventory" options={{ title: 'Inventory (3 Product Lines)' }} />
        <Stack.Screen name="suppliers" options={{ title: 'Quarries & Stone Suppliers' }} />
        <Stack.Screen name="transfers" options={{ title: 'Inter-Pedhi Stock Transfers' }} />
        <Stack.Screen name="rojmel" options={{ title: 'Rojmel / Daily Cashbook' }} />
        <Stack.Screen name="pedhis" options={{ title: '4 Pedhis Management' }} />
        <Stack.Screen
          name="create-order"
          options={{ presentation: 'modal', title: 'New Order & Costing' }}
        />
        <Stack.Screen
          name="create-invoice"
          options={{ presentation: 'modal', title: 'Create GST Invoice' }}
        />
        <Stack.Screen
          name="payment"
          options={{ presentation: 'modal', title: 'Record Jama / Naame' }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
