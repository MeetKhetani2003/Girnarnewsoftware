import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FileText, CheckCircle2 } from 'lucide-react-native';

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

  const handleCreate = () => {
    router.replace('/(tabs)/invoices');
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
        />

        <Text style={[styles.label, { marginTop: 10 }]}>Item Description</Text>
        <TextInput
          style={styles.input}
          value={itemName}
          onChangeText={setItemName}
          placeholder="e.g. Lakha Red Stone Takti"
        />

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
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
          <Text style={[styles.calcLabel, { color: '#fbbf24', fontWeight: 'bold' }]}>
            GRAND TOTAL:
          </Text>
          <Text style={[styles.calcVal, { color: '#fbbf24', fontSize: 16 }]}>
            ₹ {total.toLocaleString()}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleCreate} style={styles.btn}>
        <CheckCircle2 color="#0f172a" size={18} />
        <Text style={styles.btnText}>Generate Tax Invoice</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16 },
  sectionHeader: { color: '#60a5fa', fontSize: 11, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b' },
  label: { color: '#94a3b8', fontSize: 11, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#f8fafc',
    fontSize: 13,
  },
  calcCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginTop: 14,
  },
  calcRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  calcLabel: { color: '#94a3b8', fontSize: 12 },
  calcVal: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#1e293b', marginVertical: 8 },
  btn: {
    backgroundColor: '#fbbf24',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  btnText: { color: '#0f172a', fontSize: 14, fontWeight: 'bold' },
});
