export type VehicleStatus = string | null;

export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  inventoryDate: string;
  price: number;
  status: VehicleStatus;
  note: string | null;
}
