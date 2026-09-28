import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Phone, Search, Plus, Trash2, Edit2, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const SAMPLE_PARTIES = [
  {
    id: '1',
    name: 'Somnath Trust & Mandir Samiti',
    mobile: '9825012345',
    city: 'Somnath, Gujarat',
    type: 'Customer',
    balance: 2400,
    balanceType: 'RECEIVABLE',
  },
  {
    id: '2',
    name: 'Shri Swaminarayan Gurukul Rajkot',
    mobile: '9824298765',
    city: 'Rajkot, Gujarat',
    type: 'Customer',
    balance: 0,
    balanceType: 'CLEARED',
  },
  {
    id: '3',
    name: 'Makrana White Marble Quarry Works',
    mobile: '9414055667',
    city: 'Makrana, Rajasthan',
    type: 'Vendor',
    balance: 45000,
    balanceType: 'PAYABLE',
  },
];

export default function NativePartiesScreen() {
  const router = useRouter();
  const [parties, setParties] = useState(SAMPLE_PARTIES);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', mobile: '', city: '', type: 'Customer', balance: '0', balanceType: 'CLEARED'
  });

  const filtered = parties.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.mobile.includes(search);
    const matchesType =
      filterType === 'ALL' ||
      (filterType === 'RECEIVABLE' && p.balanceType === 'RECEIVABLE') ||
      (filterType === 'PAYABLE' && p.balanceType === 'PAYABLE');
    return matchesSearch && matchesType;
  });

  const handleDelete = (id: string) => {
    Alert.alert("Delete Party", "Are you sure you want to delete this party?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => setParties(parties.filter(p => p.id !== id)) }
    ]);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', mobile: '', city: '', type: 'Customer', balance: '0', balanceType: 'CLEARED' });
    setModalVisible(true);
  };

  const openEditModal = (party: any) => {
    setEditingId(party.id);
    setFormData({
      name: party.name,
      mobile: party.mobile,
      city: party.city,
      type: party.type,
      balance: party.balance.toString(),
      balanceType: party.balanceType,
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.mobile) {
      Alert.alert("Error", "Name and Mobile are required");
      return;
    }
    const newParty = {
      id: editingId || Date.now().toString(),
      ...formData,
      balance: parseFloat(formData.balance) || 0,
    };
    if (editingId) {
      setParties(parties.map(p => p.id === editingId ? newParty : p));
    } else {
      setParties([newParty, ...parties]);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Search */}
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
          {['ALL', 'RECEIVABLE', 'PAYABLE'].map(type => (
            <TouchableOpacity
              key={type}
              onPress={() => setFilterType(type)}
              style={[styles.filterChip, filterType === type && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, filterType === type && styles.filterTextActive]}>
                {type === 'ALL' ? 'All' : type === 'RECEIVABLE' ? 'Lena (Receivable)' : 'Dena (Payable)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        {filtered.map((party) => (
          <TouchableOpacity 
            key={party.id} 
            style={styles.partyCard}
            onPress={() => router.push({ pathname: '/party-details', params: { partyStr: JSON.stringify(party) } })}
          >
            <View style={styles.partyTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.partyName}>{party.name}</Text>
                <Text style={styles.partySub}>{party.city} • {party.type}</Text>
              </View>
              <View style={styles.balBox}>
                <Text style={styles.balLabel}>
                  {party.balanceType === 'RECEIVABLE' ? 'LENA' : party.balanceType === 'PAYABLE' ? 'DENA' : 'NIL'}
                </Text>
                <Text style={[
                  styles.balVal,
                  party.balanceType === 'RECEIVABLE' ? { color: '#34d399' } : party.balanceType === 'PAYABLE' ? { color: '#f87171' } : { color: '#94a3b8' }
                ]}>
                  ₹ {party.balance.toLocaleString()}
                </Text>
              </View>
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn}>
                <Phone color="#94a3b8" size={13} />
                <Text style={styles.actionBtnText}>{party.mobile}</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity onPress={() => openEditModal(party)} style={styles.iconBtn}>
                  <Edit2 color="#0ea5e9" size={14} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(party.id)} style={styles.iconBtn}>
                  <Trash2 color="#f87171" size={14} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Plus color="#0f172a" size={24} />
      </TouchableOpacity>

      {/* CRUD Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Edit Party' : 'Add New Party'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#94a3b8" size={20} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={{ marginTop: 10 }}>
              <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#64748b" value={formData.name} onChangeText={t => setFormData({...formData, name: t})} />
              <TextInput style={styles.input} placeholder="Mobile" placeholderTextColor="#64748b" keyboardType="phone-pad" value={formData.mobile} onChangeText={t => setFormData({...formData, mobile: t})} />
              <TextInput style={styles.input} placeholder="City" placeholderTextColor="#64748b" value={formData.city} onChangeText={t => setFormData({...formData, city: t})} />
              
              <View style={styles.typeRow}>
                {['Customer', 'Vendor'].map(t => (
                  <TouchableOpacity key={t} style={[styles.typeBtn, formData.type === t && styles.typeBtnActive]} onPress={() => setFormData({...formData, type: t})}>
                    <Text style={[styles.typeBtnText, formData.type === t && {color: '#0ea5e9'}]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput style={styles.input} placeholder="Opening Balance" placeholderTextColor="#64748b" keyboardType="numeric" value={formData.balance} onChangeText={t => setFormData({...formData, balance: t})} />
              
              <View style={styles.typeRow}>
                {['RECEIVABLE', 'PAYABLE', 'CLEARED'].map(t => (
                  <TouchableOpacity key={t} style={[styles.typeBtn, formData.balanceType === t && styles.typeBtnActive]} onPress={() => setFormData({...formData, balanceType: t})}>
                    <Text style={[styles.typeBtnText, formData.balanceType === t && {color: '#0ea5e9'}]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Party</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16, paddingBottom: 80 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: '#1e293b', marginBottom: 12 },
  searchInput: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, color: '#f8fafc', fontSize: 13 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b' },
  filterChipActive: { backgroundColor: '#0ea5e920', borderColor: '#0ea5e9' },
  filterText: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold' },
  filterTextActive: { color: '#0ea5e9' },
  partyCard: { backgroundColor: '#0f172a', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 12 },
  partyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  partyName: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold', maxWidth: '90%' },
  partySub: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  balBox: { alignItems: 'flex-end' },
  balLabel: { color: '#64748b', fontSize: 9, fontWeight: 'bold' },
  balVal: { fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#1e293b' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  actionBtnText: { color: '#94a3b8', fontSize: 11 },
  iconBtn: { padding: 6, backgroundColor: '#1e293b', borderRadius: 8 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#0ea5e9', alignItems: 'center', justifyContent: 'center', elevation: 5, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  modalBg: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0f172a', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%', borderWidth: 1, borderColor: '#1e293b' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  modalTitle: { color: '#f8fafc', fontSize: 16, fontWeight: 'bold' },
  input: { backgroundColor: '#020617', borderWidth: 1, borderColor: '#1e293b', borderRadius: 10, padding: 12, color: '#f8fafc', marginBottom: 12 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  typeBtn: { flex: 1, padding: 10, borderRadius: 8, backgroundColor: '#020617', borderWidth: 1, borderColor: '#1e293b', alignItems: 'center' },
  typeBtnActive: { borderColor: '#0ea5e9', backgroundColor: '#0ea5e915' },
  typeBtnText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#0ea5e9', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 14 }
});
