import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react-native';

export default function NativePaymentScreen() {
  const router = useRouter();

  const [type, setType] = useState<'PAYMENT_IN' | 'PAYMENT_OUT'>('PAYMENT_IN');
  const [partyName, setPartyName] = useState('Shree Somnath Trust');
  const [amount, setAmount] = useState('15000');
  const [paymentMode, setPaymentMode] = useState('UPI / Bank');
  const [notes, setNotes] = useState('Mandir Takti settlement payment');

  const handleSave = () => {
    router.replace('/(tabs)/orders');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Type Toggle */}
      <View style={styles.typeRow}>
        <TouchableOpacity
          onPress={() => setType('PAYMENT_IN')}
          style={[styles.typeBtn, type === 'PAYMENT_IN' && styles.jamaActive]}
        >
          <ArrowDownLeft color={type === 'PAYMENT_IN' ? '#0f172a' : '#34d399'} size={18} />
          <Text style={[styles.typeText, type === 'PAYMENT_IN' && styles.typeTextDark]}>
            Jama (Received)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setType('PAYMENT_OUT')}
          style={[styles.typeBtn, type === 'PAYMENT_OUT' && styles.naameActive]}
        >
          <ArrowUpRight color={type === 'PAYMENT_OUT' ? '#0f172a' : '#f87171'} size={18} />
          <Text style={[styles.typeText, type === 'PAYMENT_OUT' && styles.typeTextDark]}>
            Naame (Paid Out)
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Party / Account</Text>
        <TextInput
          style={styles.input}
          value={partyName}
          onChangeText={setPartyName}
          placeholder="Customer or Vendor"
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Amount (₹)</Text>
        <TextInput
          style={[
            styles.input,
            { fontSize: 18, fontWeight: 'bold' },
            type === 'PAYMENT_IN' ? { color: '#34d399' } : { color: '#f87171' },
          ]}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Payment Mode</Text>
        <View style={styles.modeRow}>
          {['Cash', 'UPI / Bank', 'Cheque', 'RTGS'].map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setPaymentMode(m)}
              style={[styles.modeBtn, paymentMode === m && styles.modeBtnActive]}
            >
              <Text style={[styles.modeText, paymentMode === m && styles.modeTextActive]}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { marginTop: 12 }]}>Reference / Note</Text>
        <TextInput
          style={styles.input}
          value={notes}
          onChangeText={setNotes}
          placeholder="Bill reference or purpose"
        />
      </View>

      <TouchableOpacity
        onPress={handleSave}
        style={[styles.saveBtn, type === 'PAYMENT_IN' ? styles.jamaBg : styles.naameBg]}
      >
        <CheckCircle2 color="#0f172a" size={18} />
        <Text style={styles.saveBtnText}>
          Record {type === 'PAYMENT_IN' ? 'Jama' : 'Naame'} Entry
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16 },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  jamaActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  naameActive: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  typeText: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold' },
  typeTextDark: { color: '#0f172a' },
  card: { backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b' },
  label: { color: '#94a3b8', fontSize: 11, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 14,
  },
  modeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  modeBtn: { backgroundColor: '#020617', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  modeBtnActive: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
  modeText: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold' },
  modeTextActive: { color: '#0f172a' },
  saveBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  jamaBg: { backgroundColor: '#34d399' },
  naameBg: { backgroundColor: '#f87171' },
  saveBtnText: { color: '#0f172a', fontSize: 14, fontWeight: 'bold' },
});
