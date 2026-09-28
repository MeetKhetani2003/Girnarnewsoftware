import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { FileText, Plus, CheckCircle, Clock, Share2, Download, Printer } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAMPLE_INVOICES = [
  {
    id: 'INV-2026-001',
    customer: 'Somnath Trust & Mandir Samiti',
    date: '28/09/2026',
    items: 'Lakha Red Stone Temple Donor Takti (36"x24")',
    taxable: 4576,
    gst: 824,
    total: 5400,
    paid: 3000,
    due: 2400,
    status: 'PARTIALLY_PAID',
    pedhi: 'Bhagvatikalamandir',
  },
  {
    id: 'INV-2026-002',
    customer: 'Shri Swaminarayan Gurukul Rajkot',
    date: '27/09/2026',
    items: 'Pure Sevan Wooden Mandir (Pooja Ghar)',
    taxable: 74576,
    gst: 13424,
    total: 88000,
    paid: 88000,
    due: 0,
    status: 'PAID',
    pedhi: 'ArvindRamjibhai',
  },
  {
    id: 'INV-2026-003',
    customer: 'Rajkot Heritage Derasar Pedhi',
    date: '26/09/2026',
    items: 'Makrana Marble Radha Krishna Murty (24")',
    taxable: 66102,
    gst: 11898,
    total: 78000,
    paid: 0,
    due: 78000,
    status: 'UNPAID',
    pedhi: 'Jaipurshilpkala',
  },
];

export default function NativeInvoicesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('ALL');
  const [invoices, setInvoices] = useState<any[]>(SAMPLE_INVOICES);

  const loadInvoices = async () => {
    try {
      const stored = await AsyncStorage.getItem('invoices');
      if (stored) {
        const parsed = JSON.parse(stored);
        const formatted = parsed.map((p: any) => ({
          id: p.id,
          customer: p.customer,
          date: p.date ? p.date.split('T')[0] : 'Unknown',
          items: p.itemName,
          taxable: p.subtotal,
          gst: p.gstAmt,
          total: p.total,
          paid: 0,
          due: p.total,
          status: 'UNPAID',
          pedhi: 'Girnarshilp'
        }));
        // Show newly created ones at the top
        setInvoices([...formatted.reverse(), ...SAMPLE_INVOICES]);
      }
    } catch (e) {
      console.log('Failed to load invoices', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadInvoices();
    }, [])
  );

  const handlePreview = async (inv: any) => {
    try {
      const html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
              .header { text-align: center; border-bottom: 2px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 20px; }
              h1 { color: #0ea5e9; margin: 0; font-size: 28px; }
              .info { display: flex; justify-content: space-between; margin-bottom: 30px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #f8fafc; color: #0ea5e9; }
              .totals { width: 50%; float: right; }
              .totals table { width: 100%; border: none; }
              .totals td { border: none; padding: 8px; text-align: right; }
              .grand-total { font-size: 20px; font-weight: bold; color: #0ea5e9; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${inv.pedhi.toUpperCase()}</h1>
              <p>GST TAX INVOICE</p>
            </div>
            <div class="info">
              <div><p><b>Billed To:</b><br/>${inv.customer}</p></div>
              <div style="text-align: right;"><p><b>Invoice No:</b> ${inv.id}<br/><b>Date:</b> ${inv.date}</p></div>
            </div>
            <table>
              <tr><th>Description</th><th>Amount</th></tr>
              <tr><td>${inv.items}</td><td>₹${inv.taxable.toLocaleString()}</td></tr>
            </table>
            <div class="totals">
              <table>
                <tr><td>Taxable Subtotal:</td><td>₹${inv.taxable.toLocaleString()}</td></tr>
                <tr><td>GST:</td><td>₹${inv.gst.toLocaleString()}</td></tr>
                <tr><td class="grand-total">GRAND TOTAL:</td><td class="grand-total">₹${inv.total.toLocaleString()}</td></tr>
              </table>
            </div>
          </body>
        </html>
      `;
      await Print.printAsync({ html });
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Action Banner */}
      <View style={styles.banner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>TAX INVOICES & GST BILLING</Text>
          <Text style={styles.bannerSub}>Generate GST compliant bills with automatic HSN and ledger sync.</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/create-invoice')}
          style={styles.newBtn}
        >
          <Plus color="#0f172a" size={16} />
          <Text style={styles.newBtnText}>+ Bill</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {['ALL', 'PAID', 'PARTIAL', 'UNPAID'].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Invoices List */}
      {invoices.filter((inv) => {
        if (filter === 'ALL') return true;
        if (filter === 'PARTIAL') return inv.status === 'PARTIALLY_PAID';
        return inv.status === filter;
      }).map((inv) => (
        <TouchableOpacity key={inv.id} style={styles.invCard} onPress={() => handlePreview(inv)}>
          <View style={styles.invTop}>
            <View>
              <Text style={styles.invNumber}>{inv.id}</Text>
              <Text style={styles.invDate}>{inv.date} • {inv.pedhi}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                inv.status === 'PAID'
                  ? styles.paidBadge
                  : inv.status === 'PARTIALLY_PAID'
                  ? styles.partialBadge
                  : styles.unpaidBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  inv.status === 'PAID'
                    ? styles.paidText
                    : inv.status === 'PARTIALLY_PAID'
                    ? styles.partialText
                    : styles.unpaidText,
                ]}
              >
                {inv.status}
              </Text>
            </View>
          </View>

          <Text style={styles.custName}>{inv.customer}</Text>
          <Text style={styles.itemsDesc}>{inv.items}</Text>

          <View style={styles.amtRow}>
            <View>
              <Text style={styles.amtLabel}>Total Amount</Text>
              <Text style={styles.totalAmt}>₹ {inv.total.toLocaleString()}</Text>
            </View>
            <View>
              <Text style={styles.amtLabel}>Paid</Text>
              <Text style={styles.paidAmt}>₹ {inv.paid.toLocaleString()}</Text>
            </View>
            <View>
              <Text style={styles.amtLabel}>Balance Due</Text>
              <Text style={[styles.dueAmt, inv.due > 0 && { color: '#f87171' }]}>
                ₹ {inv.due.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Quick Action Footer */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => handlePreview(inv)}
            >
              <Printer color="#94a3b8" size={14} />
              <Text style={styles.actionBtnText}>Print / PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={async () => {
                try {
                  const message = `*TAX INVOICE*\n\nInvoice No: ${inv.id}\nDate: ${inv.date}\nCustomer: ${inv.customer}\n\nItem: ${inv.items}\nSubtotal: ₹${inv.taxable}\nGST: ₹${inv.gst}\n*TOTAL: ₹${inv.total.toLocaleString()}*\n\nThank you!`;
                  await Share.share({ message, title: 'Share Invoice' });
                } catch (err: any) {
                  Alert.alert("Error", err.message);
                }
              }}
            >
              <Share2 color="#94a3b8" size={14} />
              <Text style={styles.actionBtnText}>WhatsApp</Text>
            </TouchableOpacity>

            {inv.due > 0 && (
              <TouchableOpacity
                onPress={() => router.push('/payment')}
                style={[styles.actionBtn, { borderColor: '#34d39940', backgroundColor: '#34d39910' }]}
              >
                <Text style={{ color: '#34d399', fontSize: 11, fontWeight: 'bold' }}>
                  + Record Jama
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16 },
  banner: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  bannerTitle: { color: '#60a5fa', fontSize: 11, fontWeight: 'bold' },
  bannerSub: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  newBtn: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8,
  },
  newBtnText: { color: '#0f172a', fontSize: 12, fontWeight: 'bold' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  filterChipActive: { backgroundColor: '#60a5fa20', borderColor: '#60a5fa' },
  filterText: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold' },
  filterTextActive: { color: '#60a5fa' },
  invCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 12,
  },
  invTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  invNumber: { color: '#60a5fa', fontSize: 13, fontWeight: 'bold', fontFamily: 'monospace' },
  invDate: { color: '#64748b', fontSize: 11, marginTop: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  paidBadge: { backgroundColor: '#10b98120' },
  partialBadge: { backgroundColor: '#0ea5e920' },
  unpaidBadge: { backgroundColor: '#ef444420' },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  paidText: { color: '#34d399' },
  partialText: { color: '#0ea5e9' },
  unpaidText: { color: '#f87171' },
  custName: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold', marginTop: 8 },
  itemsDesc: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  amtRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#020617',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  amtLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold' },
  totalAmt: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  paidAmt: { color: '#34d399', fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  dueAmt: { color: '#94a3b8', fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 10, justifyContent: 'flex-end' },
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
