import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight, Plus, Trash2, Edit2, X } from 'lucide-react-native';

const INITIAL_ENTRIES = [
  {
    id: 'TXN-01',
    type: 'PAYMENT_IN',
    title: 'Customer Advance (Somnath Trust)',
    mode: 'Bank Transfer',
    amount: 50000,
    pedhi: 'Bhagvatikalamandir',
    time: '11:30 AM',
    note: 'Lakha Red Stone Mandir Takti',
  },
  {
    id: 'TXN-02',
    type: 'PAYMENT_OUT',
    title: 'Rajasthan Quarry Freight',
    mode: 'Cash',
    amount: 14000,
    pedhi: 'Bhagvatikalamandir',
    time: '01:15 PM',
    note: 'Paid to transport driver',
  },
];

export default function NativeRojmelScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '', type: 'PAYMENT_IN', mode: 'Cash', pedhi: 'Girnarshilp', amount: '', note: ''
  });

  const totalJama = entries.filter((e) => e.type === 'PAYMENT_IN').reduce((sum, e) => sum + e.amount, 0);
  const totalNaame = entries.filter((e) => e.type === 'PAYMENT_OUT').reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalJama - totalNaame;

  const handleDelete = (id: string) => {
    Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => setEntries(entries.filter(e => e.id !== id)) }
    ]);
  };

  const openModal = (type: 'PAYMENT_IN' | 'PAYMENT_OUT') => {
    setEditingId(null);
    setFormData({ title: '', type, mode: 'Cash', pedhi: 'Girnarshilp', amount: '', note: '' });
    setModalVisible(true);
  };

  const openEditModal = (entry: any) => {
    setEditingId(entry.id);
    setFormData({
      title: entry.title,
      type: entry.type,
      mode: entry.mode,
      pedhi: entry.pedhi,
      amount: entry.amount.toString(),
      note: entry.note || '',
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.amount) {
      Alert.alert("Error", "Title and Amount are required");
      return;
    }
    const newEntry = {
      id: editingId || `TXN-${Date.now().toString().slice(-4)}`,
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    if (editingId) {
      setEntries(entries.map(e => e.id === editingId ? newEntry : e));
    } else {
      setEntries([newEntry, ...entries]);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Daily Balance Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>TODAY'S ROJMEL (CASH & BANK)</Text>
            <Text style={styles.summaryDate}>{new Date().toLocaleDateString()}</Text>
          </View>

          <View style={styles.grid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>TOTAL JAMA (IN)</Text>
              <Text style={[styles.statVal, { color: '#34d399' }]}>+₹ {totalJama.toLocaleString()}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>TOTAL NAAME (OUT)</Text>
              <Text style={[styles.statVal, { color: '#f87171' }]}>-₹ {totalNaame.toLocaleString()}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>NET CLOSING</Text>
              <Text style={[styles.statVal, { color: '#0ea5e9' }]}>₹ {netBalance.toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.quickAddRow}>
            <TouchableOpacity onPress={() => openModal('PAYMENT_IN')} style={[styles.addBtn, { backgroundColor: '#10b98125', borderColor: '#10b98150' }]}>
              <ArrowDownLeft color="#34d399" size={14} />
              <Text style={{ color: '#34d399', fontSize: 11, fontWeight: 'bold' }}>+ Jama (In)</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openModal('PAYMENT_OUT')} style={[styles.addBtn, { backgroundColor: '#ef444425', borderColor: '#ef444450' }]}>
              <ArrowUpRight color="#f87171" size={14} />
              <Text style={{ color: '#f87171', fontSize: 11, fontWeight: 'bold' }}>+ Naame (Out)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Entries List */}
        <Text style={styles.listHeader}>ALL TRANSACTIONS TODAY</Text>

        {entries.map((entry) => (
          <View key={entry.id} style={styles.entryCard}>
            <View style={styles.entryTop}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                <View style={[styles.iconCircle, entry.type === 'PAYMENT_IN' ? styles.jamaIcon : styles.naameIcon]}>
                  {entry.type === 'PAYMENT_IN' ? <ArrowDownLeft color="#34d399" size={16} /> : <ArrowUpRight color="#f87171" size={16} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.entryTitle} numberOfLines={1}>{entry.title}</Text>
                  <Text style={styles.entrySub}>{entry.time} • {entry.mode} • {entry.pedhi}</Text>
                </View>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.entryAmt, entry.type === 'PAYMENT_IN' ? { color: '#34d399' } : { color: '#f87171' }]}>
                  {entry.type === 'PAYMENT_IN' ? '+' : '-'}₹ {entry.amount.toLocaleString()}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                  <TouchableOpacity onPress={() => openEditModal(entry)} style={styles.iconBtn}>
                    <Edit2 color="#0ea5e9" size={12} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(entry.id)} style={styles.iconBtn}>
                    <Trash2 color="#f87171" size={12} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {entry.note ? <Text style={styles.noteText}>Note: {entry.note}</Text> : null}
          </View>
        ))}
      </ScrollView>

      {/* CRUD Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Edit Transaction' : formData.type === 'PAYMENT_IN' ? 'Add Jama (Payment In)' : 'Add Naame (Payment Out)'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#94a3b8" size={20} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={{ marginTop: 10 }}>
              <TextInput style={styles.input} placeholder="Transaction Title" placeholderTextColor="#64748b" value={formData.title} onChangeText={t => setFormData({...formData, title: t})} />
              <TextInput style={styles.input} placeholder="Amount (₹)" placeholderTextColor="#64748b" keyboardType="numeric" value={formData.amount} onChangeText={t => setFormData({...formData, amount: t})} />
              <TextInput style={styles.input} placeholder="Note (Optional)" placeholderTextColor="#64748b" value={formData.note} onChangeText={t => setFormData({...formData, note: t})} />
              
              <Text style={styles.label}>Mode</Text>
              <View style={styles.typeRow}>
                {['Cash', 'Bank Transfer', 'Cheque'].map(t => (
                  <TouchableOpacity key={t} style={[styles.typeBtn, formData.mode === t && styles.typeBtnActive]} onPress={() => setFormData({...formData, mode: t})}>
                    <Text style={[styles.typeBtnText, formData.mode === t && {color: '#0ea5e9'}]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Pedhi</Text>
              <View style={styles.typeRow}>
                {['Girnarshilp', 'ArvindRamjibhai', 'Bhagvatikalamandir'].map(t => (
                  <TouchableOpacity key={t} style={[styles.typeBtn, formData.pedhi === t && styles.typeBtnActive]} onPress={() => setFormData({...formData, pedhi: t})}>
                    <Text style={[styles.typeBtnText, formData.pedhi === t && {color: '#0ea5e9'}]}>{t.slice(0, 9)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <TouchableOpacity style={[styles.saveBtn, formData.type === 'PAYMENT_IN' ? {backgroundColor: '#34d399'} : {backgroundColor: '#f87171'}]} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Transaction</Text>
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
  summaryCard: { backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', marginBottom: 16 },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryTitle: { color: '#34d399', fontSize: 11, fontWeight: 'bold' },
  summaryDate: { color: '#94a3b8', fontSize: 11 },
  grid: { flexDirection: 'row', gap: 8 },
  statBox: { flex: 1, backgroundColor: '#020617', padding: 10, borderRadius: 10 },
  statLabel: { color: '#64748b', fontSize: 9, fontWeight: 'bold' },
  statVal: { fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  quickAddRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  addBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  listHeader: { color: '#64748b', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5, marginBottom: 10 },
  entryCard: { backgroundColor: '#0f172a', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#1e293b', marginBottom: 10 },
  entryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconCircle: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  jamaIcon: { backgroundColor: '#10b98120' },
  naameIcon: { backgroundColor: '#ef444420' },
  entryTitle: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold' },
  entrySub: { color: '#94a3b8', fontSize: 10, marginTop: 2 },
  entryAmt: { fontSize: 14, fontWeight: 'bold' },
  noteText: { color: '#64748b', fontSize: 11, marginTop: 8, fontStyle: 'italic' },
  iconBtn: { padding: 4, backgroundColor: '#1e293b', borderRadius: 6 },
  modalBg: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0f172a', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%', borderWidth: 1, borderColor: '#1e293b' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  modalTitle: { color: '#f8fafc', fontSize: 16, fontWeight: 'bold' },
  label: { color: '#94a3b8', fontSize: 12, marginBottom: 6, fontWeight: 'bold' },
  input: { backgroundColor: '#020617', borderWidth: 1, borderColor: '#1e293b', borderRadius: 10, padding: 12, color: '#f8fafc', marginBottom: 12 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeBtn: { flex: 1, padding: 10, borderRadius: 8, backgroundColor: '#020617', borderWidth: 1, borderColor: '#1e293b', alignItems: 'center' },
  typeBtnActive: { borderColor: '#0ea5e9', backgroundColor: '#0ea5e915' },
  typeBtnText: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold' },
  saveBtn: { padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 14 }
});
