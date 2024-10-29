import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface InputNumberProps {
  value: number;
  onChange: (value: number) => void;
}

const InputNumber: React.FC<InputNumberProps> = ({ value, onChange }) => {
  const increment = () => onChange(value + 1);

  const decrement = () => onChange(value - 1);

  return (
    <div className="flex items-center">
      <Button className="rounded-r-none border-r-0 size-8" variant="outline" size="icon" onClick={decrement}>
        <Minus />
      </Button>

      <Input
        className="rounded-none w-12 h-8 focus-visible:ring-offset-0 focus-visible:ring-0"
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />

      <Button className="rounded-l-none border-l-0 size-8" variant="outline" size="icon" onClick={increment}>
        <Plus />
      </Button>
    </div>
  );
};

export default InputNumber;
