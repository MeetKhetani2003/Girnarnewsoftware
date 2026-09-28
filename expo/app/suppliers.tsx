import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Truck, Phone, MapPin, Tag } from 'lucide-react-native';

const SUPPLIERS = [
  {
    id: '1',
    name: 'Shree Lakha Red Stone Quarry',
    contactPerson: 'Bherusingh Rathore',
    mobile: '9414123456',
    location: 'Lakha, Jaisalmer / Jodhpur, Rajasthan',
    materials: ['Lakha Red Granite Blocks', 'Sawn Slabs 20-30mm'],
    priceRange: '₹380 - ₹450 / sq.ft',
    pedhi: 'Bhagvatikalamandir',
    balance: 42000,
  },
  {
    id: '2',
    name: 'Makrana Pure White Marble Works',
    contactPerson: 'Hazi Noor Mohammed',
    mobile: '9829055443',
    location: 'Makrana, Nagaur, Rajasthan',
    materials: ['Makrana Albeta Block', 'Chak Dungri Grade A'],
    priceRange: '₹450 - ₹600 / sq.ft',
    pedhi: 'Jaipurshilpkala',
    balance: 65000,
  },
  {
    id: '3',
    name: 'Gujarat Sevan Wood Depot & Timbers',
    contactPerson: 'Kanjibhai Patel',
    mobile: '9825599881',
    location: 'Valsad & Ahwa Dang Forest Depot',
    materials: ['Seasoned Pure Sevan Wood Planks', 'Round Timber Logs'],
    priceRange: '₹2,800 - ₹3,500 / cu.ft',
    pedhi: 'ArvindRamjibhai',
    balance: 18000,
  },
];

export default function NativeSuppliersScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>QUARRIES & RAW MATERIAL SUPPLIERS</Text>
        <Text style={styles.bannerSub}>
          Tracks quarry sourcing prices to accurately compute custom Takti and Mandir profit.
        </Text>
      </View>

      {SUPPLIERS.map((sup) => (
        <View key={sup.id} style={styles.card}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.supName}>{sup.name}</Text>
              <Text style={styles.supPerson}>{sup.contactPerson}</Text>
            </View>
            <View style={styles.balBox}>
              <Text style={styles.balLabel}>Payable (Dena)</Text>
              <Text style={styles.balVal}>₹ {sup.balance.toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <MapPin color="#64748b" size={13} />
            <Text style={styles.metaText}>{sup.location}</Text>
          </View>

          <View style={styles.metaRow}>
            <Tag color="#fbbf24" size={13} />
            <Text style={[styles.metaText, { color: '#fbbf24', fontWeight: 'bold' }]}>
              {sup.priceRange}
            </Text>
          </View>

          <View style={styles.materialsBox}>
            <Text style={styles.matLabel}>Supplied Stone & Wood:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {sup.materials.map((m) => (
                <View key={m} style={styles.matBadge}>
                  <Text style={styles.matText}>{m}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.phoneBtn}>
              <Phone color="#94a3b8" size={13} />
              <Text style={styles.phoneText}>{sup.mobile}</Text>
            </TouchableOpacity>

            <Text style={styles.pedhiTag}>Pedhi: {sup.pedhi}</Text>
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
    marginBottom: 14,
  },
  bannerTitle: { color: '#fb923c', fontSize: 11, fontWeight: 'bold' },
  bannerSub: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 12,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  supName: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold', maxWidth: 200 },
  supPerson: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  balBox: { alignItems: 'flex-end' },
  balLabel: { color: '#64748b', fontSize: 9, fontWeight: 'bold' },
  balVal: { color: '#f87171', fontSize: 13, fontWeight: 'bold', marginTop: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  metaText: { color: '#94a3b8', fontSize: 11 },
  materialsBox: { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#1e293b' },
  matLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold' },
  matBadge: { backgroundColor: '#020617', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: '#1e293b' },
  matText: { color: '#e2e8f0', fontSize: 10 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  phoneBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  phoneText: { color: '#94a3b8', fontSize: 11 },
  pedhiTag: { color: '#64748b', fontSize: 10, fontWeight: 'bold' },
});
