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
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);

  useEffect(() => {
    // Stagger the animations for each option
    const timers: NodeJS.Timeout[] = [];
    
    options.forEach((_, index) => {
      const timer = setTimeout(() => {
        setAnimatedOptions(prev => [...prev, index]);
      }, 200 + (index * 150)); // 200ms delay + 150ms between each bar
      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [options.length]);

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return (votes / totalVotes) * 100;
  };

  const getBarColor = (index: number) => {
    const colors = [
      'bg-gradient-to-r from-blue-500 to-blue-600',
      'bg-gradient-to-r from-green-500 to-green-600',
      'bg-gradient-to-r from-purple-500 to-purple-600',
      'bg-gradient-to-r from-orange-500 to-orange-600',
      'bg-gradient-to-r from-red-500 to-red-600',
      'bg-gradient-to-r from-indigo-500 to-indigo-600',
      'bg-gradient-to-r from-pink-500 to-pink-600',
      'bg-gradient-to-r from-teal-500 to-teal-600'
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
          const isAnimated = animatedOptions.includes(index);
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700 dark:text-gray-300 transition-opacity duration-300"
                      style={{ opacity: isAnimated ? 1 : 0.6 }}>
                  {option.text}
                </span>
                <span className="text-gray-500 dark:text-gray-400 transition-all duration-500 ease-out"
                      style={{ 
                        opacity: isAnimated ? 1 : 0.6,
                        transform: isAnimated ? 'translateX(0)' : 'translateX(10px)'
                      }}>
                  {option.votes} votes ({percentage.toFixed(1)}%)
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={cn(
                    "h-3 rounded-full transition-all duration-700 ease-out shadow-sm",
                    getBarColor(index)
                  )}
                  style={{
                    width: isAnimated ? `${percentage}%` : '0%',
                    transform: isAnimated ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 transition-opacity duration-500"
           style={{ opacity: animatedOptions.length === options.length ? 1 : 0.6 }}>
        Total votes: {totalVotes}
      </div>
    </div>
  );
}