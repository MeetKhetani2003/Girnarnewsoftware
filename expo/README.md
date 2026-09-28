# Girnar Shilp Multi-Pedhi Vyapar (Expo React Native + Next-Native Serverless APIs)

Mobile-first multi-pedhi business management app for 4 enterprises:
1. **Girnarshilp** (Temple Architecture, Mandirs & Mega Projects)
2. **ArvindRamjibhai** (Pure Sevan Wooden Mandirs)
3. **Jaipurshilpkala** (Divine Makrana Marble Bhagwan Murtis)
4. **Bhagvatikalamandir** (Granite & Lakha Red Stone Taktis in Sq. Ft)

---

## 🚀 Key Features

- **Takti Square Feet & Custom Supplier Profit Engine**:
  - Measures Takti in Square Feet (`Length(in) x Width(in) / 144`).
  - Solves the factory problem: when sourcing costs fluctuate from suppliers (e.g., ₹450/sq.ft vs ₹500/sq.ft) and factory doesn't know in advance which supplier's slab will be used, enter a **Custom Supplier Price** while booking to instantly compute exact net profit and profit margin percentage!
- **Next-Native Serverless API Routes (`app/api/+api.ts`)**:
  - Direct serverless endpoints inside Expo Router (`/api/costing`, `/api/orders`, `/api/[...route]`) connecting to MongoDB Atlas!
- **Multi-Pedhi Switching**: Instant switching across 4 separate pedhis with isolated ledgers, invoices, inventory, and Rojmel (cash book).

---

## 📲 How to Run Locally with Expo Go

1. **Install dependencies**:
   ```bash
   cd expo
   npm install
   ```

2. **Set Environment Variables in `expo/.env`**:
   ```env
   MONGODB_URI="mongodb://meetkhetani1111_db_user:U0gKyuDry2hCVODV@ac-jl18wkj-shard-00-00.z4iviiq.mongodb.net:27017,ac-jl18wkj-shard-00-01.z4iviiq.mongodb.net:27017,ac-jl18wkj-shard-00-02.z4iviiq.mongodb.net:27017/?ssl=true&replicaSet=atlas-73wprs-shard-0&authSource=admin&appName=Cluster0"
   EXPO_PUBLIC_API_URL="http://localhost:3000/api"
   ```

3. **Start the Expo development server**:
   ```bash
   npx expo start
   ```

4. **Scan QR Code**:
   - Open **Expo Go** on your iPhone (Camera app) or Android (Expo Go app) and scan the terminal QR code.
   - For remote testing without local Wi-Fi, use `npx expo start --tunnel`.

---

## ⚡ Serverless API Deployment

Expo Router supports web server output (`"output": "server"` in `app.json`), allowing serverless deployment on Vercel, Cloudflare, Netlify, or EAS Hosting.
