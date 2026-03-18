import { Printer } from 'lucide-react';

interface PrintButtonProps {
  onClick: () => void;
}

export function PrintButton({ onClick }: PrintButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#13A3AC] to-[#3CAE68] text-white rounded-lg font-medium text-sm transition-all hover:shadow-lg hover:scale-105 active:scale-100"
    >
      <Printer className="w-4 h-4" />
      Imprimer
    </button>
  );
}
