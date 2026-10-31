import React from 'react';
import { Wifi, Cpu, Presentation, Zap, Home, Droplets, Shield, HelpCircle } from 'lucide-react';

export default function CategoryBadge({ category }) {
  const getIcon = () => {
    switch (category) {
      case 'Wi-Fi / Internet':
        return <Wifi className="w-3.5 h-3.5 text-blue-500" />;
      case 'Laboratory Equipment':
        return <Cpu className="w-3.5 h-3.5 text-purple-500" />;
      case 'Classroom & Projector':
        return <Presentation className="w-3.5 h-3.5 text-indigo-500" />;
      case 'Electricity & Power':
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'Hostel & Maintenance':
        return <Home className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Sanitation & Water':
        return <Droplets className="w-3.5 h-3.5 text-cyan-500" />;
      case 'Security & Access':
        return <Shield className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
      {getIcon()}
      <span>{category}</span>
    </span>
  );
}

