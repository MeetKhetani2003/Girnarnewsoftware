import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Package, Layers, Home, Sparkles, Plus, Trash2, Edit2, X } from 'lucide-react-native';

const INITIAL_INVENTORY = [
  {
    id: '1',
    name: 'Lakha Red Stone Temple Donor Takti',
    type: 'takti',
    unit: 'SqFt',
    stock: 450,
    rate: 420,
    pedhi: 'Bhagvatikalamandir',
    specs: '24"x18", 25mm thickness, deep V-carve',
  },
  {
    id: '2',
    name: 'Jet Black Granite Dedication Takti',
    type: 'takti',
    unit: 'SqFt',
    stock: 620,
    rate: 460,
    pedhi: 'Bhagvatikalamandir',
    specs: 'Mirror Polish, Gold Leaf Inscription',
  },
  {
    id: '3',
    name: 'Pure Sevan Wooden Mandir (Pooja Ghar)',
    type: 'mandir',
    unit: 'Pcs',
    stock: 8,
    rate: 78000,
    pedhi: 'ArvindRamjibhai',
    specs: '48"W x 24"D x 66"H, 3 Shikhara with Kalash',
  },
  {
    id: '4',
    name: 'Makrana Marble Radha Krishna Murty',
    type: 'murti',
    unit: 'Pcs',
    stock: 4,
    rate: 75000,
    pedhi: 'Jaipurshilpkala',
    specs: '24 Inch, Grade A Makrana, 24K Gold Foil',
  },
];

export default function NativeInventoryScreen() {
  const [items, setItems] = useState(INITIAL_INVENTORY);
  const [selectedType, setSelectedType] = useState('ALL');

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', type: 'takti', unit: 'SqFt', stock: '', rate: '', pedhi: 'Bhagvatikalamandir', specs: ''
  });

  const filtered = selectedType === 'ALL' ? items : items.filter((i) => i.type === selectedType);

  const handleDelete = (id: string) => {
    Alert.alert("Delete Item", "Are you sure you want to remove this item from inventory?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => setItems(items.filter(i => i.id !== id)) }
    ]);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', type: 'takti', unit: 'SqFt', stock: '', rate: '', pedhi: 'Bhagvatikalamandir', specs: '' });
    setModalVisible(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      type: item.type,
      unit: item.unit,
      stock: item.stock.toString(),
      rate: item.rate.toString(),
      pedhi: item.pedhi,
      specs: item.specs,
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      Alert.alert("Error", "Product Name is required");
      return;
    }
    const newItem = {
      id: editingId || Date.now().toString(),
      ...formData,
      stock: parseInt(formData.stock) || 0,
      rate: parseFloat(formData.rate) || 0,
    };
    if (editingId) {
      setItems(items.map(i => i.id === editingId ? newItem : i));
    } else {
      setItems([newItem, ...items]);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Category Pills */}
        <View style={styles.pillRow}>
          {['ALL', 'takti', 'mandir', 'murti'].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setSelectedType(t)}
              style={[styles.pill, selectedType === t && styles.pillActive]}
            >
              <Text style={[styles.pillText, selectedType === t && styles.pillTextActive]}>
                {t === 'ALL' ? 'All Items' : t === 'takti' ? 'Taktis' : t === 'mandir' ? 'Mandirs' : 'Murtis'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Items */}
        {filtered.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.itemType}>
                {item.type === 'takti' ? 'TAKTI (SQUARE FEET)' : item.type.toUpperCase()}
              </Text>
              <Text style={styles.pedhiTag}>{item.pedhi}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.specs}>{item.specs}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginLeft: 10 }}>
                <TouchableOpacity onPress={() => openEditModal(item)} style={styles.iconBtn}>
                  <Edit2 color="#0ea5e9" size={14} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconBtn}>
                  <Trash2 color="#f87171" size={14} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.statGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Available Stock</Text>
                <Text style={[styles.statVal, { color: '#34d399' }]}>
                  {item.stock} {item.unit}
                </Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Selling Rate</Text>
                <Text style={[styles.statVal, { color: '#0ea5e9' }]}>
                  ₹ {item.rate.toLocaleString()} / {item.unit}
                </Text>
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
              <Text style={styles.modalTitle}>{editingId ? 'Edit Product' : 'Add New Product'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#94a3b8" size={20} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={{ marginTop: 10 }}>
              <TextInput style={styles.input} placeholder="Product / Item Name" placeholderTextColor="#64748b" value={formData.name} onChangeText={t => setFormData({...formData, name: t})} />
              <TextInput style={styles.input} placeholder="Specifications / Details" placeholderTextColor="#64748b" value={formData.specs} onChangeText={t => setFormData({...formData, specs: t})} />
              
              <Text style={styles.label}>Product Category</Text>
              <View style={styles.typeRow}>
                {['takti', 'mandir', 'murti'].map(t => (
                  <TouchableOpacity key={t} style={[styles.typeBtn, formData.type === t && styles.typeBtnActive]} onPress={() => setFormData({...formData, type: t, unit: t === 'takti' ? 'SqFt' : 'Pcs'})}>
                    <Text style={[styles.typeBtnText, formData.type === t && {color: '#0ea5e9'}]}>{t.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Stock Quantity</Text>
                  <TextInput style={styles.input} placeholder="0" placeholderTextColor="#64748b" keyboardType="numeric" value={formData.stock} onChangeText={t => setFormData({...formData, stock: t})} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Rate (₹)</Text>
                  <TextInput style={styles.input} placeholder="0.00" placeholderTextColor="#64748b" keyboardType="numeric" value={formData.rate} onChangeText={t => setFormData({...formData, rate: t})} />
                </View>
              </View>

              <Text style={styles.label}>Associated Pedhi</Text>
              <View style={styles.typeRow}>
                {['Girnarshilp', 'ArvindRamjibhai', 'Bhagvatikalamandir', 'Jaipurshilpkala'].map(t => (
                  <TouchableOpacity key={t} style={[styles.typeBtn, formData.pedhi === t && styles.typeBtnActive]} onPress={() => setFormData({...formData, pedhi: t})}>
                    <Text style={[styles.typeBtnText, formData.pedhi === t && {color: '#0ea5e9'}]}>{t.slice(0, 7)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Product</Text>
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
  pillRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  pill: { backgroundColor: '#0f172a', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#1e293b' },
  pillActive: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
  pillText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  pillTextActive: { color: '#0f172a' },
  card: { backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', marginBottom: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  itemType: { color: '#0ea5e9', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  pedhiTag: { color: '#64748b', fontSize: 10, fontWeight: 'bold' },
  itemName: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  specs: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  statGrid: { flexDirection: 'row', gap: 12, marginTop: 12 },
  statBox: { flex: 1, backgroundColor: '#020617', padding: 10, borderRadius: 10 },
  statLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold' },
  statVal: { fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  iconBtn: { padding: 4, backgroundColor: '#1e293b', borderRadius: 6 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#0ea5e9', alignItems: 'center', justifyContent: 'center', elevation: 5, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
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
  saveBtn: { backgroundColor: '#0ea5e9', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 14 }
});
