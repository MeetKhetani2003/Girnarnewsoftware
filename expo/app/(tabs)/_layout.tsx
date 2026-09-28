import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LayoutDashboard, ShoppingBag, Calculator, Package, Users } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fbbf24',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#1e293b',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#0f172a',
          borderBottomColor: '#1e293b',
        },
        headerTintColor: '#f8fafc',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerTitle: 'Girnar Shilp Vyapar',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          headerTitle: 'Orders & Costing',
          tabBarIcon: ({ color, size }) => <ShoppingBag color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="takti-calc"
        options={{
          title: 'Takti Calc',
          headerTitle: 'Takti Sq.Ft Profit Engine',
          tabBarIcon: ({ color, size }) => <Calculator color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Stock',
          headerTitle: 'Inventory (3 Product Lines)',
          tabBarIcon: ({ color, size }) => <Package color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
