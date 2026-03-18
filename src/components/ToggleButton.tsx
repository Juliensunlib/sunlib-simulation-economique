interface ToggleButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function ToggleButton({ label, active, onClick }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-1.5 text-[13px] border rounded-lg transition-all
        ${active
          ? 'bg-gradient-to-r from-[#13A3AC] to-[#3CAE68] text-white border-[#13A3AC] font-semibold'
          : 'bg-transparent text-gray-600 border-gray-300 hover:border-[#13A3AC]'
        }
      `}
    >
      {label}
    </button>
  );
}
