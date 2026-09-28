import React, { useState } from 'react';
import { Smartphone, Monitor, Database, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface MobileFrameProps {
  children: React.ReactNode;
  onOpenPedhiSelector: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, onOpenPedhiSelector }) => {
  const [isMobileMode, setIsMobileMode] = useState<boolean>(true);
  const { currentPedhi, currentRole } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top utility bar for preview switching and quick controls */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs z-30 select-none">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
            GS
          </div>
          <span className="font-bold tracking-tight text-slate-200">Girnar Shilp Vyapar</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline-flex items-center text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            MongoDB Live
          </span>
        </div>

        {/* Viewport switch and current Pedhi pill */}
        <div className="flex items-center space-x-2">
          {currentPedhi && (
            <button
              onClick={onOpenPedhiSelector}
              className="flex items-center space-x-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
              title="Switch Business Pedhi"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold max-w-[130px] sm:max-w-[180px] truncate">{currentPedhi.name}</span>
              <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded text-amber-200 uppercase font-mono">
                {currentRole}
              </span>
            </button>
          )}

          <div className="flex bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/80">
            <button
              onClick={() => setIsMobileMode(true)}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                isMobileMode
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mobile Device Frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
            <button
              onClick={() => setIsMobileMode(false)}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                !isMobileMode
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Full Screen Mode"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Expanded</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main viewport canvas */}
      <main className="flex-1 flex justify-center items-start p-0 sm:p-4 md:p-6 overflow-x-hidden">
        {isMobileMode ? (
          /* Phone device shell */
          <div className="w-full max-w-[440px] min-h-[calc(100vh-45px)] sm:min-h-[820px] sm:max-h-[860px] bg-slate-950 sm:rounded-[38px] sm:border-[8px] sm:border-slate-800/90 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.05)] flex flex-col relative overflow-hidden">
            {/* Phone Speaker & Camera Notch on top */}
            <div className="hidden sm:flex justify-center items-center h-5 bg-slate-950 pt-2 z-20">
              <div className="w-20 h-3.5 bg-slate-900 rounded-full flex items-center justify-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                <div className="w-8 h-1 rounded-full bg-slate-800"></div>
              </div>
            </div>

            {/* In-phone Content Area */}
            <div className="flex-1 flex flex-col overflow-y-auto relative bg-slate-900/40">
              {children}
            </div>

            {/* Phone Home Bar on bottom */}
            <div className="hidden sm:flex justify-center items-center py-1.5 bg-slate-950 z-20">
              <div className="w-32 h-1 bg-slate-700/80 rounded-full"></div>
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
