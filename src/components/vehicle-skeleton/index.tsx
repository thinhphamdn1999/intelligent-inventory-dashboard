import { Skeleton } from '@/components/common/skeleton/skeleton';

interface VehicleSkeletonProps {
  rows?: number;
}

const VehicleSkeleton = ({ rows = 10 }: VehicleSkeletonProps) => {
  return (
    <div className="w-full" role="status" aria-label="Loading vehicles">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 py-3 border-t border-border"
        >
          <div className="flex flex-col gap-2 sm:hidden">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-8 w-24" />
          </div>

          <div className="hidden sm:block sm:w-[24%]">
            <Skeleton className="h-4 w-full max-w-40" />
          </div>
          <div className="hidden sm:block sm:w-[20%]">
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="hidden sm:block sm:w-[15%]">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="hidden sm:block sm:w-[22%]">
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <div className="hidden sm:flex sm:w-[19%] sm:justify-end">
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleSkeleton;
