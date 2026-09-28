import { Tabs } from 'expo-router';
import React from 'react';
import { LayoutDashboard, ShoppingBag, FileText, Menu, Users } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#1e293b',
          height: 62,
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
          title: 'Home',
          headerTitle: 'Girnar Shilp Vyapar',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <LayoutDashboard color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          headerTitle: 'Orders & Costing',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <ShoppingBag color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="invoices"
        options={{
          title: 'Bills',
          headerTitle: 'GST Invoices & Billing',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <FileText color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="parties"
        options={{
          title: 'Khata',
          headerTitle: 'Parties & Khata Book',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Users color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          headerTitle: 'All Features & Drawer',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Menu color={color} size={size} />
          ),
        }}
      />
      {/* Hide subsidiary tabs from bottom bar so only 3 quick actions + menu exist */}
      <Tabs.Screen
        name="takti-calc"
        options={{
          href: null,
          title: 'Takti Calculator',
          headerTitle: 'Takti Sq.Ft Profit Engine',
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          href: null,
          title: 'Inventory',
          headerTitle: 'Inventory (3 Product Lines)',
        }}
      />
    </Tabs>
  );
}
