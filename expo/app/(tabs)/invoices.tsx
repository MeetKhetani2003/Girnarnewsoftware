import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FileText, Plus, CheckCircle, Clock, Share2, Download, Printer } from 'lucide-react-native';

const SAMPLE_INVOICES = [
  {
    id: 'INV-2026-001',
    customer: 'Somnath Trust & Mandir Samiti',
    date: '28/09/2026',
    items: 'Lakha Red Stone Temple Donor Takti (36"x24")',
    taxable: 4576,
    gst: 824,
    total: 5400,
    paid: 3000,
    due: 2400,
    status: 'PARTIALLY_PAID',
    pedhi: 'Bhagvatikalamandir',
  },
  {
    id: 'INV-2026-002',
    customer: 'Shri Swaminarayan Gurukul Rajkot',
    date: '27/09/2026',
    items: 'Pure Sevan Wooden Mandir (Pooja Ghar)',
    taxable: 74576,
    gst: 13424,
    total: 88000,
    paid: 88000,
    due: 0,
    status: 'PAID',
    pedhi: 'ArvindRamjibhai',
  },
  {
    id: 'INV-2026-003',
    customer: 'Rajkot Heritage Derasar Pedhi',
    date: '26/09/2026',
    items: 'Makrana Marble Radha Krishna Murty (24")',
    taxable: 66102,
    gst: 11898,
    total: 78000,
    paid: 0,
    due: 78000,
    status: 'UNPAID',
    pedhi: 'Jaipurshilpkala',
  },
];

export default function NativeInvoicesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('ALL');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Action Banner */}
      <View style={styles.banner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>TAX INVOICES & GST BILLING</Text>
          <Text style={styles.bannerSub}>Generate GST compliant bills with automatic HSN and ledger sync.</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/create-invoice')}
          style={styles.newBtn}
        >
          <Plus color="#0f172a" size={16} />
          <Text style={styles.newBtnText}>+ Bill</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {['ALL', 'PAID', 'PARTIAL', 'UNPAID'].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Invoices List */}
      {SAMPLE_INVOICES.map((inv) => (
        <View key={inv.id} style={styles.invCard}>
          <View style={styles.invTop}>
            <View>
              <Text style={styles.invNumber}>{inv.id}</Text>
              <Text style={styles.invDate}>{inv.date} • {inv.pedhi}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                inv.status === 'PAID'
                  ? styles.paidBadge
                  : inv.status === 'PARTIALLY_PAID'
                  ? styles.partialBadge
                  : styles.unpaidBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  inv.status === 'PAID'
                    ? styles.paidText
                    : inv.status === 'PARTIALLY_PAID'
                    ? styles.partialText
                    : styles.unpaidText,
                ]}
              >
                {inv.status}
              </Text>
            </View>
          </View>

          <Text style={styles.custName}>{inv.customer}</Text>
          <Text style={styles.itemsDesc}>{inv.items}</Text>

          <View style={styles.amtRow}>
            <View>
              <Text style={styles.amtLabel}>Total Amount</Text>
              <Text style={styles.totalAmt}>₹ {inv.total.toLocaleString()}</Text>
            </View>
            <View>
              <Text style={styles.amtLabel}>Paid</Text>
              <Text style={styles.paidAmt}>₹ {inv.paid.toLocaleString()}</Text>
            </View>
            <View>
              <Text style={styles.amtLabel}>Balance Due</Text>
              <Text style={[styles.dueAmt, inv.due > 0 && { color: '#f87171' }]}>
                ₹ {inv.due.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Quick Action Footer */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Printer color="#94a3b8" size={14} />
              <Text style={styles.actionBtnText}>Print</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <Share2 color="#94a3b8" size={14} />
              <Text style={styles.actionBtnText}>WhatsApp</Text>
            </TouchableOpacity>

            {inv.due > 0 && (
              <TouchableOpacity
                onPress={() => router.push('/payment')}
                style={[styles.actionBtn, { borderColor: '#34d39940', backgroundColor: '#34d39910' }]}
              >
                <Text style={{ color: '#34d399', fontSize: 11, fontWeight: 'bold' }}>
                  + Record Jama
                </Text>
              </TouchableOpacity>
            )}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  bannerTitle: { color: '#60a5fa', fontSize: 11, fontWeight: 'bold' },
  bannerSub: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  newBtn: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8,
  },
  newBtnText: { color: '#0f172a', fontSize: 12, fontWeight: 'bold' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  filterChipActive: { backgroundColor: '#60a5fa20', borderColor: '#60a5fa' },
  filterText: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold' },
  filterTextActive: { color: '#60a5fa' },
  invCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 12,
  },
  invTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  invNumber: { color: '#60a5fa', fontSize: 13, fontWeight: 'bold', fontFamily: 'monospace' },
  invDate: { color: '#64748b', fontSize: 11, marginTop: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  paidBadge: { backgroundColor: '#10b98120' },
  partialBadge: { backgroundColor: '#fbbf2420' },
  unpaidBadge: { backgroundColor: '#ef444420' },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  paidText: { color: '#34d399' },
  partialText: { color: '#fbbf24' },
  unpaidText: { color: '#f87171' },
  custName: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold', marginTop: 8 },
  itemsDesc: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  amtRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#020617',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  amtLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold' },
  totalAmt: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  paidAmt: { color: '#34d399', fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  dueAmt: { color: '#94a3b8', fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 10, justifyContent: 'flex-end' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  actionBtnText: { color: '#94a3b8', fontSize: 11 },
});
