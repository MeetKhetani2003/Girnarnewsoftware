import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Package, Layers, Home, Sparkles } from 'lucide-react-native';

const INVENTORY_ITEMS = [
  {
    id: '1',
    name: 'Lakha Red Stone Temple Donor Takti',
    type: 'takti',
    unit: 'SqFt',
    stock: 450,
    rate: 420,
    pedhi: 'Bhagvatikalamandir',
    specs: '24"x18", 25mm thickness, deep V-carve',
  },
  {
    id: '2',
    name: 'Jet Black Granite Dedication Takti',
    type: 'takti',
    unit: 'SqFt',
    stock: 620,
    rate: 460,
    pedhi: 'Bhagvatikalamandir',
    specs: 'Mirror Polish, Gold Leaf Inscription',
  },
  {
    id: '3',
    name: 'Pure Sevan Wooden Mandir (Pooja Ghar)',
    type: 'mandir',
    unit: 'Pcs',
    stock: 8,
    rate: 78000,
    pedhi: 'ArvindRamjibhai',
    specs: '48"W x 24"D x 66"H, 3 Shikhara with Kalash',
  },
  {
    id: '4',
    name: 'Makrana Marble Radha Krishna Murty',
    type: 'murti',
    unit: 'Pcs',
    stock: 4,
    rate: 75000,
    pedhi: 'Jaipurshilpkala',
    specs: '24 Inch, Grade A Makrana, 24K Gold Foil',
  },
];

export default function NativeInventoryScreen() {
  const [selectedType, setSelectedType] = useState('ALL');

  const filtered = selectedType === 'ALL'
    ? INVENTORY_ITEMS
    : INVENTORY_ITEMS.filter((i) => i.type === selectedType);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Category Pills */}
      <View style={styles.pillRow}>
        {['ALL', 'takti', 'mandir', 'murti'].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setSelectedType(t)}
            style={[styles.pill, selectedType === t && styles.pillActive]}
          >
            <Text style={[styles.pillText, selectedType === t && styles.pillTextActive]}>
              {t === 'ALL' ? 'All Items' : t === 'takti' ? 'Taktis (Sq.Ft)' : t === 'mandir' ? 'Mandirs' : 'Murtis'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Items */}
      {filtered.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.itemType}>
              {item.type === 'takti' ? 'TAKTI (SQUARE FEET)' : item.type.toUpperCase()}
            </Text>
            <Text style={styles.pedhiTag}>{item.pedhi}</Text>
          </View>

          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.specs}>{item.specs}</Text>

          <View style={styles.statGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Available Stock</Text>
              <Text style={[styles.statVal, { color: '#34d399' }]}>
                {item.stock} {item.unit}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Selling Rate</Text>
              <Text style={[styles.statVal, { color: '#fbbf24' }]}>
                ₹ {item.rate.toLocaleString()} / {item.unit}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16 },
  pillRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  pill: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  pillActive: { backgroundColor: '#fbbf24', borderColor: '#fbbf24' },
  pillText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  pillTextActive: { color: '#0f172a' },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 14,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  itemType: { color: '#fbbf24', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  pedhiTag: { color: '#64748b', fontSize: 10, fontWeight: 'bold' },
  itemName: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  specs: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  statGrid: { flexDirection: 'row', gap: 12, marginTop: 12 },
  statBox: { flex: 1, backgroundColor: '#020617', padding: 10, borderRadius: 10 },
  statLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold' },
  statVal: { fontSize: 13, fontWeight: 'bold', marginTop: 2 },
});
