# Girnar Shilp Multi-Pedhi Vyapar (Expo React Native + Next-Native Serverless APIs)

Mobile-first multi-pedhi business management app for 4 enterprises:
1. **Girnarshilp** (Temple Architecture, Mandirs & Mega Projects - Rajkot)
2. **ArvindRamjibhai** (Pure Sevan Wooden Mandirs - Rajkot)
3. **Jaipurshilpkala** (Divine Makrana Marble Bhagwan Murtis - Jaipur)
4. **Bhagvatikalamandir** (Granite & Lakha Red Stone Taktis in Sq. Ft - Morbi)

---

## 📱 Mobile-First UI Architecture

- **Streamlined 3-Tab Bottom Navigation**:
  1. 🏠 **Home**: Real-time sales KPIs, order counts, profit margins, quick action buttons, and active Pedhi switcher.
  2. 📦 **Orders**: Orders with Takti Square Feet measurements, custom quarry pricing, and net profit tracking.
  3. 🧾 **Bills**: GST tax invoices with HSN, payment status (Paid, Partial, Unpaid), PDF printing, and WhatsApp sharing.
  4. ☰ **Drawer Menu**: Opens the comprehensive slide-in Drawer covering all 11+ modules without crowding the bottom bar!

- **All Features Accessible via Drawer & Quick Actions**:
  - 📐 **Takti Sq.Ft Profit Engine**: Formula `(Length" × Width") ÷ 144 = Sq.Ft`. Solves factory quarry pricing variations (e.g. ₹420 vs ₹450 vs ₹500/sq.ft) with custom supplier pricing options.
  - 🧱 **Inventory & Stock**: Categorized for all 3 product lines (Taktis in Sq.Ft, Sevan Wood Mandirs in Pcs, Makrana Marble Murtis in Pcs).
  - 👥 **Parties & Khata Ledger**: Customer and vendor accounts with Lena (Receivable) and Dena (Payable) balances.
  - 🚚 **Quarries & Stone Suppliers**: Rajasthan quarries, stone lots, and price tracking.
  - 🔄 **Stock Transfers**: Inter-pedhi inventory transfers across the 4 Pedhis.
  - 📖 **Rojmel (Daybook / Cashbook)**: Daily Jama (Cash In) and Naame (Cash Out) register.
  - 🏛️ **4 Pedhis Management**: Fast switching and settings.
  - ⚡ **Next-Native Serverless APIs (`app/api/+api.ts`)**: Direct serverless routes connecting to MongoDB Atlas!

---

## 🚀 Running the App Locally

1. **Install dependencies**:
   ```bash
   cd expo
   npm install
   ```

2. **Configure Environment in `expo/.env`**:
   ```env
   MONGODB_URI="mongodb://meetkhetani1111_db_user:U0gKyuDry2hCVODV@ac-jl18wkj-shard-00-00.z4iviiq.mongodb.net:27017,ac-jl18wkj-shard-00-01.z4iviiq.mongodb.net:27017,ac-jl18wkj-shard-00-02.z4iviiq.mongodb.net:27017/?ssl=true&replicaSet=atlas-73wprs-shard-0&authSource=admin&appName=Cluster0"
   EXPO_PUBLIC_API_URL="http://localhost:3000/api"
   ```

3. **Start Expo Dev Server**:
   ```bash
   npx expo start --tunnel
   ```

4. **Preview on Device**:
   - Open **Expo Go** on Android or Camera app on iOS and scan the terminal QR code.
