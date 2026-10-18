import React, { useEffect, useState } from 'react';
import { Volume2, Mic, Cpu } from 'lucide-react';

interface AudioWaveformProps {
  status: 'idle' | 'listening' | 'speaking' | 'analyzing';
  label: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ status, label }) => {
  const [bars, setBars] = useState<number[]>([12, 24, 16, 32, 20, 14, 28, 18, 22, 10]);

  useEffect(() => {
    if (status === 'idle') {
      setBars([8, 12, 10, 14, 10, 8, 12, 10, 8, 6]);
      return;
    }

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map(() => {
          if (status === 'listening') {
            return Math.floor(Math.random() * 38) + 12; // Dynamic voice volume
          }
          if (status === 'speaking') {
            return Math.floor(Math.random() * 48) + 16; // Rich AI agronomist voice
          }
          if (status === 'analyzing') {
            return Math.floor(Math.random() * 20) + 10;
          }
          return 8;
        })
      );
    }, 110);

    return () => clearInterval(interval);
  }, [status]);

  const getColor = () => {
    switch (status) {
      case 'listening':
        return {
          bg: 'bg-[#FFB703]/20 border-[#FFB703]/60',
          barColor: 'bg-[#FFB703]',
          textColor: 'text-[#FFD166]',
          icon: <Mic className="w-5 h-5 text-[#FFB703] animate-pulse" />,
        };
      case 'speaking':
        return {
          bg: 'bg-[#1B4332]/90 border-[#52B788]',
          barColor: 'bg-[#52B788]',
          textColor: 'text-[#74C69D]',
          icon: <Volume2 className="w-5 h-5 text-[#52B788] animate-bounce" />,
        };
      case 'analyzing':
        return {
          bg: 'bg-[#122A30]/80 border-[#64DFDF]/60',
          barColor: 'bg-[#64DFDF]',
          textColor: 'text-[#64DFDF]',
          icon: <Cpu className="w-5 h-5 text-[#64DFDF] animate-spin" />,
        };
      default:
        return {
          bg: 'bg-[#111A16]/80 border-emerald-900/50',
          barColor: 'bg-emerald-700/60',
          textColor: 'text-emerald-300/80',
          icon: <Mic className="w-4 h-4 text-emerald-400" />,
        };
    }
  };

  const style = getColor();

  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border backdrop-blur-md transition-all shadow-lg ${style.bg}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-1.5 rounded-xl bg-black/30 shrink-0">{style.icon}</div>
        <div className="truncate">
          <div className="text-[11px] font-bold tracking-wider uppercase opacity-75 leading-none">
            {status === 'listening' ? 'Farmer Audio (16kHz PCM)' : status === 'speaking' ? 'Gemini Spoken Advice' : 'Multimodal Status'}
          </div>
          <div className={`text-sm font-extrabold truncate ${style.textColor}`}>{label}</div>
        </div>
      </div>

      {/* Waveform Bars */}
      <div className="flex items-center gap-1 h-10 shrink-0 pr-1">
        {bars.map((height, i) => (
          <div
            key={i}
            className={`w-1 sm:w-1.5 rounded-full transition-all duration-100 ${style.barColor}`}
            style={{
              height: `${height}px`,
              opacity: status === 'idle' ? 0.4 : 1,
            }}
          />
        ))}
      </div>
    </div>
  );
};
