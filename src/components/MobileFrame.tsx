import React, { useState } from 'react';
import { Smartphone, Monitor, Database, Building2, Zap, Wifi, Battery, Signal } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface MobileFrameProps {
  children: React.ReactNode;
  onOpenPedhiSelector: () => void;
  onOpenExpoHub?: () => void;
}

type DeviceType = 'iphone' | 'samsung' | 'pixel' | 'fullscreen';

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  onOpenPedhiSelector,
  onOpenExpoHub,
}) => {
  const [device, setDevice] = useState<DeviceType>('iphone');
  const { currentPedhi, currentRole } = useAuth();

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top utility bar for preview switching, Expo indicator and quick controls */}
      <header className="bg-slate-900 border-b border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between text-xs z-30 select-none">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
            GS
          </div>
          <span className="font-bold tracking-tight text-slate-200">Girnar Shilp Multi-Pedhi</span>

          {/* Expo Go Status Pill */}
          <button
            onClick={onOpenExpoHub}
            className="flex items-center space-x-1.5 bg-indigo-950/80 hover:bg-indigo-900/80 border border-indigo-500/40 text-indigo-300 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors cursor-pointer"
            title="Open Expo Native & Serverless API Hub"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Expo Go • Serverless Active</span>
            <span className="sm:hidden">Expo</span>
          </button>

          <span className="hidden md:inline-flex items-center text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            MongoDB Live
          </span>
        </div>

        {/* Viewport device selector and active Pedhi */}
        <div className="flex items-center space-x-2">
          {currentPedhi && (
            <button
              onClick={onOpenPedhiSelector}
              className="flex items-center space-x-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
              title="Switch Business Pedhi"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold max-w-[110px] sm:max-w-[170px] truncate">{currentPedhi.name}</span>
              <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded text-amber-200 uppercase font-mono hidden sm:inline">
                {currentRole}
              </span>
            </button>
          )}

          {/* Device switch selector */}
          <div className="flex bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/80">
            <button
              onClick={() => setDevice('iphone')}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                device === 'iphone'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="iPhone 16 Pro Frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">iPhone</span>
            </button>

            <button
              onClick={() => setDevice('samsung')}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                device === 'samsung'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Android / Samsung S24 Frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Galaxy</span>
            </button>

            <button
              onClick={() => setDevice('fullscreen')}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                device === 'fullscreen'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Full Screen Mode"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Web</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main viewport canvas */}
      <main className="flex-1 flex justify-center items-start p-0 sm:p-4 md:p-6 overflow-x-hidden">
        {device !== 'fullscreen' ? (
          /* Phone device shell */
          <div
            className={`w-full max-w-[430px] min-h-[calc(100vh-45px)] sm:min-h-[820px] sm:max-h-[860px] bg-slate-950 sm:border-[8px] sm:border-slate-800/95 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.08)] flex flex-col relative overflow-hidden ${
              device === 'iphone' ? 'sm:rounded-[44px]' : 'sm:rounded-[34px]'
            }`}
          >
            {/* Native Mobile Status Bar (iOS / Android) */}
            <div className="hidden sm:flex justify-between items-center h-8 bg-slate-950 px-6 pt-1 z-30 select-none">
              <span className="text-[11px] font-semibold text-slate-300 font-mono tracking-tight">
                {currentTime}
              </span>

              {/* Dynamic Island / Camera Punch Hole */}
              {device === 'iphone' ? (
                <div className="w-24 h-4.5 bg-black rounded-full flex items-center justify-between px-2.5 shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse"></div>
                </div>
              ) : (
                <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800 mx-auto"></div>
              )}

              <div className="flex items-center space-x-1.5 text-slate-300">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* In-phone Content Area */}
            <div className="flex-1 flex flex-col overflow-y-auto relative bg-slate-900/40">
              {children}
            </div>

            {/* Phone Home Bar on bottom */}
            <div className="hidden sm:flex justify-center items-center py-2 bg-slate-950 z-20 select-none">
              <div className="w-32 h-1 bg-slate-600/80 rounded-full hover:bg-slate-400 transition-colors"></div>
            </div>
          </div>
        ) : (
          /* Expanded Full-Width View */
          <div className="w-full max-w-5xl bg-slate-900/60 rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden min-h-[calc(100vh-60px)]">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};
