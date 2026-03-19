import { formatNumber } from '../utils/calculations';

interface MetricCardProps {
  title: string;
  totalSavings: number;
  breakEvenYear: number | null;
  duration: number;
  dimmed?: boolean;
}

export function MetricCard({ title, totalSavings, breakEvenYear, duration, dimmed = false }: MetricCardProps) {
  const isPositive = totalSavings >= 0;

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-xl p-3.5 ${dimmed ? 'opacity-35' : ''}`}>
      <div className="text-[11px] text-gray-500 uppercase tracking-wide mb-1.5">{title}</div>
      <div className={`text-xl font-semibold ${isPositive ? 'text-[#1D9E75]' : 'text-[#D85A30]'}`}>
        {isPositive ? '+' : ''}{formatNumber(totalSavings)} €
      </div>
      <div className="text-xs text-gray-500 mt-0.5">À fin contrat (an {duration})</div>
      {breakEvenYear ? (
        <div className="inline-block text-[11px] px-2 py-0.5 rounded bg-[#edfaf4] text-[#0f6e56] mt-1.5">
          Économie en année {breakEvenYear}
        </div>
      ) : (
        <div className="inline-block text-[11px] px-2 py-0.5 rounded bg-[#fdf0ec] text-[#D85A30] mt-1.5">
          Pas d'économie sur {duration} ans
        </div>
      )}
    </div>
  );
}
