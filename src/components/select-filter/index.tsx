import type { SelectOption } from '@/types/select';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/select/select';

interface SelectFilterProps {
  label: string;
  placeholder?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string | null) => void;
  disabled?: boolean;
}

const SelectFilter = ({
  label,
  value,
  options,
  placeholder = 'Select an option',
  disabled = false,
  onChange,
}: SelectFilterProps) => {
  const handleChange = (val: string | null) => {
    onChange(val);
  };

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center w-full">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <Select
        value={value || ''}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full sm:w-45">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectFilter;
