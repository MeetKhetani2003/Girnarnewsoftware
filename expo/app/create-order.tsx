import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag, TrendingUp, Layers, CheckCircle2 } from 'lucide-react-native';

export default function NativeCreateOrderScreen() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState('Shree Somnath Trust');
  const [customerMobile, setCustomerMobile] = useState('9825012345');
  const [productType, setProductType] = useState<'takti' | 'mandir' | 'murti'>('takti');

  // Takti Specific (Square Feet & Custom Supplier Price)
  const [stoneType, setStoneType] = useState('Lakha Red Stone');
  const [lengthInches, setLengthInches] = useState('36');
  const [widthInches, setWidthInches] = useState('24');
  const [customSupplierPrice, setCustomSupplierPrice] = useState('450'); // variable quarry price (e.g. 450 vs 500)
  const [labourRate, setLabourRate] = useState('80');
  const [sellingRate, setSellingRate] = useState('680');

  // Advance
  const [advanceAmount, setAdvanceAmount] = useState('2500');

  // Live Math
  const len = parseFloat(lengthInches) || 1;
  const wid = parseFloat(widthInches) || 1;
  const sqFt = parseFloat(((len * wid) / 144).toFixed(3));

  const suppPrice = parseFloat(customSupplierPrice) || 0;
  const labour = parseFloat(labourRate) || 0;
  const sell = parseFloat(sellingRate) || 0;

  const totalCostPerSqFt = suppPrice + labour;
  const totalCost = Math.round(totalCostPerSqFt * sqFt);
  const totalRevenue = Math.round(sell * sqFt);
  const netProfit = totalRevenue - totalCost;
  const marginPercent = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

  const handleBook = () => {
    // Navigate back to orders
    router.replace('/(tabs)/orders');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Product Line Selection */}
      <Text style={styles.sectionHeader}>1. SELECT PRODUCT CATEGORY</Text>
      <View style={styles.typeRow}>
        {(['takti', 'mandir', 'murti'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setProductType(t)}
            style={[styles.typeBtn, productType === t && styles.typeBtnActive]}
          >
            <Text style={[styles.typeBtnText, productType === t && styles.typeBtnTextActive]}>
              {t === 'takti' ? 'Takti (Sq.Ft)' : t === 'mandir' ? 'Mandir' : 'Murti'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Customer Info */}
      <Text style={[styles.sectionHeader, { marginTop: 14 }]}>2. CUSTOMER / TRUST DETAILS</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Customer / Temple Name</Text>
        <TextInput
          style={styles.input}
          value={customerName}
          onChangeText={setCustomerName}
          placeholder="e.g. Swaminarayan Gurukul"
          placeholderTextColor="#64748b"
        />

        <Text style={[styles.label, { marginTop: 10 }]}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          value={customerMobile}
          onChangeText={setCustomerMobile}
          keyboardType="phone-pad"
        />
      </View>

      {/* Takti Specific Sq.Ft & Variable Supplier Pricing */}
      {productType === 'takti' && (
        <>
          <Text style={[styles.sectionHeader, { marginTop: 14 }]}>
            3. TAKTI MEASUREMENTS & CUSTOM SOURCING
          </Text>
          <View style={styles.card}>
            <View style={styles.inputRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Length (Inches)</Text>
                <TextInput
                  style={styles.input}
                  value={lengthInches}
                  onChangeText={setLengthInches}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Width (Inches)</Text>
                <TextInput
                  style={styles.input}
                  value={widthInches}
                  onChangeText={setWidthInches}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.sqFtBox}>
              <Layers color="#fbbf24" size={14} />
              <Text style={styles.sqFtText}>
                Area: {sqFt} Sq. Feet ({len}" × {wid}")
              </Text>
            </View>

            {/* Custom Supplier Sourcing Price */}
            <Text style={[styles.label, { marginTop: 12 }]}>
              Custom Supplier Sourcing Price (₹ / Sq.Ft)
            </Text>
            <TextInput
              style={[styles.input, { color: '#fbbf24', fontWeight: 'bold' }]}
              value={customSupplierPrice}
              onChangeText={setCustomSupplierPrice}
              keyboardType="numeric"
              placeholder="e.g. 450 or 500"
            />
            <Text style={styles.helperText}>
              Allows custom rate per batch (e.g. ₹420 vs ₹450 vs ₹500) to ensure accurate factory profit.
            </Text>

            <Text style={[styles.label, { marginTop: 10 }]}>Carving & Foil Labour (₹ / Sq.Ft)</Text>
            <TextInput
              style={styles.input}
              value={labourRate}
              onChangeText={setLabourRate}
              keyboardType="numeric"
            />

            <Text style={[styles.label, { marginTop: 10 }]}>Customer Selling Rate (₹ / Sq.Ft)</Text>
            <TextInput
              style={styles.input}
              value={sellingRate}
              onChangeText={setSellingRate}
              keyboardType="numeric"
            />
          </View>

          {/* Live Profit Calculation Card */}
          <View style={styles.profitCard}>
            <View style={styles.profitHeader}>
              <TrendingUp color="#34d399" size={16} />
              <Text style={styles.profitTitle}>LIVE PROFIT ENGINE</Text>
              <Text style={styles.marginBadge}>{marginPercent}% Margin</Text>
            </View>

            <View style={styles.profitGrid}>
              <View>
                <Text style={styles.pLabel}>Customer Bill</Text>
                <Text style={styles.pVal}>₹ {totalRevenue.toLocaleString()}</Text>
              </View>
              <View>
                <Text style={styles.pLabel}>Factory Cost</Text>
                <Text style={styles.pVal}>₹ {totalCost.toLocaleString()}</Text>
              </View>
              <View>
                <Text style={styles.pLabel}>Net Profit</Text>
                <Text style={[styles.pVal, { color: '#34d399' }]}>
                  ₹ {netProfit.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}

      {/* Advance Payment */}
      <Text style={[styles.sectionHeader, { marginTop: 14 }]}>4. ADVANCE PAYMENT</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Advance Received (₹)</Text>
        <TextInput
          style={[styles.input, { color: '#34d399', fontWeight: 'bold' }]}
          value={advanceAmount}
          onChangeText={setAdvanceAmount}
          keyboardType="numeric"
        />
      </View>

      {/* Book Button */}
      <TouchableOpacity onPress={handleBook} style={styles.bookBtn}>
        <CheckCircle2 color="#0f172a" size={18} />
        <Text style={styles.bookBtnText}>Confirm & Book Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16, paddingBottom: 40 },
  sectionHeader: { color: '#fbbf24', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5, marginBottom: 8 },
  typeRow: { flexDirection: 'row', gap: 8 },
  typeBtn: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  typeBtnActive: { backgroundColor: '#fbbf24', borderColor: '#fbbf24' },
  typeBtnText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  typeBtnTextActive: { color: '#0f172a' },
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
  inputRow: { flexDirection: 'row', gap: 10 },
  sqFtBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fbbf2415',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  sqFtText: { color: '#fbbf24', fontSize: 12, fontWeight: 'bold' },
  helperText: { color: '#64748b', fontSize: 10, marginTop: 4 },
  profitCard: {
    backgroundColor: '#10b98115',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#10b98140',
    marginTop: 12,
  },
  profitHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profitTitle: { color: '#34d399', fontSize: 11, fontWeight: 'bold' },
  marginBadge: {
    backgroundColor: '#10b98130',
    color: '#34d399',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  profitGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  pLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold' },
  pVal: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  bookBtn: {
    backgroundColor: '#fbbf24',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  bookBtnText: { color: '#0f172a', fontSize: 14, fontWeight: 'bold' },
});
