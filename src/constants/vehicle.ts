export const AGING_STOCK_DAYS = 90;

export const VEHICLE_STATUS_OPTIONS = [
  { value: 'Price reduction planned', label: 'Price reduction planned' },
  { value: 'Featured in weekend promo', label: 'Featured in weekend promo' },
  {
    value: 'Transfer to another dealership',
    label: 'Transfer to another dealership',
  },
  {
    value: 'Additional marketing scheduled',
    label: 'Additional marketing scheduled',
  },
  { value: 'Wholesale under review', label: 'Wholesale under review' },
  { value: 'No action needed', label: 'No action needed' },
];

export type VehicleStatusValue =
  (typeof VEHICLE_STATUS_OPTIONS)[number]['value'];
