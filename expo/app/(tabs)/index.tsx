import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Building2, TrendingUp, AlertCircle, ShoppingBag, ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';

const PEDHIS = [
  { id: '1', name: 'Girnarshilp', city: 'Rajkot', type: 'Mandirs & Stone Mega Projects' },
  { id: '2', name: 'ArvindRamjibhai', city: 'Rajkot', type: 'Pure Sevan Wooden Mandirs' },
  { id: '3', name: 'Jaipurshilpkala', city: 'Jaipur', type: 'Makrana Marble Bhagwan Murtis' },
  { id: '4', name: 'Bhagvatikalamandir', city: 'Morbi', type: 'Granite & Lakha Red Taktis (Sq.Ft)' },
];

export default function NativeDashboardScreen() {
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fbbf24" />}
    >
      {/* Pedhi Switcher Banner */}
      <View style={styles.pedhiCard}>
        <View style={styles.pedhiHeader}>
          <View style={styles.pedhiIcon}>
            <Building2 color="#fbbf24" size={20} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.pedhiName}>{activePedhi.name}</Text>
            <Text style={styles.pedhiSub}>{activePedhi.city} • {activePedhi.type}</Text>
          </View>
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

      {/* KPI Cards */}
      <View style={styles.grid}>
        <View style={[styles.card, { borderColor: '#10b98133' }]}>
          <Text style={styles.cardLabel}>TODAY'S ORDERS</Text>
          <Text style={[styles.cardValue, { color: '#34d399' }]}>₹ 1,84,000</Text>
          <Text style={styles.cardSub}>4 Custom Bookings</Text>
        </View>

        <View style={[styles.card, { borderColor: '#fbbf2433' }]}>
          <Text style={styles.cardLabel}>NET EST. PROFIT</Text>
          <Text style={[styles.cardValue, { color: '#fbbf24' }]}>₹ 62,400</Text>
          <Text style={styles.cardSub}>33.9% Margin</Text>
        </View>
      </View>

      {/* 3 Core Product Lines Indicator */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3 SPECIALIZED PRODUCT CATEGORIES</Text>

        <View style={styles.categoryItem}>
          <Text style={styles.catTitle}>1. Taktis (Sq. Ft Metric)</Text>
          <Text style={styles.catDesc}>Lakha Red Stone, Jet Black Granite, Makrana Marble</Text>
          <Text style={styles.catMeta}>Custom Supplier Price • Length x Width / 144</Text>
        </View>

        <View style={styles.categoryItem}>
          <Text style={styles.catTitle}>2. Mandirs (Wood & Marble)</Text>
          <Text style={styles.catDesc}>Pure Sevan Wood & Carved Marble with Shikharas</Text>
          <Text style={styles.catMeta}>Karigar Allocation • Dimensions (W x D x H)</Text>
        </View>

        <View style={styles.categoryItem}>
          <Text style={styles.catTitle}>3. Bhagwan Murtis (Makrana)</Text>
          <Text style={styles.catDesc}>Radhakrishna, Ganeshji, Shiv Parivar, Jain Tirthankars</Text>
          <Text style={styles.catMeta}>Pure Makrana Marble • 24K Gold Foil Polish</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16 },
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
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fbbf2415',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pedhiName: { color: '#f8fafc', fontSize: 16, fontWeight: 'bold' },
  pedhiSub: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  pedhiScroll: { marginTop: 14 },
  pedhiChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    marginRight: 8,
  },
  pedhiChipActive: { backgroundColor: '#fbbf24' },
  pedhiChipText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  pedhiChipTextActive: { color: '#0f172a', fontWeight: 'bold' },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
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
  sectionTitle: { color: '#fbbf24', fontSize: 11, fontWeight: 'bold', marginBottom: 12, letterSpacing: 0.5 },
  categoryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  catTitle: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold' },
  catDesc: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  catMeta: { color: '#fbbf24', fontSize: 11, marginTop: 4, fontWeight: '500' },
});
