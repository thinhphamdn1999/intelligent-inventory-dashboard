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

export interface VehicleFilters {
  make?: string;
  model?: string;
  page?: number;
  limit?: number;
}

export interface VehicleListResponse {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: Vehicle[];
}

export interface LogVehicleStatusInput {
  id: string;
  status: string;
  note: string;
}
