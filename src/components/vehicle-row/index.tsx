import { useState } from 'react';

import { DATE_FORMAT } from '@/constants/date';
import { AGING_STOCK_DAYS } from '@/constants/vehicle';

import type { Vehicle } from '@/types/vehicle';

import { Badge } from '@/components/common/badge/badge';
import { Button } from '@/components/common/button/button';
import LogStatusModal from '@/components/log-status-modal';

import { formatDate, getDiffTime } from '@/utils/date';

interface VehicleRowProps {
  vehicle: Vehicle;
}

const VehicleRow = ({ vehicle }: VehicleRowProps) => {
  const isAging = getDiffTime(vehicle.inventoryDate) > AGING_STOCK_DAYS;
  const formatInventoryDate = formatDate(
    vehicle.inventoryDate,
    DATE_FORMAT.PRIMARY,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogStatus = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 px-4 py-3 border-t border-border bg-card hover:bg-muted/50 transition-colors"
        role="row"
      >
        <div className="w-full sm:w-[30%] wrap-anywhere" role="cell">
          <span className="sm:hidden text-xs text-muted-foreground">VIN: </span>
          {vehicle.vin}
        </div>
        <div className="w-full sm:w-[15%]" role="cell">
          <span className="sm:hidden text-xs text-muted-foreground">
            Make:{' '}
          </span>
          {vehicle.make}
        </div>
        <div className="w-full sm:w-[15%]" role="cell">
          <span className="sm:hidden text-xs text-muted-foreground">
            Model:{' '}
          </span>
          {vehicle.model}
        </div>
        <div className="w-full sm:w-[15%]" role="cell">
          <span className="sm:hidden text-xs text-muted-foreground">
            In inventory since:{' '}
          </span>
          {formatInventoryDate}
        </div>
        <div className="w-full sm:w-[15%]" role="cell">
          {isAging ? (
            <Badge className="bg-warning text-warning-foreground hover:bg-warning">
              Aging stock
            </Badge>
          ) : (
            <Badge variant="secondary">In stock</Badge>
          )}
        </div>
        <div className="w-full sm:w-[19%] sm:text-right" role="cell">
          {isAging ? (
            <Button size="sm" variant="outline" onClick={handleLogStatus}>
              Log status
            </Button>
          ) : (
            <p className="text-sm">No action needed</p>
          )}
        </div>
      </div>
      {isModalOpen && (
        <LogStatusModal
          vehicle={vehicle}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </>
  );
};

export default VehicleRow;
