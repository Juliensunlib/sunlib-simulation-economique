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
          ? 'bg-[#e8f2fd] text-[#185FA5] border-[#b3d4f5] font-semibold'
          : 'bg-transparent text-gray-600 border-gray-300 hover:border-gray-400'
        }
      `}
    >
      {years} ans
    </button>
  );
}
