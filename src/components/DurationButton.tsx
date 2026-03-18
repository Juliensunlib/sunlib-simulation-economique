interface DurationButtonProps {
  years: number;
  active: boolean;
  onClick: () => void;
}

export function DurationButton({ years, active, onClick }: DurationButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        py-1.5 text-[13px] border rounded-lg transition-all text-center
        ${active
          ? 'bg-gradient-to-r from-[#13A3AC] to-[#3CAE68] text-white border-[#13A3AC] font-semibold'
          : 'bg-transparent text-gray-600 border-gray-300 hover:border-[#13A3AC]'
        }
      `}
    >
      {years} ans
    </button>
  );
}
