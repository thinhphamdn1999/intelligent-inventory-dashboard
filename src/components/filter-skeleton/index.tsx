import { Skeleton } from '@/components/common/skeleton/skeleton';

const FilterSkeleton = () => {
  return (
    <div
      className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center"
      role="status"
      aria-label="Loading filters"
    >
      <div className="flex gap-2 sm:contents">
        <div className="flex-1 min-w-0 sm:flex-none sm:w-48 flex flex-col gap-1 sm:flex-row sm:items-center">
          <Skeleton className="hidden sm:block h-4 w-12" />
          <Skeleton className="h-9 w-full sm:w-45" />
        </div>
        <div className="flex-1 min-w-0 sm:flex-none sm:w-48 flex flex-col gap-1 sm:flex-row sm:items-center">
          <Skeleton className="hidden sm:block h-4 w-12" />
          <Skeleton className="h-9 w-full sm:w-45" />
        </div>
      </div>
      <Skeleton className="h-9 w-full sm:w-28" />
    </div>
  );
};

export default FilterSkeleton;
