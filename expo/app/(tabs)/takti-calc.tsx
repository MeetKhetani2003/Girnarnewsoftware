import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Calculator, TrendingUp, CheckCircle, Truck, Layers } from 'lucide-react-native';

const STONES = ['Lakha Red Stone', 'Makrana White Marble', 'Jet Black Granite'];

export default function NativeTaktiCalcScreen() {
  const [stone, setStone] = useState(STONES[0]);
  const [lengthInches, setLengthInches] = useState('36');
  const [widthInches, setWidthInches] = useState('24');
  const [supplierPrice, setSupplierPrice] = useState('450'); // e.g. ₹450 vs ₹500
  const [labourCost, setLabourCost] = useState('80'); // carving & gold leaf
  const [sellingRate, setSellingRate] = useState('650'); // to customer

  const len = parseFloat(lengthInches) || 0;
  const wid = parseFloat(widthInches) || 0;
  const sqFt = parseFloat(((len * wid) / 144).toFixed(3));

  const suppPrice = parseFloat(supplierPrice) || 0;
  const labour = parseFloat(labourCost) || 0;
  const sellRate = parseFloat(sellingRate) || 0;

  const totalCostPerSqFt = suppPrice + labour;
  const totalCost = Math.round(totalCostPerSqFt * sqFt);
  const totalRevenue = Math.round(sellRate * sqFt);
  const profitPerSqFt = sellRate - totalCostPerSqFt;
  const totalProfit = totalRevenue - totalCost;
  const margin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>TAKTI SQ. FT & CUSTOM SUPPLIER COSTING</Text>
        <Text style={styles.infoDesc}>
          Factory doesn't always know which supplier slab was used. Enter the custom supplier price
          (e.g., ₹450 vs ₹500) to get live net profit & margin instantly.
        </Text>
      </View>

      {/* Stone Selector */}
      <Text style={styles.label}>Select Stone Type</Text>
      <View style={styles.row}>
        {STONES.map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setStone(s)}
            style={[styles.stoneBtn, stone === s && styles.stoneBtnActive]}
          >
            <Text style={[styles.stoneBtnText, stone === s && styles.stoneBtnTextActive]}>{s.split(' ')[0]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dimensions */}
      <View style={styles.inputGrid}>
        <View style={styles.inputCol}>
          <Text style={styles.label}>Length (Inches)</Text>
          <TextInput
            style={styles.input}
            value={lengthInches}
            onChangeText={setLengthInches}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputCol}>
          <Text style={styles.label}>Width (Inches)</Text>
          <TextInput
            style={styles.input}
            value={widthInches}
            onChangeText={setWidthInches}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Calculated Sq.Ft Badge */}
      <View style={styles.badge}>
        <Layers color="#0ea5e9" size={16} />
        <Text style={styles.badgeText}>
          Total Slab Area = {sqFt} Sq. Feet ({len}" × {wid}")
        </Text>
      </View>

      {/* Cost Inputs */}
      <View style={styles.sectionCard}>
        <Text style={styles.label}>Custom Supplier Rate (₹ / Sq.Ft)</Text>
        <TextInput
          style={styles.input}
          value={supplierPrice}
          onChangeText={setSupplierPrice}
          keyboardType="numeric"
          placeholder="e.g. 450 or 500"
          placeholderTextColor="#64748b"
        />

        {/* Quick Supplier Buttons */}
        <View style={styles.quickRow}>
          <TouchableOpacity onPress={() => setSupplierPrice('420')} style={styles.quickBtn}>
            <Text style={styles.quickBtnText}>₹420 (Direct)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSupplierPrice('450')} style={styles.quickBtn}>
            <Text style={styles.quickBtnText}>₹450 (Yard A)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSupplierPrice('500')} style={styles.quickBtn}>
            <Text style={styles.quickBtnText}>₹500 (Yard B)</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { marginTop: 12 }]}>Carving & 24K Gold Inscription (₹ / Sq.Ft)</Text>
        <TextInput
          style={styles.input}
          value={labourCost}
          onChangeText={setLabourCost}
          keyboardType="numeric"
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Customer Selling Rate (₹ / Sq.Ft)</Text>
        <TextInput
          style={styles.input}
          value={sellingRate}
          onChangeText={setSellingRate}
          keyboardType="numeric"
        />
      </View>

      {/* Live Profit Results */}
      <View style={[styles.resultCard, totalProfit >= 0 ? styles.profitBorder : styles.lossBorder]}>
        <View style={styles.resultHeader}>
          <TrendingUp color={totalProfit >= 0 ? '#34d399' : '#f87171'} size={20} />
          <Text style={styles.resultTitle}>LIVE PROFIT CALCULATION</Text>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Total Customer Billing:</Text>
          <Text style={styles.resultVal}>₹ {totalRevenue.toLocaleString()}</Text>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Total Factory Cost:</Text>
          <Text style={styles.resultVal}>₹ {totalCost.toLocaleString()}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.resultRow}>
          <Text style={styles.resultHighlight}>NET PROFIT:</Text>
          <Text style={[styles.profitVal, { color: totalProfit >= 0 ? '#34d399' : '#f87171' }]}>
            ₹ {totalProfit.toLocaleString()} ({margin}%)
          </Text>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Net Profit per Sq.Ft:</Text>
          <Text style={[styles.resultVal, { color: '#0ea5e9' }]}>
            ₹ {profitPerSqFt} / sq.ft
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16 },
  infoBox: { backgroundColor: '#0f172a', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#1e293b', marginBottom: 16 },
  infoTitle: { color: '#0ea5e9', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  infoDesc: { color: '#94a3b8', fontSize: 12, marginTop: 4, lineHeight: 18 },
  label: { color: '#94a3b8', fontSize: 12, fontWeight: '600', marginBottom: 6 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  stoneBtn: { flex: 1, backgroundColor: '#0f172a', paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#1e293b', alignItems: 'center' },
  stoneBtnActive: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
  stoneBtnText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  stoneBtnTextActive: { color: '#0f172a' },
  inputGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  inputCol: { flex: 1 },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    color: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0ea5e915',
    borderWidth: 1,
    borderColor: '#0ea5e940',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  badgeText: { color: '#0ea5e9', fontSize: 13, fontWeight: 'bold' },
  sectionCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 16,
  },
  quickRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  quickBtn: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  quickBtnText: { color: '#0ea5e9', fontSize: 11, fontWeight: '600' },
  resultCard: { backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1.5 },
  profitBorder: { borderColor: '#10b981' },
  lossBorder: { borderColor: '#ef4444' },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  resultTitle: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold' },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  resultLabel: { color: '#94a3b8', fontSize: 13 },
  resultVal: { color: '#f8fafc', fontSize: 13, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#1e293b', marginVertical: 8 },
  resultHighlight: { color: '#f8fafc', fontSize: 15, fontWeight: 'bold' },
  profitVal: { fontSize: 16, fontWeight: 'bold' },
});
