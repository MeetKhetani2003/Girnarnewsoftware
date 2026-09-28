import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Building2, MapPin, Phone, Mail, FileText, CheckCircle2, Plus, Edit2, Trash2, X } from 'lucide-react-native';

const INITIAL_PEDHIS = [
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
    businessType: 'Pure Sevan Wooden Mandirs',
    city: 'Rajkot, Gujarat',
    address: 'Gondal Road Workshop Yard, Rajkot 360004',
    mobile: '9825022222',
    email: 'arvind@girnar.com',
    gst: '24AAACA2222B1Z6',
    activeOrders: 9,
    focus: 'Sevan Wood Pooja Mandirs',
  },
];

export default function NativePedhisScreen() {
  const [pedhis, setPedhis] = useState(INITIAL_PEDHIS);
  const [selectedPedhi, setSelectedPedhi] = useState(INITIAL_PEDHIS[0].id);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', businessType: '', city: '', address: '', mobile: '', email: '', gst: '', focus: ''
  });

  const handleDelete = (id: string) => {
    Alert.alert("Delete Pedhi", "Are you sure you want to delete this Pedhi?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => setPedhis(pedhis.filter(p => p.id !== id)) }
    ]);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', businessType: '', city: '', address: '', mobile: '', email: '', gst: '', focus: '' });
    setModalVisible(true);
  };

  const openEditModal = (pedhi: any) => {
    setEditingId(pedhi.id);
    setFormData({
      name: pedhi.name,
      businessType: pedhi.businessType,
      city: pedhi.city,
      address: pedhi.address,
      mobile: pedhi.mobile,
      email: pedhi.email,
      gst: pedhi.gst,
      focus: pedhi.focus,
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      Alert.alert("Error", "Pedhi Name is required");
      return;
    }
    const newPedhi = {
      id: editingId || Date.now().toString(),
      ...formData,
      activeOrders: editingId ? pedhis.find(p => p.id === editingId)?.activeOrders || 0 : 0,
    };
    if (editingId) {
      setPedhis(pedhis.map(p => p.id === editingId ? newPedhi : p));
    } else {
      setPedhis([newPedhi, ...pedhis]);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>ENTERPRISE MULTI-PEDHI ARCHITECTURE</Text>
          <Text style={styles.bannerSub}>
            Each Pedhi operates independently with isolated ledgers, GST invoices, and stock tracking.
          </Text>
        </View>

        {pedhis.map((p) => {
          const isSelected = p.id === selectedPedhi;
          return (
            <View key={p.id} style={[styles.card, isSelected && styles.activeCard]}>
              <View style={styles.cardTop}>
                <View style={styles.iconBox}>
                  <Building2 color="#0ea5e9" size={20} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.pedhiName}>{p.name}</Text>
                  <Text style={styles.pedhiType}>{p.businessType}</Text>
                </View>
                {isSelected ? (
                  <View style={styles.activeBadge}>
                    <CheckCircle2 color="#0f172a" size={14} />
                    <Text style={styles.activeText}>Active</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity onPress={() => openEditModal(p)} style={styles.iconBtn}>
                      <Edit2 color="#0ea5e9" size={14} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(p.id)} style={styles.iconBtn}>
                      <Trash2 color="#f87171" size={14} />
                    </TouchableOpacity>
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
                <Text style={[styles.infoText, { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: '#0ea5e9' }]}>
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

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Plus color="#0f172a" size={24} />
      </TouchableOpacity>

      {/* CRUD Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Edit Pedhi' : 'Add New Pedhi'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#94a3b8" size={20} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={{ marginTop: 10 }}>
              <TextInput style={styles.input} placeholder="Pedhi Name" placeholderTextColor="#64748b" value={formData.name} onChangeText={t => setFormData({...formData, name: t})} />
              <TextInput style={styles.input} placeholder="Business Type" placeholderTextColor="#64748b" value={formData.businessType} onChangeText={t => setFormData({...formData, businessType: t})} />
              <TextInput style={styles.input} placeholder="Specialization (Focus)" placeholderTextColor="#64748b" value={formData.focus} onChangeText={t => setFormData({...formData, focus: t})} />
              <TextInput style={styles.input} placeholder="City" placeholderTextColor="#64748b" value={formData.city} onChangeText={t => setFormData({...formData, city: t})} />
              <TextInput style={styles.input} placeholder="Full Address" placeholderTextColor="#64748b" value={formData.address} onChangeText={t => setFormData({...formData, address: t})} />
              <TextInput style={styles.input} placeholder="GST Number" placeholderTextColor="#64748b" autoCapitalize="characters" value={formData.gst} onChangeText={t => setFormData({...formData, gst: t})} />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TextInput style={[styles.input, {flex: 1}]} placeholder="Mobile" placeholderTextColor="#64748b" keyboardType="phone-pad" value={formData.mobile} onChangeText={t => setFormData({...formData, mobile: t})} />
                <TextInput style={[styles.input, {flex: 1}]} placeholder="Email" placeholderTextColor="#64748b" keyboardType="email-address" autoCapitalize="none" value={formData.email} onChangeText={t => setFormData({...formData, email: t})} />
              </View>
            </ScrollView>
            
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Pedhi</Text>
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
  banner: { backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 16 },
  bannerTitle: { color: '#0ea5e9', fontSize: 11, fontWeight: 'bold' },
  bannerSub: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  card: { backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', marginBottom: 14 },
  activeCard: { borderColor: '#0ea5e9' },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#0ea5e915', alignItems: 'center', justifyContent: 'center' },
  pedhiName: { color: '#f8fafc', fontSize: 16, fontWeight: 'bold' },
  pedhiType: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#0ea5e9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  activeText: { color: '#0f172a', fontSize: 10, fontWeight: 'bold' },
  iconBtn: { padding: 6, backgroundColor: '#1e293b', borderRadius: 8 },
  focusBox: { backgroundColor: '#020617', borderRadius: 10, padding: 10, marginVertical: 10, borderWidth: 1, borderColor: '#1e293b' },
  focusLabel: { color: '#64748b', fontSize: 9, fontWeight: 'bold' },
  focusText: { color: '#cbd5e1', fontSize: 11, marginTop: 2, lineHeight: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 3 },
  infoText: { color: '#94a3b8', fontSize: 11, flex: 1 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#1e293b' },
  ordersText: { color: '#34d399', fontSize: 11, fontWeight: 'bold' },
  switchBtn: { backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  switchBtnActive: { backgroundColor: '#0ea5e920', borderWidth: 1, borderColor: '#0ea5e9' },
  switchText: { color: '#cbd5e1', fontSize: 11, fontWeight: '600' },
  switchTextActive: { color: '#0ea5e9', fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#0ea5e9', alignItems: 'center', justifyContent: 'center', elevation: 5, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  modalBg: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0f172a', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%', borderWidth: 1, borderColor: '#1e293b' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  modalTitle: { color: '#f8fafc', fontSize: 16, fontWeight: 'bold' },
  input: { backgroundColor: '#020617', borderWidth: 1, borderColor: '#1e293b', borderRadius: 10, padding: 12, color: '#f8fafc', marginBottom: 12 },
  saveBtn: { backgroundColor: '#0ea5e9', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 14 }
});
