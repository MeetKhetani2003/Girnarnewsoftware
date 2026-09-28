import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft, Search, Calendar, DollarSign } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAMPLE_ORDERS = [
  { id: 'ORD-101', customerName: 'Somnath Trust & Mandir Samiti', productType: 'takti', totalRevenue: 5400, date: '2026-09-28T10:00:00.000Z' },
  { id: 'ORD-102', customerName: 'Shri Swaminarayan Gurukul Rajkot', productType: 'mandir', totalRevenue: 88000, date: '2026-09-27T10:00:00.000Z' },
  { id: 'ORD-103', customerName: 'Rajkot Heritage Derasar Pedhi', productType: 'murti', totalRevenue: 78000, date: '2026-09-26T10:00:00.000Z' },
];

const SAMPLE_INVOICES = [
  { id: 'INV-2026-001', customer: 'Somnath Trust & Mandir Samiti', itemName: 'Lakha Red Stone Temple Donor Takti (36"x24")', total: 5400, date: '2026-09-28T12:00:00.000Z' },
  { id: 'INV-2026-002', customer: 'Shri Swaminarayan Gurukul Rajkot', itemName: 'Pure Sevan Wooden Mandir (Pooja Ghar)', total: 88000, date: '2026-09-27T12:00:00.000Z' },
  { id: 'INV-2026-003', customer: 'Rajkot Heritage Derasar Pedhi', itemName: 'Makrana Marble Radha Krishna Murty (24")', total: 78000, date: '2026-09-26T12:00:00.000Z' },
];

export default function PartyDetailsScreen() {
  const { partyStr } = useLocalSearchParams();
  const router = useRouter();

  let partyObj: any = null;
  try {
    if (partyStr) partyObj = JSON.parse(partyStr as string);
  } catch (e) {}

  const partyName = partyObj?.name || 'Unknown Party';

  const [transactions, setTransactions] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    if (!partyObj) return;
    try {
      const ordersStr = await AsyncStorage.getItem('orders');
      const invoicesStr = await AsyncStorage.getItem('invoices');
      
      const orders = ordersStr ? JSON.parse(ordersStr) : [];
      const invoices = invoicesStr ? JSON.parse(invoicesStr) : [];
      
      const allOrders = [...orders, ...SAMPLE_ORDERS];
      const allInvoices = [...invoices, ...SAMPLE_INVOICES];

      const partyOrders = allOrders.filter((o: any) => o.customerName === partyName || o.customer === partyName).map((o: any) => ({
        id: o.id,
        type: 'ORDER',
        amount: o.totalRevenue || o.selling || 0,
        date: o.date || new Date().toISOString(),
        desc: `Custom ${o.productType || o.type}`
      }));
      
      const partyInvoices = allInvoices.filter((i: any) => i.customer === partyName).map((i: any) => ({
        id: i.id,
        type: 'INVOICE',
        amount: i.total || 0,
        date: i.date || new Date().toISOString(),
        desc: i.itemName || i.items || 'Invoice'
      }));

      // Combine and sort by date descending, avoiding duplicate IDs if any
      const combinedMap = new Map();
      [...partyOrders, ...partyInvoices].forEach(tx => combinedMap.set(tx.id, tx));
      
      const combined = Array.from(combinedMap.values()).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setTransactions(combined);
    } catch(e) {
      console.log('Error loading party transactions:', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [partyStr])
  );

  const filtered = transactions.filter(t => 
    t.id.toLowerCase().includes(search.toLowerCase()) || 
    t.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color="#f8fafc" size={24} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>{partyName}</Text>
          {partyObj && <Text style={styles.headerSub}>{partyObj.city} • {partyObj.mobile}</Text>}
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {partyObj && (
          <View style={styles.statsCard}>
            <View style={styles.statBox}>
              <View>
                <Text style={styles.statLabel}>Current Balance</Text>
                <Text style={[styles.statVal, partyObj.balanceType === 'RECEIVABLE' ? { color: '#34d399' } : partyObj.balanceType === 'PAYABLE' ? { color: '#f87171' } : { color: '#f8fafc' }]}>
                  {partyObj.balanceType === 'RECEIVABLE' ? '+' : partyObj.balanceType === 'PAYABLE' ? '-' : ''}₹ {partyObj.balance.toLocaleString()}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.statLabel}>Total Transactions</Text>
                <Text style={[styles.statVal, { color: '#f8fafc' }]}>{transactions.length}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.searchBox}>
          <Search color="#64748b" size={16} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor="#64748b"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <Text style={styles.sectionHeader}>TRANSACTION HISTORY</Text>

        {filtered.map((tx, idx) => (
          <View key={tx.id || idx} style={styles.card}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.txId}>{tx.id}</Text>
                <Text style={styles.txDate}>{new Date(tx.date).toLocaleDateString()}</Text>
              </View>
              <View style={[styles.badge, tx.type === 'INVOICE' ? styles.invoiceBadge : styles.orderBadge]}>
                <Text style={[styles.badgeText, tx.type === 'INVOICE' ? styles.invoiceText : styles.orderText]}>{tx.type}</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.desc}>{tx.desc}</Text>
              <Text style={styles.amount}>₹ {tx.amount.toLocaleString()}</Text>
            </View>
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyBox}>
            <Calendar color="#334155" size={48} />
            <Text style={styles.emptyText}>No transactions found for this party.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#0f172a', 
    paddingTop: 50, 
    paddingBottom: 16, 
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  backBtn: { padding: 8, marginRight: 8, marginLeft: -8 },
  headerTitle: { color: '#f8fafc', fontSize: 18, fontWeight: 'bold' },
  headerSub: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  content: { padding: 16 },
  statsCard: { 
    backgroundColor: '#0f172a', 
    borderRadius: 14, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: '#1e293b',
    marginBottom: 16
  },
  statBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statLabel: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  statVal: { color: '#f8fafc', fontSize: 20, fontWeight: 'bold', marginTop: 2 },
  searchBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#0f172a', 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    borderWidth: 1, 
    borderColor: '#1e293b', 
    marginBottom: 20 
  },
  searchInput: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, color: '#f8fafc', fontSize: 14 },
  sectionHeader: { color: '#0ea5e9', fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginBottom: 12 },
  card: { 
    backgroundColor: '#0f172a', 
    borderRadius: 14, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: '#1e293b', 
    marginBottom: 12 
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  txId: { color: '#60a5fa', fontSize: 13, fontWeight: 'bold', fontFamily: 'monospace' },
  txDate: { color: '#64748b', fontSize: 11, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  invoiceBadge: { backgroundColor: '#34d39920' },
  orderBadge: { backgroundColor: '#8b5cf620' },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  invoiceText: { color: '#34d399' },
  orderText: { color: '#a78bfa' },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#1e293b' },
  desc: { color: '#f8fafc', fontSize: 14, flex: 1 },
  amount: { color: '#f8fafc', fontSize: 16, fontWeight: 'bold' },
  emptyBox: { marginTop: 60, alignItems: 'center' },
  emptyText: { color: '#64748b', marginTop: 12, fontSize: 14 }
});
