'use client';

import { cn } from "@/lib/utils";

interface NetWorthPillProps {
  netWorth: number;
  username: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export default function NetWorthPill({ 
  netWorth, 
  username, 
  onClick, 
  className 
}: NetWorthPillProps) {
  const getNetWorthTier = (worth: number) => {
    if (worth >= 1000000) return 'platinum';
    if (worth >= 100000) return 'gold';
    if (worth >= 10000) return 'silver';
    return 'bronze';
  };

  const formatNetWorth = (worth: number) => {
    if (worth >= 1000000) return `$${(worth / 1000000).toFixed(1)}M`;
    if (worth >= 1000) return `$${(worth / 1000).toFixed(1)}K`;
    return `$${worth}`;
  };

  const tier = getNetWorthTier(netWorth);
  
  const gradientClasses = {
    bronze: 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white shadow-md',
    silver: 'bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 text-gray-800 shadow-md',
    gold: 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-yellow-900 shadow-md',
    platinum: 'bg-gradient-to-r from-gray-200 via-white to-gray-200 text-gray-800 shadow-md'
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold",
        "transition-all duration-200 hover:scale-105 hover:shadow-lg",
        "border border-white/20 backdrop-blur-sm",
        gradientClasses[tier],
        onClick && "cursor-pointer hover:opacity-90",
        className
      )}
    >
      <span className="text-xs font-medium">{username}</span>
      <span className="text-xs opacity-90">{formatNetWorth(netWorth)}</span>
    </button>
  );
}