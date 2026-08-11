import { useEffect, useState } from 'react';

import { ERROR_MESSAGE } from '@/constants/error-message';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/constants/pagination';

import type { Maker } from '@/types/maker';

import VehicleFilter from '@/components/vehicle-filter';
import VehicleHeader from '@/components/vehicle-header';
import VehicleRow from '@/components/vehicle-row';
import VehicleSkeleton from '@/components/vehicle-skeleton';
import FilterSkeleton from '@/components/filter-skeleton';
import { toast } from '@/components/common/toast/toast';

import { useMakers } from '@/hooks/use-maker';
import { useVehicles } from '@/hooks/use-vehicle';
import VehiclePagination from '@/components/vehicle-pagination';

const Dashboard = () => {
  const [selectedMaker, setSelectedMaker] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [page, setPage] = useState(DEFAULT_PAGE_NUMBER);

  const { data, isLoading, error } = useVehicles({
    make: selectedMaker || undefined,
    model: selectedModel || undefined,
    page,
    limit: DEFAULT_PAGE_SIZE,
  });
  const {
    data: makesData,
    isLoading: isMakersLoading,
    error: makersError,
  } = useMakers();

  const handleResetPage = () => {
    setPage(DEFAULT_PAGE_NUMBER);
  };

  const handleMakerChange = (value: string | null) => {
    setSelectedMaker(value || '');

    // Reset model when maker changes
    setSelectedModel('');
    handleResetPage();
  };

  const handleModelChange = (value: string | null) => {
    setSelectedModel(value || '');
    handleResetPage();
  };

  const handleClearFilters = () => {
    setSelectedMaker('');
    setSelectedModel('');
    handleResetPage();
  };

  const totalPages = data?.pages ?? 1;

  const handlePageChange = (nextPage: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    setPage(nextPage);
  };

  useEffect(() => {
    if (error) {
      toast.add({
        type: 'error',
        description: ERROR_MESSAGE.SOMETHING_WENT_WRONG,
      });
    }
  }, [error]);

  useEffect(() => {
    if (makersError) {
      toast.add({
        type: 'error',
        description: ERROR_MESSAGE.SOMETHING_WENT_WRONG,
      });
    }
  }, [makersError]);

  return (
    <section className="flex flex-col gap-1 m-3 sm:m-5">
      {isMakersLoading ? (
        <FilterSkeleton />
      ) : (
        <VehicleFilter
          makers={makesData as Maker[]}
          selectedMaker={selectedMaker}
          selectedModel={selectedModel}
          onMakerChange={handleMakerChange}
          onModelChange={handleModelChange}
          onClearFilters={handleClearFilters}
        />
      )}
      <div>
        {isLoading ? (
          <VehicleSkeleton />
        ) : (
          <>
            {data?.data.length === 0 || !!error ? (
              <div className="flex justify-center items-center h-32 text-muted-foreground">
                No vehicles found.
              </div>
            ) : (
              <>
                <VehicleHeader />
                {data?.data.map((vehicle) => (
                  <VehicleRow key={vehicle.id} vehicle={vehicle} />
                ))}
              </>
            )}
          </>
        )}
      </div>
      {!isLoading && totalPages > 1 && (
        <VehiclePagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
};

export default Dashboard;
