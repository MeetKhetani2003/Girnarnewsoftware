import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Users, Phone, ArrowUpRight, ArrowDownLeft, Search, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const SAMPLE_PARTIES = [
  {
    id: '1',
    name: 'Somnath Trust & Mandir Samiti',
    mobile: '9825012345',
    city: 'Somnath, Gujarat',
    type: 'Customer',
    balance: 2400,
    balanceType: 'RECEIVABLE', // Lena
    gstNumber: '24AAACT1234F1Z1',
  },
  {
    id: '2',
    name: 'Shri Swaminarayan Gurukul Rajkot',
    mobile: '9824298765',
    city: 'Rajkot, Gujarat',
    type: 'Customer',
    balance: 0,
    balanceType: 'CLEARED',
    gstNumber: '24AABCS5678R1Z2',
  },
  {
    id: '3',
    name: 'Rajkot Heritage Derasar Pedhi',
    mobile: '9909011223',
    city: 'Rajkot, Gujarat',
    type: 'Customer',
    balance: 78000,
    balanceType: 'RECEIVABLE', // Lena
  },
  {
    id: '4',
    name: 'Makrana White Marble Quarry Works',
    mobile: '9414055667',
    city: 'Makrana, Rajasthan',
    type: 'Vendor',
    balance: 45000,
    balanceType: 'PAYABLE', // Dena
  },
];

export default function NativePartiesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filtered = SAMPLE_PARTIES.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) || p.mobile.includes(search);
    const matchesType =
      filterType === 'ALL' ||
      (filterType === 'RECEIVABLE' && p.balanceType === 'RECEIVABLE') ||
      (filterType === 'PAYABLE' && p.balanceType === 'PAYABLE');
    return matchesSearch && matchesType;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Search Input */}
      <View style={styles.searchBox}>
        <Search color="#64748b" size={16} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by party name or mobile..."
          placeholderTextColor="#64748b"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => setFilterType('ALL')}
          style={[styles.filterChip, filterType === 'ALL' && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, filterType === 'ALL' && styles.filterTextActive]}>
            All Parties
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilterType('RECEIVABLE')}
          style={[styles.filterChip, filterType === 'RECEIVABLE' && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, filterType === 'RECEIVABLE' && styles.filterTextActive]}>
            Lena (Receivable)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilterType('PAYABLE')}
          style={[styles.filterChip, filterType === 'PAYABLE' && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, filterType === 'PAYABLE' && styles.filterTextActive]}>
            Dena (Payable)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Party Cards */}
      {filtered.map((party) => (
        <View key={party.id} style={styles.partyCard}>
          <View style={styles.partyTop}>
            <View>
              <Text style={styles.partyName}>{party.name}</Text>
              <Text style={styles.partySub}>{party.city} • {party.type}</Text>
            </View>

            <View style={styles.balBox}>
              <Text style={styles.balLabel}>
                {party.balanceType === 'RECEIVABLE'
                  ? 'LENA (To Take)'
                  : party.balanceType === 'PAYABLE'
                  ? 'DENA (To Pay)'
                  : 'NIL (Cleared)'}
              </Text>
              <Text
                style={[
                  styles.balVal,
                  party.balanceType === 'RECEIVABLE'
                    ? { color: '#34d399' }
                    : party.balanceType === 'PAYABLE'
                    ? { color: '#f87171' }
                    : { color: '#94a3b8' },
                ]}
              >
                ₹ {party.balance.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Phone color="#94a3b8" size={13} />
              <Text style={styles.actionBtnText}>{party.mobile}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/payment')}
              style={[styles.actionBtn, { borderColor: '#34d39940', backgroundColor: '#34d39910' }]}
            >
              <Text style={{ color: '#34d399', fontSize: 11, fontWeight: 'bold' }}>
                + Record Entry
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 12,
  },
  searchInput: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, color: '#f8fafc', fontSize: 13 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  filterChipActive: { backgroundColor: '#fbbf2420', borderColor: '#fbbf24' },
  filterText: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold' },
  filterTextActive: { color: '#fbbf24' },
  partyCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 12,
  },
  partyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  partyName: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold', maxWidth: 190 },
  partySub: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  balBox: { alignItems: 'flex-end' },
  balLabel: { color: '#64748b', fontSize: 9, fontWeight: 'bold' },
  balVal: { fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#1e293b' },
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
