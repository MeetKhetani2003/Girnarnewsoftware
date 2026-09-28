import React, { useState } from 'react';
import {
  Smartphone,
  Server,
  Zap,
  Play,
  Copy,
  Check,
  Code2,
  Terminal,
  Download,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api.ts';

interface ExpoServerlessViewProps {
  onOpenOrderModal: () => void;
  onOpenTaktiCalc: () => void;
}

export const ExpoServerlessView: React.FC<ExpoServerlessViewProps> = ({
  onOpenOrderModal,
  onOpenTaktiCalc,
}) => {
  const [endpoint, setEndpoint] = useState<string>('/api/costing/takti-calculator');
  const [method, setMethod] = useState<'GET' | 'POST'>('POST');
  const [payload, setPayload] = useState<string>(
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
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      let body: any = null;
      if (method === 'POST' && payload) {
        body = JSON.parse(payload);
      }
      const data = await api.executeRawServerlessCall(endpoint, method, body);
      setLatency(Math.round(performance.now() - start));
      setResponse(data);
    } catch (err: any) {
      setLatency(Math.round(performance.now() - start));
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-500/15 via-slate-900 to-amber-500/10 p-4 rounded-2xl border border-indigo-500/30">
        <div className="flex items-center space-x-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span>Expo & Next-Native Serverless Engine</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.2 rounded font-mono">
                Live
              </span>
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">
              Expo Router v3 • Serverless MongoDB Atlas • Takti Sq.Ft
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          This system uses Expo Router Serverless APIs (`app/api/+api.ts`) connecting natively to your
          MongoDB Atlas replica set. Run serverless calls directly below:
        </p>
      </div>

      {/* Interactive Serverless Caller */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center space-x-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold font-mono text-amber-400 focus:outline-none"
          >
            <option value="POST">POST</option>
            <option value="GET">GET</option>
          </select>

          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:border-amber-500 focus:outline-none"
          />

          <button
            onClick={handleExecute}
            disabled={loading}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs shadow-md shadow-amber-950/40 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></span>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Call</span>
              </>
            )}
          </button>
        </div>

        {/* Quick buttons */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            onClick={() => {
              setEndpoint('/api/costing/takti-calculator');
              setMethod('POST');
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer"
          >
            POST /api/costing
          </button>
          <button
            onClick={() => {
              setEndpoint('/api/pedhis');
              setMethod('GET');
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer"
          >
            GET /api/pedhis
          </button>
          <button
            onClick={() => {
              setEndpoint('/api/orders');
              setMethod('GET');
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer"
          >
            GET /api/orders
          </button>
          <button
            onClick={() => {
              setEndpoint('/api/health');
              setMethod('GET');
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer"
          >
            GET /api/health
          </button>
        </div>

        {/* Payload textarea if POST */}
        {method === 'POST' && (
          <div>
            <label className="text-[10px] text-slate-400 block mb-1 font-bold uppercase">
              Payload (JSON)
            </label>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="w-full h-28 bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono text-xs text-amber-300 focus:outline-none focus:border-amber-500"
            />
          </div>
        )}

        {/* Response box */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
              <span>Serverless Output</span>
              {latency !== null && (
                <span className="text-emerald-400 font-mono">({latency} ms)</span>
              )}
            </span>

            {response && (
              <button
                onClick={() => handleCopy(JSON.stringify(response, null, 2))}
                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            )}
          </div>

          <pre className="text-xs font-mono text-emerald-300 overflow-x-auto max-h-56 p-1">
            {response ? JSON.stringify(response, null, 2) : '// Response will appear here'}
          </pre>
        </div>
      </div>

      {/* Expo Quick Start Instructions */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span>Run Expo Project in Terminal</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 space-y-1">
          <div>cd expo</div>
          <div>npm install</div>
          <div>npx expo start --tunnel</div>
        </div>
      </div>
    </div>
  );
};
