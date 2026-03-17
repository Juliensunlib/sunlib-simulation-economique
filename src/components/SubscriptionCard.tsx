import type { Subscription } from '../types/simulator';
import { formatCurrency, formatNumber } from '../utils/calculations';

interface SubscriptionCardProps {
  title: string;
  subscription: Subscription | null;
  subtitle?: string;
  tvaLabel: string;
  showHT: boolean;
  outOfRange?: boolean;
  dimmed?: boolean;
}

export function SubscriptionCard({
  title,
  subscription,
  subtitle,
  tvaLabel,
  showHT,
  outOfRange = false,
  dimmed = false
}: SubscriptionCardProps) {
  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex flex-col gap-1 ${dimmed ? 'opacity-35' : ''}`}>
      <div className="text-[11px] text-gray-500 uppercase tracking-wide">
        {title}{' '}
        <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-[#e8f2fd] text-[#185FA5] font-semibold ml-1 align-middle">
          {tvaLabel}
        </span>
      </div>
      {outOfRange ? (
        <div className="text-lg font-semibold text-[#D85A30]">Hors tarif</div>
      ) : subscription ? (
        <>
          <div className="text-lg font-semibold text-gray-900">
            {formatCurrency(subscription.monthly)}/mois
          </div>
          {showHT && (
            <div className="text-xs text-gray-400">
              {formatCurrency(subscription.monthlyHT)} HT/mois
            </div>
          )}
          <div className="text-[11px] text-gray-400">
            {subtitle || `${formatNumber(subscription.annual)} €/an`}
          </div>
        </>
      ) : (
        <div className="text-lg font-semibold text-gray-900">—</div>
      )}
    </div>
  );
}
