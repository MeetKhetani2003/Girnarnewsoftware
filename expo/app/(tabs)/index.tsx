import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Building2,
  TrendingUp,
  AlertCircle,
  ShoppingBag,
  FileText,
  PlusCircle,
  Menu,
  Calculator,
  Layers,
  ArrowRight,
} from 'lucide-react-native';

const PEDHIS = [
  { id: '1', name: 'Girnarshilp', city: 'Rajkot', type: 'Mandirs & Stone Mega Projects' },
  { id: '2', name: 'ArvindRamjibhai', city: 'Rajkot', type: 'Pure Sevan Wooden Mandirs' },
  { id: '3', name: 'Jaipurshilpkala', city: 'Jaipur', type: 'Makrana Marble Bhagwan Murtis' },
  { id: '4', name: 'Bhagvatikalamandir', city: 'Morbi', type: 'Granite & Lakha Red Taktis (Sq.Ft)' },
];

export default function NativeDashboardScreen() {
  const router = useRouter();
  const [activePedhi, setActivePedhi] = useState(PEDHIS[0]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0ea5e9" />}
    >
      {/* Pedhi Switcher Banner */}
      <View style={styles.pedhiCard}>
        <View style={styles.pedhiHeader}>
          <View style={styles.pedhiIcon}>
            <Building2 color="#0f172a" size={20} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.pedhiName}>{activePedhi.name}</Text>
            <Text style={styles.pedhiSub}>
              {activePedhi.city} • {activePedhi.type}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/pedhis')} style={styles.pedhiSettingsBtn}>
            <Text style={{ color: '#0ea5e9', fontSize: 11, fontWeight: 'bold' }}>Manage</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Pedhi Switcher */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pedhiScroll}>
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
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Quick Action Strip (New Order, New Bill, Payment, Drawer Menu) */}
      <View style={styles.actionStrip}>
        <TouchableOpacity
          onPress={() => router.push('/create-order')}
          style={[styles.actionBtn, { borderColor: '#0ea5e950', backgroundColor: '#0ea5e915' }]}
        >
          <ShoppingBag color="#0ea5e9" size={16} />
          <Text style={[styles.actionText, { color: '#0ea5e9' }]}>+ Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/create-invoice')}
          style={[styles.actionBtn, { borderColor: '#60a5fa50', backgroundColor: '#60a5fa15' }]}
        >
          <FileText color="#60a5fa" size={16} />
          <Text style={[styles.actionText, { color: '#60a5fa' }]}>+ Bill</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/payment')}
          style={[styles.actionBtn, { borderColor: '#34d39950', backgroundColor: '#34d39915' }]}
        >
          <PlusCircle color="#34d399" size={16} />
          <Text style={[styles.actionText, { color: '#34d399' }]}>+ Jama</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/menu')}
          style={[styles.actionBtn, { borderColor: '#c084fc50', backgroundColor: '#c084fc15' }]}
        >
          <Menu color="#c084fc" size={16} />
          <Text style={[styles.actionText, { color: '#c084fc' }]}>Drawer</Text>
        </TouchableOpacity>
      </View>

      {/* KPI Cards */}
      <View style={styles.grid}>
        <View style={[styles.card, { borderColor: '#10b98133' }]}>
          <Text style={styles.cardLabel}>TODAY'S ORDERS</Text>
          <Text style={[styles.cardValue, { color: '#34d399' }]}>₹ 1,84,000</Text>
          <Text style={styles.cardSub}>4 Custom Bookings</Text>
        </View>

        <View style={[styles.card, { borderColor: '#0ea5e933' }]}>
          <Text style={styles.cardLabel}>NET EST. PROFIT</Text>
          <Text style={[styles.cardValue, { color: '#0ea5e9' }]}>₹ 62,400</Text>
          <Text style={styles.cardSub}>33.9% Margin</Text>
        </View>
      </View>

      {/* 3 Core Product Lines Indicator & Direct Navigation */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>3 SPECIALIZED PRODUCT CATEGORIES</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/takti-calc')}>
            <Text style={{ color: '#0ea5e9', fontSize: 11, fontWeight: 'bold' }}>Open Calc →</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/takti-calc')}
          style={styles.categoryItem}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.catTitle}>1. Taktis (Sq. Ft Metric)</Text>
            <Text style={styles.catDesc}>Lakha Red Stone, Jet Black Granite, Makrana Marble</Text>
            <Text style={styles.catMeta}>Custom Quarry Sourcing Rate • Length × Width ÷ 144</Text>
          </View>
          <ArrowRight color="#0ea5e9" size={16} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/create-order')}
          style={styles.categoryItem}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.catTitle}>2. Mandirs (Wood & Marble)</Text>
            <Text style={styles.catDesc}>Pure Sevan Wood & Carved Marble with Shikharas</Text>
            <Text style={styles.catMeta}>Karigar Allocation • Dimensions (W × D × H)</Text>
          </View>
          <ArrowRight color="#64748b" size={16} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/create-order')}
          style={[styles.categoryItem, { borderBottomWidth: 0 }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.catTitle}>3. Bhagwan Murtis (Makrana)</Text>
            <Text style={styles.catDesc}>Radhakrishna, Ganeshji, Shiv Parivar, Jain Tirthankars</Text>
            <Text style={styles.catMeta}>Pure Makrana Marble • 24K Real Gold Foil Polish</Text>
          </View>
          <ArrowRight color="#64748b" size={16} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16, paddingBottom: 32 },
  pedhiCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 14,
  },
  pedhiHeader: { flexDirection: 'row', alignItems: 'center' },
  pedhiIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pedhiName: { color: '#f8fafc', fontSize: 16, fontWeight: 'bold' },
  pedhiSub: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  pedhiSettingsBtn: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  pedhiScroll: { marginTop: 14 },
  pedhiChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    marginRight: 8,
  },
  pedhiChipActive: { backgroundColor: '#0ea5e9' },
  pedhiChipText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  pedhiChipTextActive: { color: '#0f172a', fontWeight: 'bold' },
  actionStrip: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionText: { fontSize: 11, fontWeight: 'bold' },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  card: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  cardLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  cardValue: { fontSize: 18, fontWeight: 'bold', marginVertical: 4 },
  cardSub: { color: '#94a3b8', fontSize: 11 },
  section: { backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: '#0ea5e9', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  catTitle: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold' },
  catDesc: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  catMeta: { color: '#0ea5e9', fontSize: 11, marginTop: 4, fontWeight: '500' },
});
