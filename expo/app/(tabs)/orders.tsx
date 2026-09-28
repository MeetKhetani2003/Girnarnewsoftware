import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ShoppingBag, Plus, Tag, CheckCircle2, AlertCircle } from 'lucide-react-native';

const SAMPLE_ORDERS = [
  {
    id: 'ORD-101',
    customer: 'Somnath Trust & Mandir Samiti',
    type: 'takti',
    title: 'Lakha Red Stone Temple Donor Takti (36"x24")',
    sqFt: 6.0,
    supplierPrice: 450,
    cost: 3180,
    selling: 5400,
    profit: 2220,
    margin: 41.1,
    status: 'In Progress',
  },
  {
    id: 'ORD-102',
    customer: 'Shri Swaminarayan Gurukul',
    type: 'mandir',
    title: 'Pure Sevan Wooden Mandir (48"x24"x66")',
    cost: 56000,
    selling: 88000,
    profit: 32000,
    margin: 36.4,
    status: 'Carving Phase',
  },
  {
    id: 'ORD-103',
    customer: 'Rajkot Heritage Derasar',
    type: 'murti',
    title: 'Makrana Marble Radha Krishna Murty (24 Inch)',
    cost: 48000,
    selling: 78000,
    profit: 30000,
    margin: 38.5,
    status: 'Gold Foil Polish',
  },
];

export default function NativeOrdersScreen() {
  const [filter, setFilter] = useState('ALL');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Banner */}
      <View style={styles.banner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>ORDERS & CUSTOM SOURCING PROFIT</Text>
          <Text style={styles.bannerSub}>All bookings track real supplier sourcing cost & net margin.</Text>
        </View>
      </View>

      {/* Orders List */}
      {SAMPLE_ORDERS.map((order) => (
        <View key={order.id} style={styles.orderCard}>
          <View style={styles.orderTop}>
            <View>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={styles.custName}>{order.customer}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>

          <Text style={styles.orderTitle}>{order.title}</Text>

          {order.sqFt && (
            <Text style={styles.sqFtTag}>
              📐 {order.sqFt} Sq.Ft • Supplier Slab Cost: ₹{order.supplierPrice}/sq.ft
            </Text>
          )}

          <View style={styles.calcRow}>
            <View>
              <Text style={styles.metricLabel}>Total Cost</Text>
              <Text style={styles.costVal}>₹ {order.cost.toLocaleString()}</Text>
            </View>
            <View>
              <Text style={styles.metricLabel}>Selling Price</Text>
              <Text style={styles.sellVal}>₹ {order.selling.toLocaleString()}</Text>
            </View>
            <View>
              <Text style={styles.metricLabel}>Est. Profit</Text>
              <Text style={styles.profitVal}>+₹ {order.profit.toLocaleString()} ({order.margin}%)</Text>
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
  banner: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 16,
  },
  bannerTitle: { color: '#fbbf24', fontSize: 12, fontWeight: 'bold' },
  bannerSub: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  orderCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 14,
  },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { color: '#fbbf24', fontSize: 11, fontWeight: 'bold' },
  custName: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  statusBadge: { backgroundColor: '#10b98120', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { color: '#34d399', fontSize: 11, fontWeight: 'bold' },
  orderTitle: { color: '#cbd5e1', fontSize: 13, marginTop: 8 },
  sqFtTag: { color: '#fbbf24', fontSize: 12, marginTop: 4, fontWeight: '600' },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#020617',
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
  },
  metricLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold' },
  costVal: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  sellVal: { color: '#f8fafc', fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  profitVal: { color: '#34d399', fontSize: 12, fontWeight: 'bold', marginTop: 2 },
});
