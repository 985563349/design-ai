'use client';

import * as material from 'material-colors';
import { ChromePicker, CirclePicker } from 'react-color';

const colors = [
  material.red['500'],
  material.pink['500'],
  material.purple['500'],
  material.deepPurple['500'],
  material.indigo['500'],
  material.blue['500'],
  material.lightBlue['500'],
  material.cyan['500'],
  material.teal['500'],
  material.green['500'],
  material.lightGreen['500'],
  material.lime['500'],
  material.yellow['500'],
  material.amber['500'],
  material.orange['500'],
  material.deepOrange['500'],
  material.brown['500'],
  material.blueGrey['500'],
  'transparent',
];

export interface ColorPickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-8">
      <ChromePicker
        className="border !rounded-lg !w-auto !shadow-none !overflow-hidden"
        color={value}
        onChange={(color) => onChange?.(color.hex)}
      />
      <CirclePicker
        className="!w-auto"
        color={value}
        colors={colors}
        onChangeComplete={(color) => onChange?.(color.hex)}
      />
    </div>
  );
};

export default ColorPicker;
