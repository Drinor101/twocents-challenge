export default function PostSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          <div className="space-y-1">
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-4/5 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );
}