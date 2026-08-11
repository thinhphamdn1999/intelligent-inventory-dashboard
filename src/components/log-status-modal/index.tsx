import { useState, type ChangeEvent } from 'react';

import { VEHICLE_STATUS_OPTIONS } from '@/constants/vehicle';

import type { Vehicle } from '@/types/vehicle';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/common/dialog/dialog';
import { Button } from '@/components/common/button/button';
import { Textarea } from '@/components/common/textarea/textarea';
import SelectFilter from '@/components/select-filter';

import { useLogVehicleStatus } from '@/hooks/use-vehicle';

interface LogStatusModalProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LogStatusModal = ({
  vehicle,
  open,
  onOpenChange,
}: LogStatusModalProps) => {
  const [status, setStatus] = useState(vehicle?.status ?? '');
  const [note, setNote] = useState(vehicle?.note ?? '');

  const { mutate, isPending } = useLogVehicleStatus();

  const handleSave = () => {
    if (!vehicle || !status) return;

    mutate(
      { id: vehicle.id, status, note },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isPending) onOpenChange(nextOpen);
  };

  const handleClose = () => {
    if (!isPending) onOpenChange(false);
  };

  const handleStatusChange = (value: string | null) => {
    setStatus(value ?? '');
  };

  const handleNoteChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value);
  };

  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md w-[90vw]">
        <DialogHeader>
          <DialogTitle>
            Log status — {vehicle.make} {vehicle.model}
          </DialogTitle>
          <DialogDescription>{vehicle.vin}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <SelectFilter
            label="Proposed action"
            options={VEHICLE_STATUS_OPTIONS}
            value={status}
            onChange={handleStatusChange}
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="status-note"
              className="text-sm font-medium text-muted-foreground"
            >
              Note
            </label>
            <Textarea
              id="status-note"
              value={note}
              onChange={handleNoteChange}
              placeholder="Add a note..."
              className="min-h-20"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!status || isPending}
          >
            {isPending ? 'Saving...' : 'Save status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogStatusModal;
