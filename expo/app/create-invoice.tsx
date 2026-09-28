import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Share, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { FileText, CheckCircle2, Share2, Printer, PlusCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NativeCreateInvoiceScreen() {
  const router = useRouter();

  const [customer, setCustomer] = useState('Shree Somnath Trust');
  const [itemName, setItemName] = useState('Lakha Red Stone Temple Donor Takti');
  const [qty, setQty] = useState('1');
  const [rate, setRate] = useState('5400');
  const [gstPercent, setGstPercent] = useState('18');

  const q = parseFloat(qty) || 1;
  const r = parseFloat(rate) || 0;
  const gst = parseFloat(gstPercent) || 0;

  const subtotal = Math.round(q * r);
  const gstAmt = Math.round((subtotal * gst) / 100);
  const total = subtotal + gstAmt;

  const saveInvoice = async () => {
    try {
      const newInvoice = {
        id: `INV-${Date.now()}`,
        customer,
        itemName,
        qty: q,
        rate: r,
        subtotal,
        gstAmt,
        total,
        date: new Date().toISOString(),
      };
      
      const existing = await AsyncStorage.getItem('invoices');
      const invoices = existing ? JSON.parse(existing) : [];
      invoices.push(newInvoice);
      
      await AsyncStorage.setItem('invoices', JSON.stringify(invoices));
      Alert.alert("Success", `Invoice ${newInvoice.id} saved successfully!`, [
        { text: "OK", onPress: () => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.push('/(tabs)/invoices');
          }
        }}
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save invoice.");
    }
  };

  const handleShare = async () => {
    try {
      const message = `*TAX INVOICE*\n\nCustomer: ${customer}\nItem: ${itemName}\nQty: ${q}\nRate: ₹${r}\n\nSubtotal: ₹${subtotal}\nGST (${gstPercent}%): ₹${gstAmt}\n*GRAND TOTAL: ₹${total.toLocaleString()}*\n\nThank you for your business!`;
      await Share.share({
        message,
        title: 'Share Invoice'
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handlePrint = () => {
    Alert.alert("Printing...", "Connecting to local printer network to print the invoice...");
  };

  const handleCreate = () => {
    saveInvoice();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionHeader}>NEW GST TAX INVOICE</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Customer Name</Text>
        <TextInput
          style={styles.input}
          value={customer}
          onChangeText={setCustomer}
          placeholder="Customer or Organization"
          placeholderTextColor="#64748b"
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Item Description</Text>
        <TextInput
          style={styles.input}
          value={itemName}
          onChangeText={setItemName}
          placeholder="e.g. Lakha Red Stone Takti"
          placeholderTextColor="#64748b"
        />

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              value={qty}
              onChangeText={setQty}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Rate (₹)</Text>
            <TextInput
              style={styles.input}
              value={rate}
              onChangeText={setRate}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>GST %</Text>
            <TextInput
              style={styles.input}
              value={gstPercent}
              onChangeText={setGstPercent}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <View style={styles.calcCard}>
        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Taxable Subtotal:</Text>
          <Text style={styles.calcVal}>₹ {subtotal.toLocaleString()}</Text>
        </View>
        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>GST ({gstPercent}%):</Text>
          <Text style={styles.calcVal}>₹ {gstAmt.toLocaleString()}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.calcRow}>
          <Text style={[styles.calcLabel, { color: '#0ea5e9', fontWeight: 'bold' }]}>
            GRAND TOTAL:
          </Text>
          <Text style={[styles.calcVal, { color: '#0ea5e9', fontSize: 18 }]}>
            ₹ {total.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionGrid}>
        <TouchableOpacity onPress={handleShare} style={[styles.actionBtn, { backgroundColor: '#3b82f620', borderColor: '#3b82f650' }]}>
          <Share2 color="#60a5fa" size={20} />
          <Text style={[styles.actionText, { color: '#60a5fa' }]}>Share text</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePrint} style={[styles.actionBtn, { backgroundColor: '#8b5cf620', borderColor: '#8b5cf650' }]}>
          <Printer color="#a78bfa" size={20} />
          <Text style={[styles.actionText, { color: '#a78bfa' }]}>Print PDF</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleCreate} style={styles.btn}>
        <CheckCircle2 color="#0f172a" size={18} />
        <Text style={styles.btnText}>Save & Generate Invoice</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16 },
  sectionHeader: { color: '#60a5fa', fontSize: 11, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b' },
  label: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold', marginBottom: 6 },
  input: { backgroundColor: '#020617', borderWidth: 1, borderColor: '#1e293b', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#f8fafc', fontSize: 13 },
  calcCard: { backgroundColor: '#0f172a', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1e293b', marginTop: 14 },
  calcRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  calcLabel: { color: '#94a3b8', fontSize: 13 },
  calcVal: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#1e293b', marginVertical: 10 },
  actionGrid: { flexDirection: 'row', gap: 12, marginTop: 14 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
  actionText: { fontSize: 13, fontWeight: 'bold' },
  btn: { backgroundColor: '#0ea5e9', borderRadius: 12, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14 },
  btnText: { color: '#0f172a', fontSize: 15, fontWeight: 'bold' },
});
