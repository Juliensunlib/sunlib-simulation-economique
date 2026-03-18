export type ClientType = 'Particulier' | 'Pro';
export type ContractType = 'Fixe' | 'Variable';
export type Duration = 10 | 15 | 20 | 25;
export type BatteryDuration = 10 | 15;
export type ChartMode = 'cumul' | 'annuel';

export interface SimulatorParams {
  clientType: ClientType;
  contractType: ContractType;
  duration: Duration;
  batteryDuration: BatteryDuration;
  installPrice: number;
  batteryPrice: number;
  batteryCapacity: number;
  peakPower: number;
  initialPayment: number;
  annualConsumption: number;
  pvgisProduction: number;
  avgKwhPrice: number;
  autoConsoRate: number;
}

export interface Subscription {
  monthly: number;
  monthlyHT: number;
  annual: number;
}

export interface ScenarioResult {
  totalSavings: number;
  breakEvenYear: number | null;
  yearlyData: number[];
  cumulativeData: number[];
  colors: string[];
}

export interface YearBreakdown {
  directConsumption: number;
  virtualBatteryOrResale: number;
  subscriptionCost: number;
  batteryCost: number;
  netSavings: number;
}

export interface Results {
  subscriptionPV: Subscription | null;
  subscriptionBattery: Subscription | null;
  scenarioBV: ScenarioResult;
  scenarioPV: ScenarioResult;
  scenarioBP: ScenarioResult;
  breakdownBV: YearBreakdown;
  breakdownPV: YearBreakdown;
  breakdownBP: YearBreakdown;
  outOfRange: boolean;
}
