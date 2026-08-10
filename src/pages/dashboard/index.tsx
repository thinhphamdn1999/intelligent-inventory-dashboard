import { useEffect, useState } from 'react';
import type { Maker } from '@/types/maker';

import VehicleFilter from '@/components/vehicle-filter';
import VehicleHeader from '@/components/vehicle-header';
import VehicleRow from '@/components/vehicle-row';
import VehicleSkeleton from '@/components/vehicle-skeleton';
import FilterSkeleton from '@/components/filter-skeleton';

import { useMakers } from '@/hooks/use-maker';
import { useVehicles } from '@/hooks/use-vehicle';

import { toast } from '@/components/common/toast/toast';
import { ERROR_MESSAGE } from '@/constants/error-message';

const Dashboard = () => {
  const [selectedMaker, setSelectedMaker] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');

  const { data, isLoading, error } = useVehicles({
    make: selectedMaker || undefined,
    model: selectedModel || undefined,
    page: 1,
    limit: 10,
  });
  const {
    data: makesData,
    isLoading: isMakersLoading,
    error: makersError,
  } = useMakers();

  const handleMakerChange = (value: string | null) => {
    setSelectedMaker(value || '');
    setSelectedModel(''); // Reset model when maker changes
  };

  const handleModelChange = (value: string | null) => {
    setSelectedModel(value || '');
  };

  const handleClearFilters = () => {
    setSelectedMaker('');
    setSelectedModel('');
  };

  const handleLogStatus = (vehicleId: string) => {
    console.log(`Log status for vehicle with ID: ${vehicleId}`);
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
            {data?.data.length === 0 ? (
              <div className="flex justify-center items-center h-32 text-muted-foreground">
                No vehicles found.
              </div>
            ) : (
              <>
                <VehicleHeader />
                {data?.data.map((vehicle) => (
                  <VehicleRow
                    key={vehicle.id}
                    vehicle={vehicle}
                    onLogStatus={handleLogStatus}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
