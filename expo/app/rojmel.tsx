import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';

const ROJMEL_ENTRIES = [
  {
    id: 'TXN-01',
    type: 'PAYMENT_IN', // Jama
    title: 'Customer Advance (Somnath Trust)',
    mode: 'Bank Transfer / RTGS',
    amount: 50000,
    pedhi: 'Bhagvatikalamandir',
    time: '11:30 AM',
    note: 'Lakha Red Stone Mandir Takti Advance',
  },
  {
    id: 'TXN-02',
    type: 'PAYMENT_OUT', // Naame
    title: 'Rajasthan Quarry Trailer Freight',
    mode: 'Cash',
    amount: 14000,
    pedhi: 'Bhagvatikalamandir',
    time: '01:15 PM',
    note: 'Paid to transport driver for slab delivery',
  },
  {
    id: 'TXN-03',
    type: 'PAYMENT_IN', // Jama
    title: 'Gurukul Mandir Full Settlement',
    mode: 'Cheque Cleared',
    amount: 88000,
    pedhi: 'ArvindRamjibhai',
    time: '03:45 PM',
    note: 'Pure Sevan Wooden Mandir invoice complete',
  },
  {
    id: 'TXN-04',
    type: 'PAYMENT_OUT', // Naame
    title: 'Karigar Sculptor Weekly Wages',
    mode: 'Cash',
    amount: 22000,
    pedhi: 'Girnarshilp',
    time: '05:30 PM',
    note: 'Temple carving karigars',
  },
];

export default function NativeRojmelScreen() {
  const router = useRouter();

  const totalJama = ROJMEL_ENTRIES.filter((e) => e.type === 'PAYMENT_IN').reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const totalNaame = ROJMEL_ENTRIES.filter((e) => e.type === 'PAYMENT_OUT').reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const netBalance = totalJama - totalNaame;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Daily Balance Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>TODAY'S ROJMEL (CASH & BANK)</Text>
          <Text style={styles.summaryDate}>28 Sep 2026</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>TOTAL JAMA (IN)</Text>
            <Text style={[styles.statVal, { color: '#34d399' }]}>
              +₹ {totalJama.toLocaleString()}
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>TOTAL NAAME (OUT)</Text>
            <Text style={[styles.statVal, { color: '#f87171' }]}>
              -₹ {totalNaame.toLocaleString()}
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>NET CLOSING</Text>
            <Text style={[styles.statVal, { color: '#fbbf24' }]}>
              ₹ {netBalance.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.quickAddRow}>
          <TouchableOpacity
            onPress={() => router.push('/payment')}
            style={[styles.addBtn, { backgroundColor: '#10b98125', borderColor: '#10b98150' }]}
          >
            <ArrowDownLeft color="#34d399" size={14} />
            <Text style={{ color: '#34d399', fontSize: 11, fontWeight: 'bold' }}>+ Jama (In)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/payment')}
            style={[styles.addBtn, { backgroundColor: '#ef444425', borderColor: '#ef444450' }]}
          >
            <ArrowUpRight color="#f87171" size={14} />
            <Text style={{ color: '#f87171', fontSize: 11, fontWeight: 'bold' }}>+ Naame (Out)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Entries List */}
      <Text style={styles.listHeader}>ALL TRANSACTIONS TODAY</Text>

      {ROJMEL_ENTRIES.map((entry) => (
        <View key={entry.id} style={styles.entryCard}>
          <View style={styles.entryTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View
                style={[
                  styles.iconCircle,
                  entry.type === 'PAYMENT_IN' ? styles.jamaIcon : styles.naameIcon,
                ]}
              >
                {entry.type === 'PAYMENT_IN' ? (
                  <ArrowDownLeft color="#34d399" size={16} />
                ) : (
                  <ArrowUpRight color="#f87171" size={16} />
                )}
              </View>
              <View>
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <Text style={styles.entrySub}>
                  {entry.time} • {entry.mode} • {entry.pedhi}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.entryAmt,
                entry.type === 'PAYMENT_IN' ? { color: '#34d399' } : { color: '#f87171' },
              ]}
            >
              {entry.type === 'PAYMENT_IN' ? '+' : '-'}₹ {entry.amount.toLocaleString()}
            </Text>
          </View>

          {entry.note && <Text style={styles.noteText}>Note: {entry.note}</Text>}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16 },
  summaryCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 16,
  },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryTitle: { color: '#34d399', fontSize: 11, fontWeight: 'bold' },
  summaryDate: { color: '#94a3b8', fontSize: 11 },
  grid: { flexDirection: 'row', gap: 8 },
  statBox: { flex: 1, backgroundColor: '#020617', padding: 10, borderRadius: 10 },
  statLabel: { color: '#64748b', fontSize: 9, fontWeight: 'bold' },
  statVal: { fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  quickAddRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  addBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  listHeader: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  entryCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 10,
  },
  entryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconCircle: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  jamaIcon: { backgroundColor: '#10b98120' },
  naameIcon: { backgroundColor: '#ef444420' },
  entryTitle: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold', maxWidth: 180 },
  entrySub: { color: '#94a3b8', fontSize: 10, marginTop: 2 },
  entryAmt: { fontSize: 14, fontWeight: 'bold' },
  noteText: { color: '#64748b', fontSize: 11, marginTop: 8, fontStyle: 'italic' },
});
