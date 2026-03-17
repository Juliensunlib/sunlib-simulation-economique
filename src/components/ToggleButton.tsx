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
          ? 'bg-[#e8f2fd] text-[#185FA5] border-[#b3d4f5] font-semibold'
          : 'bg-transparent text-gray-600 border-gray-300 hover:border-gray-400'
        }
      `}
    >
      {label}
    </button>
  );
}
