import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Server,
  Code2,
  QrCode,
  Copy,
  Check,
  Play,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  FileCode,
  Download,
  Terminal,
  Zap,
} from 'lucide-react';
import { api } from '../services/api.ts';

interface ExpoNativeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTaktiCalc: () => void;
  onOpenOrderModal: () => void;
}

type HubTab = 'serverless' | 'takti-simulator' | 'code-viewer' | 'expo-go';

const EXPO_FILES: Record<string, { label: string; path: string; lang: string; content: string }> = {
  'api-catchall': {
    label: 'Expo Serverless Route (app/api/[...route]+api.ts)',
    path: 'expo/app/api/[...route]+api.ts',
    lang: 'typescript',
    content: `/**
 * Next-Native / Expo Router Catch-All Serverless API Route: /api/[...route]
 * Handles dynamic serverless API routing inside the Expo App directly connecting to MongoDB Atlas!
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function getDb() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGODB_URI);
  }
  return mongoose.connection.db;
}

export async function GET(request: Request, context: { params: { route: string[] } }) {
  try {
    const db = await getDb();
    const routePath = (context.params.route || []).join('/');
    const url = new URL(request.url);
    const pedhiId = url.searchParams.get('pedhiId');

    if (routePath === 'pedhis') {
      const pedhis = await db.collection('pedhis').find({}).toArray();
      return Response.json({ success: true, pedhis, count: pedhis.length });
    }

    if (routePath === 'products') {
      const filter: any = {};
      if (pedhiId) filter.pedhiId = new mongoose.Types.ObjectId(pedhiId);
      const products = await db.collection('products').find(filter).toArray();
      return Response.json({ success: true, products });
    }

    return Response.json({
      status: 'active',
      route: routePath,
      message: 'Expo Next-Native Serverless API Endpoint is active'
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}`,
  },
  'api-costing': {
    label: 'Takti Costing Serverless API (app/api/costing+api.ts)',
    path: 'expo/app/api/costing+api.ts',
    lang: 'typescript',
    content: `/**
 * Expo Router Serverless API Route: /api/costing
 * Implements serverless pricing and profit calculations for Expo application
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      stoneType = 'Lakha Red Stone',
      lengthInches = 36,
      widthInches = 24,
      customSupplierCostPerSqFt = 450, // e.g. 450 vs 500 from variable quarry
      labourCostPerSqFt = 80,
      sellingRatePerSqFt = 650
    } = body;

    const totalSqFt = Number(((lengthInches * widthInches) / 144).toFixed(3));
    const totalCostPerSqFt = customSupplierCostPerSqFt + labourCostPerSqFt;
    const totalCost = Math.round(totalCostPerSqFt * totalSqFt);
    const totalRevenue = Math.round(sellingRatePerSqFt * totalSqFt);
    const totalProfit = totalRevenue - totalCost;
    const marginPercent = totalRevenue > 0 ? Number(((totalProfit / totalRevenue) * 100).toFixed(1)) : 0;

    return Response.json({
      success: true,
      stoneType,
      dimensions: { lengthInches, widthInches, totalSqFt },
      costing: { customSupplierCostPerSqFt, labourCostPerSqFt, totalCostPerSqFt, totalCost },
      pricing: { sellingRatePerSqFt, totalRevenue },
      profitability: { totalProfit, marginPercent, profitPerSqFt: sellingRatePerSqFt - totalCostPerSqFt }
    });
  } catch (error: any) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}`,
  },
  'app-json': {
    label: 'Expo Configuration (app.json)',
    path: 'expo/app.json',
    lang: 'json',
    content: `{
  "expo": {
    "name": "Girnar Shilp Vyapar",
    "slug": "girnar-shilp-vyapar",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "girnarshilp",
    "userInterfaceStyle": "dark",
    "newArchEnabled": true,
    "web": {
      "bundler": "metro",
      "output": "server"
    },
    "plugins": ["expo-router"],
    "ios": { "bundleIdentifier": "com.girnarshilp.vyapar" },
    "android": { "package": "com.girnarshilp.vyapar" }
  }
}`,
  },
  'package-json': {
    label: 'Expo Dependencies (package.json)',
    path: 'expo/package.json',
    lang: 'json',
    content: `{
  "name": "girnar-shilp-expo",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-status-bar": "~2.0.0",
    "react-native": "0.76.5",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.4.0",
    "lucide-react-native": "^0.475.0",
    "mongoose": "^8.9.5"
  }
}`,
  },
  'takti-screen': {
    label: 'Native Takti Screen (app/(tabs)/takti-calc.tsx)',
    path: 'expo/app/(tabs)/takti-calc.tsx',
    lang: 'typescript',
    content: `// React Native Native Screen with Takti Sq.Ft & Custom Supplier Costing
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Calculator, TrendingUp } from 'lucide-react-native';

export default function NativeTaktiCalcScreen() {
  const [len, setLen] = useState('36');
  const [wid, setWid] = useState('24');
  const [suppCost, setSuppCost] = useState('450'); // e.g. 450 vs 500
  const [labour, setLabour] = useState('80');
  const [sellRate, setSellRate] = useState('650');

  const sqFt = ((parseFloat(len) * parseFloat(wid)) / 144).toFixed(3);
  const cost = Math.round((parseFloat(suppCost) + parseFloat(labour)) * parseFloat(sqFt));
  const rev = Math.round(parseFloat(sellRate) * parseFloat(sqFt));
  const profit = rev - cost;
  const margin = ((profit / rev) * 100).toFixed(1);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617', padding: 16 }}>
      <Text style={{ color: '#fbbf24', fontWeight: 'bold' }}>TAKTI SQ. FT PROFIT ENGINE</Text>
      <Text style={{ color: '#94a3b8' }}>Area: {sqFt} Sq. Ft | Profit: ₹{profit} ({margin}%)</Text>
    </ScrollView>
  );
}`,
  },
};

export const ExpoNativeHubModal: React.FC<ExpoNativeHubModalProps> = ({
  isOpen,
  onClose,
  onOpenTaktiCalc,
  onOpenOrderModal,
}) => {
  const [activeTab, setActiveTab] = useState<HubTab>('serverless');
  const [selectedFileKey, setSelectedFileKey] = useState<string>('api-catchall');
  const [copiedCode, setCopiedCode] = useState(false);

  // Live Serverless API tester states
  const [endpoint, setEndpoint] = useState<string>('/api/costing/takti-calculator');
  const [method, setMethod] = useState<'GET' | 'POST'>('POST');
  const [requestPayload, setRequestPayload] = useState<string>(
    JSON.stringify(
      {
        stoneType: 'Lakha Red Stone',
        lengthInches: 36,
        widthInches: 24,
        customSupplierCostPerSqFt: 450,
        labourCostPerSqFt: 80,
        sellingRatePerSqFt: 650,
      },
      null,
      2
    )
  );
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiLatencyMs, setApiLatencyMs] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleRunServerlessCall = async () => {
    setApiLoading(true);
    const start = performance.now();
    try {
      let body: any = null;
      if (method === 'POST' && requestPayload) {
        body = JSON.parse(requestPayload);
      }
      const data = await api.executeRawServerlessCall(endpoint, method, body);
      const elapsed = Math.round(performance.now() - start);
      setApiResponse(data);
      setApiLatencyMs(elapsed);
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start);
      setApiResponse({ success: false, error: err.message });
      setApiLatencyMs(elapsed);
    } finally {
      setApiLoading(false);
    }
  };

  const handleCopyFile = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadProjectZip = () => {
    // Generate a downloadable JSON manifest bundle of all Expo files
    const bundleData = {
      project: 'Girnar Shilp Expo App with Next-Native Serverless APIs',
      generatedAt: new Date().toISOString(),
      instructions: 'Run `npx create-expo-app` and copy these files into your repository.',
      files: EXPO_FILES,
    };
    const blob = new Blob([JSON.stringify(bundleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'girnar-shilp-expo-project.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
        {/* Top Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-950/40">
              <Smartphone className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-base text-slate-100">
                  Expo React Native & Next-Native Hub
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Serverless APIs Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Expo Router v3 • Serverless MongoDB Atlas • Takti Custom Costing Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-950/60 px-5 border-b border-slate-800/80 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('serverless')}
            className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'serverless'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Serverless API Tester</span>
          </button>

          <button
            onClick={() => setActiveTab('takti-simulator')}
            className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'takti-simulator'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Takti Costing & Profit Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('code-viewer')}
            className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'code-viewer'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Expo Code & Serverless Files</span>
          </button>

          <button
            onClick={() => setActiveTab('expo-go')}
            className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'expo-go'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Run in Expo Go</span>
          </button>
        </div>

        {/* Tab 1: Live Serverless API Tester */}
        {activeTab === 'serverless' && (
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start space-x-3">
              <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-bold text-amber-300">
                  Next-Native Expo Serverless Architecture
                </div>
                <div className="text-slate-300 leading-relaxed">
                  In Expo Router (`output: "server"`), files in `app/api/+api.ts` execute as standard
                  serverless functions connecting directly to your MongoDB Atlas cluster. Below you can
                  test the live endpoints in real-time!
                </div>
              </div>
            </div>

            {/* Endpoint Selector & Controls */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold font-mono text-amber-400 focus:outline-none"
                >
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                </select>

                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-200 focus:border-amber-500 focus:outline-none"
                  placeholder="/api/costing/takti-calculator"
                />

                <button
                  onClick={handleRunServerlessCall}
                  disabled={apiLoading}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-amber-950/40 cursor-pointer transition-all disabled:opacity-50"
                >
                  {apiLoading ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></span>
                      Executing...
                    </span>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Run API Call</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Endpoint Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400">Quick Endpoints:</span>
                <button
                  onClick={() => {
                    setEndpoint('/api/costing/takti-calculator');
                    setMethod('POST');
                    setRequestPayload(
                      JSON.stringify(
                        {
                          stoneType: 'Lakha Red Stone',
                          lengthInches: 36,
                          widthInches: 24,
                          customSupplierCostPerSqFt: 450,
                          labourCostPerSqFt: 80,
                          sellingRatePerSqFt: 650,
                        },
                        null,
                        2
                      )
                    );
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors"
                >
                  POST /api/costing/takti-calculator
                </button>
                <button
                  onClick={() => {
                    setEndpoint('/api/pedhis');
                    setMethod('GET');
                    setRequestPayload('');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors"
                >
                  GET /api/pedhis (4 Pedhis)
                </button>
                <button
                  onClick={() => {
                    setEndpoint('/api/orders');
                    setMethod('GET');
                    setRequestPayload('');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors"
                >
                  GET /api/orders
                </button>
                <button
                  onClick={() => {
                    setEndpoint('/api/health');
                    setMethod('GET');
                    setRequestPayload('');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors"
                >
                  GET /api/health
                </button>
              </div>
            </div>

            {/* Request & Response Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Request Body */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Request Payload (JSON)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {method === 'POST' ? 'Editable' : 'No Body for GET'}
                  </span>
                </div>
                <textarea
                  value={requestPayload}
                  onChange={(e) => setRequestPayload(e.target.value)}
                  disabled={method === 'GET'}
                  className="w-full flex-1 min-h-[180px] bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-xs text-amber-200 focus:outline-none focus:border-amber-500 resize-none disabled:opacity-40"
                  placeholder="{}"
                />
              </div>

              {/* Response Viewer */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Serverless Response
                    </span>
                    {apiLatencyMs !== null && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">
                        {apiLatencyMs}ms
                      </span>
                    )}
                  </div>
                  {apiResponse && (
                    <button
                      onClick={() => handleCopyFile(JSON.stringify(apiResponse, null, 2))}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  )}
                </div>

                <div className="flex-1 min-h-[180px] bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-xs overflow-auto text-emerald-300">
                  {apiResponse ? (
                    <pre className="whitespace-pre-wrap">{JSON.stringify(apiResponse, null, 2)}</pre>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-600 text-xs">
                      Click "Run API Call" to execute serverless request
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Takti Costing & Profit Simulator */}
        {activeTab === 'takti-simulator' && (
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                    <span>Takti Square Feet & Variable Quarry Profit Engine</span>
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono">
                      Solved for Factory
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">
                    "in factory we dont know which supllier's supply we are using so it also have the
                    custom supply price option while booking the order so it will give me profit"
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenTaktiCalc();
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Open Dedicated Calc</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Matrix of Quarry Differences */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400">Supplier A (Quarry Direct)</div>
                  <div className="text-lg font-bold text-amber-400 font-mono mt-1">₹420 / sq.ft</div>
                  <div className="text-[11px] text-slate-400 mt-1">Direct quarry trailer dispatch</div>
                  <div className="text-xs font-semibold text-emerald-400 mt-2">+₹150/sq.ft Profit</div>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/5">
                  <div className="text-[11px] font-bold text-amber-300">Supplier B (Morbi Yard)</div>
                  <div className="text-lg font-bold text-amber-400 font-mono mt-1">₹450 / sq.ft</div>
                  <div className="text-[11px] text-slate-400 mt-1">Stocked slabs in local yard</div>
                  <div className="text-xs font-semibold text-emerald-400 mt-2">+₹120/sq.ft Profit</div>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400">Supplier C (Selected Premium)</div>
                  <div className="text-lg font-bold text-amber-400 font-mono mt-1">₹500 / sq.ft</div>
                  <div className="text-[11px] text-slate-400 mt-1">Zero vein pure flawless slab</div>
                  <div className="text-xs font-semibold text-emerald-400 mt-2">+₹70/sq.ft Profit</div>
                </div>
              </div>

              {/* 3 Step Flow */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-slate-200">How It Works in This Application:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-400 text-[11px]">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <span>
                      Enter Length × Width in inches. Automatically converts to Square Feet (÷ 144).
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <span>
                      Type the variable quarry cost (e.g. ₹450 or ₹500) into the Custom Supplier Price
                      input.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <span>
                      Instant live calculation shows exact Total Profit and Net Margin % before booking
                      order!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Expo Code & Serverless Files Viewer */}
        {activeTab === 'code-viewer' && (
          <div className="p-5 flex-1 flex flex-col sm:flex-row gap-4 overflow-hidden">
            {/* File List */}
            <div className="w-full sm:w-64 bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5 overflow-y-auto">
              <div className="text-[11px] font-bold text-slate-400 uppercase px-2 py-1 tracking-wider">
                Expo Files
              </div>
              {Object.entries(EXPO_FILES).map(([key, item]) => {
                const isSelected = selectedFileKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedFileKey(key)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center space-x-2 ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={handleDownloadProjectZip}
                  className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Project Files</span>
                </button>
              </div>
            </div>

            {/* Code Box */}
            <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-300 font-semibold">
                  {EXPO_FILES[selectedFileKey].path}
                </span>

                <button
                  onClick={() => handleCopyFile(EXPO_FILES[selectedFileKey].content)}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg text-xs cursor-pointer transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="flex-1 p-4 bg-slate-950 overflow-auto font-mono text-xs text-amber-100/90 leading-relaxed selection:bg-amber-500/30">
                <code>{EXPO_FILES[selectedFileKey].content}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: Run in Expo Go */}
        {activeTab === 'expo-go' && (
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* QR Code and Quick Scan */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
                <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center relative">
                  {/* SVG Simulated QR code */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
                    <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" fill="currentColor" />

                    <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                    <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                    {/* QR data dots */}
                    <rect x="35" y="10" width="10" height="10" fill="currentColor" />
                    <rect x="50" y="15" width="10" height="10" fill="currentColor" />
                    <rect x="40" y="35" width="20" height="20" fill="currentColor" />
                    <rect x="65" y="45" width="15" height="10" fill="currentColor" />
                    <rect x="15" y="45" width="15" height="10" fill="currentColor" />
                    <rect x="45" y="70" width="15" height="15" fill="currentColor" />
                    <rect x="70" y="70" width="25" height="25" fill="currentColor" />
                  </svg>
                </div>

                <div className="mt-4 font-bold text-sm text-slate-100">
                  Scan with Expo Go App
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Open Camera on iPhone or the Expo Go app on Android to preview on physical phone.
                </p>
              </div>

              {/* Commands */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span>Run with Expo CLI</span>
                </div>

                <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 font-mono text-xs text-amber-300 space-y-2">
                  <div className="text-slate-500"># 1. Clone or copy /expo directory</div>
                  <div>cd expo</div>
                  <div className="text-slate-500"># 2. Install dependencies</div>
                  <div>npm install</div>
                  <div className="text-slate-500"># 3. Start Expo development server with tunnel</div>
                  <div>npx expo start --tunnel</div>
                </div>

                <div className="text-xs text-slate-400 leading-relaxed space-y-1.5 pt-2">
                  <div className="font-semibold text-slate-300">Environment Variables:</div>
                  <p>
                    Set <code className="text-amber-300 font-mono">MONGODB_URI</code> in{' '}
                    <code className="text-amber-300 font-mono">.env</code> so your Expo serverless
                    routes talk to your MongoDB cluster.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Girnar Shilp Multi-Pedhi Manager • Expo & Serverless Native Architecture
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
