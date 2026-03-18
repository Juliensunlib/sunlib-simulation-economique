import { useState } from 'react';

interface SliderProps {
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  suffix?: string;
}

export function Slider({ label, value, displayValue, min, max, step, onChange, suffix = '' }: SliderProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    let numVal = parseFloat(inputValue);
    if (isNaN(numVal)) {
      numVal = value;
    } else {
      if (suffix === '%') {
        numVal = numVal / 100;
      }
      numVal = Math.max(min, Math.min(max, numVal));
    }
    setInputValue(numVal.toString());
    onChange(numVal);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (suffix === '%') {
      setInputValue((value * 100).toString());
    } else {
      setInputValue(value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-[13px] text-gray-600">
        <span>{label}</span>
      </div>
      <div className="flex gap-3 items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const newVal = parseFloat(e.target.value);
            onChange(newVal);
            if (!isFocused) {
              setInputValue(newVal.toString());
            }
          }}
          className="flex-1 h-1 accent-[#378ADD] cursor-pointer"
        />
        <div className="relative">
          <input
            type="text"
            value={isFocused ? inputValue : (suffix === '%' ? Math.round(value * 100) : value)}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="w-28 px-3 py-1.5 text-sm font-semibold text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#378ADD] focus:border-transparent"
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
