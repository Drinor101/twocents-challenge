'use client';

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface PollOption {
  text: string;
  votes: number;
}

interface PollDisplayProps {
  question: string;
  options: PollOption[];
  totalVotes: number;
  className?: string;
}

export default function PollDisplay({ 
  question, 
  options, 
  totalVotes, 
  className 
}: PollDisplayProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return (votes / totalVotes) * 100;
  };

  const getBarColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-lg p-6", className)}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {question}
      </h3>
      
      <div className="space-y-3">
        {options.map((option, index) => {
          const percentage = getPercentage(option.votes);
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  {option.text}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {option.votes} votes ({percentage.toFixed(1)}%)
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all duration-1000 ease-out",
                    getBarColor(index)
                  )}
                  style={{
                    width: animated ? `${percentage}%` : '0%'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Total votes: {totalVotes}
      </div>
    </div>
  );
}