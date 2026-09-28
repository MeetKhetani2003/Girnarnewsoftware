import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Truck, Phone, MapPin, Tag, Plus, Trash2, Edit2, X } from 'lucide-react-native';

const INITIAL_SUPPLIERS = [
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
];

export default function NativeSuppliersScreen() {
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', contactPerson: '', mobile: '', location: '', materials: '', priceRange: '', pedhi: 'Girnarshilp', balance: '0'
  });

  const handleDelete = (id: string) => {
    Alert.alert("Delete Supplier", "Are you sure you want to delete this supplier?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => setSuppliers(suppliers.filter(s => s.id !== id)) }
    ]);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', contactPerson: '', mobile: '', location: '', materials: '', priceRange: '', pedhi: 'Girnarshilp', balance: '0' });
    setModalVisible(true);
  };

  const openEditModal = (sup: any) => {
    setEditingId(sup.id);
    setFormData({
      name: sup.name,
      contactPerson: sup.contactPerson,
      mobile: sup.mobile,
      location: sup.location,
      materials: sup.materials.join(', '),
      priceRange: sup.priceRange,
      pedhi: sup.pedhi,
      balance: sup.balance.toString(),
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.mobile) {
      Alert.alert("Error", "Quarry Name and Mobile are required");
      return;
    }
    
    const matsArray = formData.materials.split(',').map(m => m.trim()).filter(m => m.length > 0);

    const newSupplier = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      contactPerson: formData.contactPerson,
      mobile: formData.mobile,
      location: formData.location,
      materials: matsArray.length > 0 ? matsArray : ['General Stone'],
      priceRange: formData.priceRange,
      pedhi: formData.pedhi,
      balance: parseFloat(formData.balance) || 0,
    };

    if (editingId) {
      setSuppliers(suppliers.map(s => s.id === editingId ? newSupplier : s));
    } else {
      setSuppliers([newSupplier, ...suppliers]);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>QUARRIES & RAW MATERIAL SUPPLIERS</Text>
          <Text style={styles.bannerSub}>
            Tracks quarry sourcing prices to accurately compute custom Takti and Mandir profit.
          </Text>
        </View>

        {suppliers.map((sup) => (
          <View key={sup.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={{ flex: 1, paddingRight: 10 }}>
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
              <Tag color="#0ea5e9" size={13} />
              <Text style={[styles.metaText, { color: '#0ea5e9', fontWeight: 'bold' }]}>
                {sup.priceRange}
              </Text>
            </View>

            <View style={styles.materialsBox}>
              <Text style={styles.matLabel}>Supplied Stone & Wood:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
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

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text style={styles.pedhiTag}>Pedhi: {sup.pedhi}</Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <TouchableOpacity onPress={() => openEditModal(sup)} style={styles.iconBtn}>
                    <Edit2 color="#0ea5e9" size={14} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(sup.id)} style={styles.iconBtn}>
                    <Trash2 color="#f87171" size={14} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
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
              <Text style={styles.modalTitle}>{editingId ? 'Edit Supplier' : 'Add New Supplier'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#94a3b8" size={20} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={{ marginTop: 10 }}>
              <TextInput style={styles.input} placeholder="Quarry / Supplier Name" placeholderTextColor="#64748b" value={formData.name} onChangeText={t => setFormData({...formData, name: t})} />
              <TextInput style={styles.input} placeholder="Contact Person" placeholderTextColor="#64748b" value={formData.contactPerson} onChangeText={t => setFormData({...formData, contactPerson: t})} />
              <TextInput style={styles.input} placeholder="Mobile" placeholderTextColor="#64748b" keyboardType="phone-pad" value={formData.mobile} onChangeText={t => setFormData({...formData, mobile: t})} />
              <TextInput style={styles.input} placeholder="Location (City, State)" placeholderTextColor="#64748b" value={formData.location} onChangeText={t => setFormData({...formData, location: t})} />
              <TextInput style={styles.input} placeholder="Materials (comma separated)" placeholderTextColor="#64748b" value={formData.materials} onChangeText={t => setFormData({...formData, materials: t})} />
              <TextInput style={styles.input} placeholder="Price Range (e.g. ₹380 - ₹450 / sq.ft)" placeholderTextColor="#64748b" value={formData.priceRange} onChangeText={t => setFormData({...formData, priceRange: t})} />
              <TextInput style={styles.input} placeholder="Current Payable Balance" placeholderTextColor="#64748b" keyboardType="numeric" value={formData.balance} onChangeText={t => setFormData({...formData, balance: t})} />
              
              <Text style={styles.label}>Associated Pedhi</Text>
              <View style={styles.typeRow}>
                {['Girnarshilp', 'ArvindRamjibhai', 'Jaipurshilpkala'].map(t => (
                  <TouchableOpacity key={t} style={[styles.typeBtn, formData.pedhi === t && styles.typeBtnActive]} onPress={() => setFormData({...formData, pedhi: t})}>
                    <Text style={[styles.typeBtnText, formData.pedhi === t && {color: '#0ea5e9'}]}>{t.slice(0, 9)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Supplier</Text>
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
  banner: { backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 14 },
  bannerTitle: { color: '#38bdf8', fontSize: 11, fontWeight: 'bold' },
  bannerSub: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  card: { backgroundColor: '#0f172a', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  supName: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold' },
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
  iconBtn: { padding: 4, backgroundColor: '#1e293b', borderRadius: 6 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#38bdf8', alignItems: 'center', justifyContent: 'center', elevation: 5, shadowColor: '#38bdf8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  modalBg: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0f172a', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%', borderWidth: 1, borderColor: '#1e293b' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  modalTitle: { color: '#f8fafc', fontSize: 16, fontWeight: 'bold' },
  label: { color: '#94a3b8', fontSize: 12, marginBottom: 6, fontWeight: 'bold', marginTop: 4 },
  input: { backgroundColor: '#020617', borderWidth: 1, borderColor: '#1e293b', borderRadius: 10, padding: 12, color: '#f8fafc', marginBottom: 12 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeBtn: { flex: 1, padding: 10, borderRadius: 8, backgroundColor: '#020617', borderWidth: 1, borderColor: '#1e293b', alignItems: 'center' },
  typeBtnActive: { borderColor: '#0ea5e9', backgroundColor: '#0ea5e915' },
  typeBtnText: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#38bdf8', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 14 }
});
