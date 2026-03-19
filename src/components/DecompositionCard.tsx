import type { YearBreakdown } from '../types/simulator';
import { formatSavings } from '../utils/calculations';

interface DecompositionCardProps {
  title: string;
  color: string;
  breakdown: YearBreakdown;
  labels: {
    direct: string;
    secondary: string;
    subscription?: boolean;
    battery?: boolean;
    batteryBoostPercent?: string;
  };
  dimmed?: boolean;
}

export function DecompositionCard({ title, color, breakdown, labels, dimmed = false }: DecompositionCardProps) {
  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-xl p-3 ${dimmed ? 'opacity-35' : ''}`}>
      <div className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color }}>
        {title}
      </div>

      <div className="flex justify-between text-xs py-1 border-b border-gray-200">
        <span>{labels.direct}</span>
        <span className="text-[#1D9E75]">{formatSavings(breakdown.directConsumption)}</span>
      </div>

      {breakdown.batteryBoostConsumption !== undefined && breakdown.batteryBoostConsumption > 0 && labels.batteryBoostPercent && (
        <div className="flex justify-between text-xs py-1 border-b border-gray-200">
          <span>Gain autoconso batterie ({labels.batteryBoostPercent})</span>
          <span className="text-[#1D9E75]">{formatSavings(breakdown.batteryBoostConsumption)}</span>
        </div>
      )}

      <div className="flex justify-between text-xs py-1 border-b border-gray-200">
        <span>{labels.secondary}</span>
        <span className="text-[#1D9E75]">{formatSavings(breakdown.virtualBatteryOrResale)}</span>
      </div>

      {labels.battery && (
        <div className="flex justify-between text-xs py-1 border-b border-gray-200">
          <span>Abonnement batterie</span>
          <span className="text-[#D85A30]">{formatSavings(breakdown.batteryCost)}</span>
        </div>
      )}

      {(labels.subscription || labels.subscription === undefined) && (
        <div className="flex justify-between text-xs py-1 border-b border-gray-200">
          <span>Abonnement PV</span>
          <span className="text-[#D85A30]">{formatSavings(breakdown.subscriptionCost)}</span>
        </div>
      )}

      <div className="flex justify-between text-[13px] font-bold pt-1 mt-1">
        <span>Net an 1</span>
        <span style={{ color: breakdown.netSavings >= 0 ? '#1D9E75' : '#D85A30' }}>
          {formatSavings(breakdown.netSavings)}
        </span>
      </div>
    </div>
  );
}
