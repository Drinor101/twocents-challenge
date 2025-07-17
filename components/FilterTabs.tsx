'use client';

import { cn } from "@/lib/utils";

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { id: 'Top Today', label: 'Top Today' },
  { id: 'New Today', label: 'New Today' },
  { id: 'Top All Time', label: 'Top All Time' },
  { id: 'Controversial All Time', label: 'Controversial' },
];

export default function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  return (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap",
            activeFilter === filter.id
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}