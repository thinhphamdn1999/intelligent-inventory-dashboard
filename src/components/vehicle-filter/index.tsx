import { useMemo } from 'react';

import type { Maker } from '@/types/maker';

import { Button } from '@/components/common/button/button';
import SelectFilter from '@/components/select-filter';

interface VehicleFilters {
  selectedMaker: string;
  selectedModel: string;
  makers: Maker[];
  onMakerChange: (value: string | null) => void;
  onModelChange: (value: string | null) => void;
  onClearFilters: () => void;
}

const VehicleFilter = ({
  makers,
  selectedModel,
  selectedMaker,
  onMakerChange,
  onModelChange,
  onClearFilters,
}: VehicleFilters) => {
  const makerOptions = useMemo(() => {
    return (
      makers?.map((maker) => ({
        value: maker.name,
        label: maker.name,
      })) || []
    );
  }, [makers]);

  const modelOptions = useMemo(() => {
    const foundMaker = makers?.find((maker) => maker.name === selectedMaker);
    return (
      foundMaker?.models.map((model) => ({
        value: model,
        label: model,
      })) || []
    );
  }, [makers, selectedMaker]);

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
      <div className="flex gap-2 sm:contents">
        <div className="flex-1 min-w-0 sm:flex-none sm:w-48">
          <SelectFilter
            label="Maker"
            options={makerOptions}
            value={selectedMaker}
            onChange={onMakerChange}
          />
        </div>
        <div className="flex-1 min-w-0 sm:flex-none sm:w-48">
          <SelectFilter
            label="Model"
            options={modelOptions}
            value={selectedModel}
            onChange={onModelChange}
            disabled={!selectedMaker}
          />
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onClearFilters}
        className="w-full sm:w-auto"
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default VehicleFilter;
