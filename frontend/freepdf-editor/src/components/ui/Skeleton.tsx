
import React from 'react';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 rounded-2xl ${className}`} />
);

export const DashboardSkeleton = () => (
  <div className="space-y-10 p-6 lg:p-10">
    <div className="flex justify-between items-center">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-12 w-40" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 w-full rounded-[2rem]" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Skeleton className="lg:col-span-2 h-96 rounded-[2.5rem]" />
      <Skeleton className="h-96 rounded-[2.5rem]" />
    </div>
  </div>
);

export const ToolSkeleton = () => (
  <div className="max-w-4xl mx-auto py-20 px-6 space-y-12">
    <div className="text-center space-y-6">
      <Skeleton className="h-16 w-3/4 mx-auto" />
      <Skeleton className="h-6 w-1/2 mx-auto" />
    </div>
    <Skeleton className="h-80 w-full rounded-[3rem]" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
    </div>
  </div>
);
