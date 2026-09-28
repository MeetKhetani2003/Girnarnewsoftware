import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Building2, MapPin, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react-native';

const PEDHIS_DATA = [
  {
    id: '1',
    name: 'Girnarshilp',
    businessType: 'Temple Architecture & Mega Stone Projects',
    city: 'Rajkot, Gujarat',
    address: 'Near Aji Dam Industrial Area, Rajkot 360003',
    mobile: '9825011111',
    email: 'info@girnarshilp.com',
    gst: '24AAACG1111A1Z5',
    activeOrders: 14,
    focus: 'Temple Carvings, Mandirs & Large Sculptures',
  },
  {
    id: '2',
    name: 'ArvindRamjibhai',
    businessType: 'Pure Sevan Wooden Mandirs & Handicrafts',
    city: 'Rajkot, Gujarat',
    address: 'Gondal Road Workshop Yard, Rajkot 360004',
    mobile: '9825022222',
    email: 'arvindramjibhai@girnar.com',
    gst: '24AAACA2222B1Z6',
    activeOrders: 9,
    focus: 'Sevan Wood Pooja Mandirs with 3 Shikharas & Kalash',
  },
  {
    id: '3',
    name: 'Jaipurshilpkala',
    businessType: 'Makrana Marble Bhagwan Murtis & Divine Statues',
    city: 'Jaipur, Rajasthan',
    address: 'Moorti Mohalla, Khazane Walon Ka Rasta, Jaipur 302001',
    mobile: '9829033333',
    email: 'jaipur@girnarshilp.com',
    gst: '08AAACJ3333C1Z7',
    activeOrders: 11,
    focus: 'Pure White Makrana Radha Krishna, Ganeshji, Jain Tirthankars',
  },
  {
    id: '4',
    name: 'Bhagvatikalamandir',
    businessType: 'Granite & Lakha Red Stone Taktis (Sq.Ft)',
    city: 'Morbi, Gujarat',
    address: 'Morbi-Navlakhi Highway, Stone Cluster, Morbi 363641',
    mobile: '9825044444',
    email: 'bhagvati@girnarshilp.com',
    gst: '24AAACB4444D1Z8',
    activeOrders: 18,
    focus: 'Lakha Red & Granite Taktis calculated in Square Feet with 24K Gold Inscription',
  },
];

export default function NativePedhisScreen() {
  const [selectedPedhi, setSelectedPedhi] = useState(PEDHIS_DATA[0].id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>ENTERPRISE MULTI-PEDHI ARCHITECTURE</Text>
        <Text style={styles.bannerSub}>
          Each Pedhi operates independently with isolated ledgers, GST invoices, and stock tracking.
        </Text>
      </View>

      {PEDHIS_DATA.map((p) => {
        const isSelected = p.id === selectedPedhi;
        return (
          <View key={p.id} style={[styles.card, isSelected && styles.activeCard]}>
            <View style={styles.cardTop}>
              <View style={styles.iconBox}>
                <Building2 color="#fbbf24" size={20} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.pedhiName}>{p.name}</Text>
                <Text style={styles.pedhiType}>{p.businessType}</Text>
              </View>
              {isSelected && (
                <View style={styles.activeBadge}>
                  <CheckCircle2 color="#0f172a" size={14} />
                  <Text style={styles.activeText}>Active</Text>
                </View>
              )}
            </View>

            <View style={styles.focusBox}>
              <Text style={styles.focusLabel}>SPECIALIZATION:</Text>
              <Text style={styles.focusText}>{p.focus}</Text>
            </View>

            <View style={styles.infoRow}>
              <MapPin color="#64748b" size={13} />
              <Text style={styles.infoText}>{p.city} • {p.address}</Text>
            </View>

            <View style={styles.infoRow}>
              <FileText color="#64748b" size={13} />
              <Text style={[styles.infoText, { fontFamily: 'monospace', color: '#fbbf24' }]}>
                GSTIN: {p.gst}
              </Text>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.ordersText}>Active Bookings: {p.activeOrders}</Text>
              <TouchableOpacity
                onPress={() => setSelectedPedhi(p.id)}
                style={[styles.switchBtn, isSelected && styles.switchBtnActive]}
              >
                <Text style={[styles.switchText, isSelected && styles.switchTextActive]}>
                  {isSelected ? 'Current Business' : 'Switch to this Pedhi'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
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
  bannerTitle: { color: '#fbbf24', fontSize: 11, fontWeight: 'bold' },
  bannerSub: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 14,
  },
  activeCard: { borderColor: '#fbbf24' },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#fbbf2415',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pedhiName: { color: '#f8fafc', fontSize: 16, fontWeight: 'bold' },
  pedhiType: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fbbf24',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeText: { color: '#0f172a', fontSize: 10, fontWeight: 'bold' },
  focusBox: {
    backgroundColor: '#020617',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  focusLabel: { color: '#64748b', fontSize: 9, fontWeight: 'bold' },
  focusText: { color: '#cbd5e1', fontSize: 11, marginTop: 2, lineHeight: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 3 },
  infoText: { color: '#94a3b8', fontSize: 11, flex: 1 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  ordersText: { color: '#34d399', fontSize: 11, fontWeight: 'bold' },
  switchBtn: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  switchBtnActive: { backgroundColor: '#fbbf2420', borderWidth: 1, borderColor: '#fbbf24' },
  switchText: { color: '#cbd5e1', fontSize: 11, fontWeight: '600' },
  switchTextActive: { color: '#fbbf24', fontWeight: 'bold' },
});
