import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeftRight, CheckCircle2, Clock } from 'lucide-react-native';

const TRANSFERS = [
  {
    id: 'TRF-2026-001',
    item: 'Lakha Red Stone Slabs (Raw)',
    qty: '250 Sq.Ft',
    from: 'Bhagvatikalamandir (Morbi)',
    to: 'Girnarshilp (Rajkot Workshop)',
    date: '28/09/2026',
    status: 'COMPLETED',
    vehicle: 'GJ-03-BW-4451',
  },
  {
    id: 'TRF-2026-002',
    item: 'Pure Sevan Carved Pillars',
    qty: '8 Pieces',
    from: 'ArvindRamjibhai (Rajkot)',
    to: 'Girnarshilp (Rajkot Showroom)',
    date: '27/09/2026',
    status: 'IN_TRANSIT',
    vehicle: 'GJ-03-AX-8890',
  },
  {
    id: 'TRF-2026-003',
    item: 'Makrana Marble Radha Krishna Murty (24")',
    qty: '2 Pieces',
    from: 'Jaipurshilpkala (Jaipur Yard)',
    to: 'Girnarshilp (Rajkot Showroom)',
    date: '25/09/2026',
    status: 'COMPLETED',
    vehicle: 'RJ-14-GA-1122',
  },
];

export default function NativeTransfersScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>INTER-PEDHI STOCK TRANSFERS</Text>
        <Text style={styles.bannerSub}>
          Audit inventory movements across the 4 Pedhis without losing stock count.
        </Text>
      </View>

      {TRANSFERS.map((t) => (
        <View key={t.id} style={styles.card}>
          <View style={styles.topRow}>
            <Text style={styles.trfId}>{t.id}</Text>
            <View style={[styles.statusBadge, t.status === 'COMPLETED' ? styles.statusDone : styles.statusTransit]}>
              <Text style={[styles.statusText, t.status === 'COMPLETED' ? styles.statusDoneText : styles.statusTransitText]}>
                {t.status}
              </Text>
            </View>
          </View>

          <Text style={styles.itemName}>{t.item}</Text>
          <Text style={styles.qtyTag}>Quantity: {t.qty}</Text>

          <View style={styles.routeBox}>
            <View style={styles.routeCol}>
              <Text style={styles.routeLabel}>FROM</Text>
              <Text style={styles.routeText}>{t.from}</Text>
            </View>
            <ArrowLeftRight color="#0ea5e9" size={16} />
            <View style={styles.routeCol}>
              <Text style={styles.routeLabel}>TO</Text>
              <Text style={styles.routeText}>{t.to}</Text>
            </View>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.dateText}>{t.date}</Text>
            <Text style={styles.vehicleText}>Vehicle: {t.vehicle}</Text>
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
  bannerTitle: { color: '#c084fc', fontSize: 11, fontWeight: 'bold' },
  bannerSub: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 12,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trfId: { color: '#c084fc', fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusDone: { backgroundColor: '#10b98120' },
  statusTransit: { backgroundColor: '#0ea5e920' },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  statusDoneText: { color: '#34d399' },
  statusTransitText: { color: '#0ea5e9' },
  itemName: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold', marginTop: 8 },
  qtyTag: { color: '#0ea5e9', fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  routeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#020617',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  routeCol: { flex: 1 },
  routeLabel: { color: '#64748b', fontSize: 9, fontWeight: 'bold' },
  routeText: { color: '#cbd5e1', fontSize: 11, marginTop: 2 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  dateText: { color: '#64748b', fontSize: 11 },
  vehicleText: { color: '#94a3b8', fontSize: 11 },
});
