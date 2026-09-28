import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Building2,
  ShoppingBag,
  Calculator,
  FileText,
  Package,
  Users,
  Truck,
  ArrowLeftRight,
  BookOpen,
  Settings,
  PlusCircle,
  TrendingUp,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react-native';

const PEDHIS = [
  { id: '1', name: 'Girnarshilp', city: 'Rajkot', type: 'Mandirs & Mega Carvings' },
  { id: '2', name: 'ArvindRamjibhai', city: 'Rajkot', type: 'Pure Sevan Wooden Mandirs' },
  { id: '3', name: 'Jaipurshilpkala', city: 'Jaipur', type: 'Makrana Marble Bhagwan Murtis' },
  { id: '4', name: 'Bhagvatikalamandir', city: 'Morbi', type: 'Granite & Lakha Red Taktis (Sq.Ft)' },
];

export default function NativeDrawerMenuScreen() {
  const router = useRouter();
  const [activePedhi, setActivePedhi] = useState(PEDHIS[0]);

  const menuSections = [
    {
      title: 'CORE SALES & ORDERS',
      items: [
        {
          label: 'Orders & Custom Costing',
          desc: 'Sq.Ft tracking & custom quarry profit calculation',
          icon: ShoppingBag,
          color: '#34d399',
          route: '/(tabs)/orders',
          badge: 'Sq.Ft & Profit',
        },
        {
          label: 'GST Invoices & Billing',
          desc: 'Tax invoices, PDF preview, WhatsApp share',
          icon: FileText,
          color: '#60a5fa',
          route: '/(tabs)/invoices',
        },
      ],
    },
    {
      title: '3 PRODUCT LINES & SOURCING',
      items: [
        {
          label: 'Takti Sq.Ft Profit Engine',
          desc: 'L" × W" ÷ 144 • Custom quarry rate (e.g. ₹450 vs ₹500)',
          icon: Calculator,
          color: '#fbbf24',
          route: '/(tabs)/takti-calc',
          badge: 'Factory Costing',
        },
        {
          label: 'Inventory & Stock Management',
          desc: 'Taktis (Sq.Ft), Sevan Mandirs, Makrana Murtis',
          icon: Package,
          color: '#22d3ee',
          route: '/inventory',
        },
        {
          label: 'Quarries & Stone Suppliers',
          desc: 'Rajasthan quarries, stone lots & supplier rates',
          icon: Truck,
          color: '#fb923c',
          route: '/suppliers',
        },
        {
          label: 'Inter-Pedhi Stock Transfers',
          desc: 'Move items between Girnar, Arvind, Jaipur & Bhagvati',
          icon: ArrowLeftRight,
          color: '#c084fc',
          route: '/transfers',
        },
      ],
    },
    {
      title: 'KHATA & CASHBOOK (ROJMEL)',
      items: [
        {
          label: 'Parties & Khata Ledger',
          desc: 'Customers, Trust, Derasar, Lena & Dena balances',
          icon: Users,
          color: '#f87171',
          route: '/parties',
        },
        {
          label: 'Rojmel / Daily Daybook',
          desc: 'Jama (Cash In) & Naame (Cash Out) register',
          icon: BookOpen,
          color: '#34d399',
          route: '/rojmel',
        },
      ],
    },
    {
      title: 'ORGANIZATION & SETTINGS',
      items: [
        {
          label: '4 Pedhis Management',
          desc: 'GST details, bank accounts, print settings',
          icon: Settings,
          color: '#fbbf24',
          route: '/pedhis',
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Active Pedhi Banner */}
      <View style={styles.pedhiCard}>
        <View style={styles.pedhiHeader}>
          <View style={styles.pedhiIcon}>
            <Building2 color="#0f172a" size={20} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.pedhiName}>{activePedhi.name}</Text>
            <Text style={styles.pedhiSub}>
              {activePedhi.city} • {activePedhi.type}
            </Text>
          </View>
        </View>

        {/* 4 Pedhi Switcher Chips */}
        <Text style={styles.switchLabel}>SWITCH ACTIVE PEDHI (4 UNITS):</Text>
        <View style={styles.pedhiGrid}>
          {PEDHIS.map((p) => {
            const isSelected = p.id === activePedhi.id;
            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => setActivePedhi(p)}
                style={[styles.pedhiChip, isSelected && styles.pedhiChipActive]}
              >
                <Text style={[styles.pedhiChipText, isSelected && styles.pedhiChipTextActive]}>
                  {p.name}
                </Text>
                <Text style={[styles.pedhiChipCity, isSelected && styles.pedhiChipCityActive]}>
                  {p.city}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.quickGrid}>
        <TouchableOpacity
          onPress={() => router.push('/create-order')}
          style={[styles.quickBtn, { borderColor: '#fbbf2450', backgroundColor: '#fbbf2415' }]}
        >
          <ShoppingBag color="#fbbf24" size={18} />
          <Text style={[styles.quickBtnText, { color: '#fbbf24' }]}>+ New Order</Text>
          <Text style={styles.quickBtnSub}>Takti / Mandir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/create-invoice')}
          style={[styles.quickBtn, { borderColor: '#60a5fa50', backgroundColor: '#60a5fa15' }]}
        >
          <FileText color="#60a5fa" size={18} />
          <Text style={[styles.quickBtnText, { color: '#60a5fa' }]}>+ New Bill</Text>
          <Text style={styles.quickBtnSub}>GST Tax Invoice</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/payment')}
          style={[styles.quickBtn, { borderColor: '#34d39950', backgroundColor: '#34d39915' }]}
        >
          <PlusCircle color="#34d399" size={18} />
          <Text style={[styles.quickBtnText, { color: '#34d399' }]}>+ Jama / Naame</Text>
          <Text style={styles.quickBtnSub}>Cash / Bank</Text>
        </TouchableOpacity>
      </View>

      {/* Categorized Menu Modules */}
      {menuSections.map((sec) => (
        <View key={sec.title} style={styles.section}>
          <Text style={styles.sectionHeader}>{sec.title}</Text>
          {sec.items.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.label}
                onPress={() => router.push(item.route as any)}
                style={styles.menuItem}
              >
                <View style={[styles.itemIconBox, { backgroundColor: `${item.color}20` }]}>
                  <Icon color={item.color} size={18} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.itemTitle}>{item.label}</Text>
                    {item.badge && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.itemDesc}>{item.desc}</Text>
                </View>
                <ChevronRight color="#64748b" size={18} />
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Girnar Shilp Vyapar • Multi-Pedhi Architecture</Text>
        <Text style={styles.footerSub}>MongoDB Atlas Serverless Active</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16, paddingBottom: 40 },
  pedhiCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 16,
  },
  pedhiHeader: { flexDirection: 'row', alignItems: 'center' },
  pedhiIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#fbbf24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pedhiName: { color: '#f8fafc', fontSize: 16, fontWeight: 'bold' },
  pedhiSub: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  switchLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  pedhiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pedhiChip: {
    width: '48%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  pedhiChipActive: { backgroundColor: '#fbbf2420', borderColor: '#fbbf24' },
  pedhiChipText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  pedhiChipTextActive: { color: '#fbbf24' },
  pedhiChipCity: { color: '#64748b', fontSize: 10, marginTop: 2 },
  pedhiChipCityActive: { color: '#f8fafc' },
  quickGrid: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  quickBtn: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  quickBtnText: { fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  quickBtnSub: { color: '#94a3b8', fontSize: 9, marginTop: 1 },
  section: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 14,
  },
  sectionHeader: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  itemIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold' },
  itemDesc: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  badge: {
    backgroundColor: '#fbbf2420',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  badgeText: { color: '#fbbf24', fontSize: 9, fontWeight: 'bold' },
  footer: { alignItems: 'center', marginTop: 12, marginBottom: 20 },
  footerText: { color: '#64748b', fontSize: 11, fontWeight: '500' },
  footerSub: { color: '#34d399', fontSize: 10, marginTop: 2, fontWeight: '600' },
});
