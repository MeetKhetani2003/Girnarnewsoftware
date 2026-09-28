import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag, TrendingUp, Layers, CheckCircle2, Share2, Printer } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NativeCreateOrderScreen() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState('Shree Somnath Trust');
  const [customerMobile, setCustomerMobile] = useState('9825012345');
  const [productType, setProductType] = useState<'takti' | 'mandir' | 'murti'>('takti');

  // Takti Specific (Square Feet & Custom Supplier Price)
  const [stoneType, setStoneType] = useState('Lakha Red Stone');
  const [lengthInches, setLengthInches] = useState('36');
  const [widthInches, setWidthInches] = useState('24');
  const [customSupplierPrice, setCustomSupplierPrice] = useState('450');
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

  const saveOrder = async () => {
    try {
      const newOrder = {
        id: `ORD-${Date.now()}`,
        customerName,
        customerMobile,
        productType,
        advanceAmount: parseFloat(advanceAmount) || 0,
        totalRevenue: productType === 'takti' ? totalRevenue : 0,
        netProfit: productType === 'takti' ? netProfit : 0,
        date: new Date().toISOString(),
      };
      
      const existing = await AsyncStorage.getItem('orders');
      const orders = existing ? JSON.parse(existing) : [];
      orders.push(newOrder);
      
      await AsyncStorage.setItem('orders', JSON.stringify(orders));
      Alert.alert("Success", `Order ${newOrder.id} saved successfully!`, [
        { text: "OK", onPress: () => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.push('/(tabs)/orders');
          }
        }}
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save order.");
    }
  };

  const handleShare = async () => {
    try {
      const message = `*NEW ORDER CONFIRMATION*\n\nCustomer: ${customerName}\nMobile: ${customerMobile}\nProduct: ${productType.toUpperCase()}\n\n${productType === 'takti' ? `Area: ${sqFt} SqFt\nTotal Cost: ₹${totalRevenue.toLocaleString()}\n` : ''}Advance Paid: ₹${advanceAmount}\n\nThank you for choosing Girnarshilp!`;
      await Share.share({
        message,
        title: 'Share Order'
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handlePrint = () => {
    Alert.alert("Printing...", "Connecting to local printer network to print the order receipt...");
  };

  const handleBook = () => {
    saveOrder();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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

      <Text style={[styles.sectionHeader, { marginTop: 14 }]}>2. CUSTOMER / TRUST DETAILS</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Customer / Temple Name</Text>
        <TextInput style={styles.input} value={customerName} onChangeText={setCustomerName} placeholder="e.g. Swaminarayan Gurukul" placeholderTextColor="#64748b" />

        <Text style={[styles.label, { marginTop: 10 }]}>Mobile Number</Text>
        <TextInput style={styles.input} value={customerMobile} onChangeText={setCustomerMobile} keyboardType="phone-pad" />
      </View>

      {productType === 'takti' && (
        <>
          <Text style={[styles.sectionHeader, { marginTop: 14 }]}>3. TAKTI MEASUREMENTS & CUSTOM SOURCING</Text>
          <View style={styles.card}>
            <View style={styles.inputRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Length (Inches)</Text>
                <TextInput style={styles.input} value={lengthInches} onChangeText={setLengthInches} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Width (Inches)</Text>
                <TextInput style={styles.input} value={widthInches} onChangeText={setWidthInches} keyboardType="numeric" />
              </View>
            </View>

            <View style={styles.sqFtBox}>
              <Layers color="#0ea5e9" size={14} />
              <Text style={styles.sqFtText}>Area: {sqFt} Sq. Feet ({len}" × {wid}")</Text>
            </View>

            <Text style={[styles.label, { marginTop: 12 }]}>Custom Supplier Sourcing Price (₹ / Sq.Ft)</Text>
            <TextInput style={[styles.input, { color: '#0ea5e9', fontWeight: 'bold' }]} value={customSupplierPrice} onChangeText={setCustomSupplierPrice} keyboardType="numeric" />
            
            <Text style={[styles.label, { marginTop: 10 }]}>Carving & Foil Labour (₹ / Sq.Ft)</Text>
            <TextInput style={styles.input} value={labourRate} onChangeText={setLabourRate} keyboardType="numeric" />

            <Text style={[styles.label, { marginTop: 10 }]}>Customer Selling Rate (₹ / Sq.Ft)</Text>
            <TextInput style={styles.input} value={sellingRate} onChangeText={setSellingRate} keyboardType="numeric" />
          </View>

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
                <Text style={[styles.pVal, { color: '#34d399' }]}>₹ {netProfit.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </>
      )}

      <Text style={[styles.sectionHeader, { marginTop: 14 }]}>4. ADVANCE PAYMENT</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Advance Received (₹)</Text>
        <TextInput style={[styles.input, { color: '#34d399', fontWeight: 'bold' }]} value={advanceAmount} onChangeText={setAdvanceAmount} keyboardType="numeric" />
      </View>

      <View style={styles.actionGrid}>
        <TouchableOpacity onPress={handleShare} style={[styles.actionBtn, { backgroundColor: '#3b82f620', borderColor: '#3b82f650' }]}>
          <Share2 color="#60a5fa" size={20} />
          <Text style={[styles.actionText, { color: '#60a5fa' }]}>Share Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePrint} style={[styles.actionBtn, { backgroundColor: '#8b5cf620', borderColor: '#8b5cf650' }]}>
          <Printer color="#a78bfa" size={20} />
          <Text style={[styles.actionText, { color: '#a78bfa' }]}>Print</Text>
        </TouchableOpacity>
      </View>

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
  sectionHeader: { color: '#0ea5e9', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5, marginBottom: 8 },
  typeRow: { flexDirection: 'row', gap: 8 },
  typeBtn: { flex: 1, backgroundColor: '#0f172a', borderRadius: 10, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  typeBtnActive: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
  typeBtnText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  typeBtnTextActive: { color: '#0f172a' },
  card: { backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b' },
  label: { color: '#94a3b8', fontSize: 11, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#020617', borderWidth: 1, borderColor: '#334155', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, color: '#f8fafc', fontSize: 13 },
  inputRow: { flexDirection: 'row', gap: 10 },
  sqFtBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0ea5e915', padding: 8, borderRadius: 8, marginTop: 8 },
  sqFtText: { color: '#0ea5e9', fontSize: 12, fontWeight: 'bold' },
  profitCard: { backgroundColor: '#10b98115', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#10b98140', marginTop: 12 },
  profitHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profitTitle: { color: '#34d399', fontSize: 11, fontWeight: 'bold' },
  marginBadge: { backgroundColor: '#10b98130', color: '#34d399', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  profitGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  pLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold' },
  pVal: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  actionGrid: { flexDirection: 'row', gap: 12, marginTop: 14 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
  actionText: { fontSize: 13, fontWeight: 'bold' },
  bookBtn: { backgroundColor: '#0ea5e9', borderRadius: 12, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14 },
  bookBtnText: { color: '#0f172a', fontSize: 14, fontWeight: 'bold' }
});
