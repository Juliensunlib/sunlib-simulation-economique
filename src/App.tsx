import { useState, useMemo } from 'react';
import type { ClientType, ContractType, Duration, BatteryDuration, ChartMode, SimulatorParams } from './types/simulator';
import { calculateResults, formatNumber, formatCurrency } from './utils/calculations';
import { Slider } from './components/Slider';
import { ToggleButton } from './components/ToggleButton';
import { DurationButton } from './components/DurationButton';
import { SubscriptionCard } from './components/SubscriptionCard';
import { MetricCard } from './components/MetricCard';
import { ChartComponent } from './components/Chart';
import { DecompositionCard } from './components/DecompositionCard';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

function App() {
  const [clientType, setClientType] = useState<ClientType>('Particulier');
  const [contractType, setContractType] = useState<ContractType>('Fixe');
  const [duration, setDuration] = useState<Duration>(25);
  const [batteryDuration, setBatteryDuration] = useState<BatteryDuration>(10);
  const [installPrice, setInstallPrice] = useState(6290);
  const [batteryPrice, setBatteryPrice] = useState(2500);
  const [batteryCapacity, setBatteryCapacity] = useState(5);
  const [peakPower, setPeakPower] = useState(3);
  const [initialPayment, setInitialPayment] = useState(0);
  const [annualConsumption, setAnnualConsumption] = useState(10000);
  const [pvgisProduction, setPvgisProduction] = useState(1033);
  const [avgKwhPrice, setAvgKwhPrice] = useState(0.194);
  const [autoConsoRate, setAutoConsoRate] = useState(0.40);
  const [chartMode, setChartMode] = useState<ChartMode>('cumul');
  const [visibleDatasets, setVisibleDatasets] = useState({
    bv: true,
    pv: true,
    bp: true
  });

  const toggleDataset = (dataset: 'bv' | 'pv' | 'bp') => {
    setVisibleDatasets(prev => ({
      ...prev,
      [dataset]: !prev[dataset]
    }));
  };

  const params: SimulatorParams = {
    clientType,
    contractType,
    duration,
    batteryDuration,
    installPrice,
    batteryPrice,
    batteryCapacity,
    peakPower,
    initialPayment,
    annualConsumption,
    pvgisProduction,
    avgKwhPrice,
    autoConsoRate
  };

  const results = useMemo(() => calculateResults(params), [params]);
  const hasBattery = batteryPrice > 0;
  const tvaLabel = clientType === 'Particulier' ? 'TTC' : 'HT';
  const showHT = clientType === 'Particulier';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13A3AC] to-[#3CAE68] py-6 px-4">
      <div className="max-w-[960px] mx-auto bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <svg viewBox="0 0 100 100" className="w-16 h-16" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sunlibGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#13A3AC', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#60B830', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="25" fill="url(#sunlibGradient)" />
            <path d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50 M20 20 L28 28 M72 72 L80 80 M20 80 L28 72 M72 28 L80 20"
                  stroke="url(#sunlibGradient)" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div>
            <h1 className="text-xl font-semibold mb-1 bg-gradient-to-r from-[#13A3AC] to-[#60B830] bg-clip-text text-transparent">
              Calculatrice SunLib
            </h1>
            <p className="text-[13px] text-gray-500">Comparez les 3 scénarios d'abonnement sur 25 ans</p>
          </div>
        </div>

        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-5 mb-2.5">
          Profil client & contrat
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
          <div>
            <div className="text-xs text-gray-500 mb-1.5">Type de client</div>
            <div className="flex gap-1.5">
              <ToggleButton label="Particulier" active={clientType === 'Particulier'} onClick={() => setClientType('Particulier')} />
              <ToggleButton label="Entreprise" active={clientType === 'Pro'} onClick={() => setClientType('Pro')} />
            </div>
            <div className="text-[11px] text-gray-400 mt-1.5">
              {clientType === 'Particulier' ? 'Prix affichés TTC (TVA 20%)' : 'Prix affichés HT'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1.5">Type de contrat</div>
            <div className="flex gap-1.5">
              <ToggleButton label="Fixe" active={contractType === 'Fixe'} onClick={() => setContractType('Fixe')} />
              <ToggleButton label="Variable" active={contractType === 'Variable'} onClick={() => setContractType('Variable')} />
            </div>
          </div>
        </div>

        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-5 mb-2.5">
          Installation photovoltaïque
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
          <Slider
            label="Prix installation PV (HT)"
            value={installPrice}
            displayValue={formatNumber(installPrice) + ' €'}
            min={3000}
            max={50000}
            step={100}
            onChange={setInstallPrice}
            suffix="€"
          />
          <Slider
            label="Prix batterie physique (HT)"
            value={batteryPrice}
            displayValue={batteryPrice === 0 ? 'Aucune' : formatNumber(batteryPrice) + ' €'}
            min={0}
            max={15000}
            step={100}
            onChange={setBatteryPrice}
            suffix="€"
          />
          {hasBattery && (
            <Slider
              label="Capacité batterie (kWh)"
              value={batteryCapacity}
              displayValue={formatNumber(batteryCapacity) + ' kWh'}
              min={1}
              max={20}
              step={0.5}
              onChange={setBatteryCapacity}
              suffix="kWh"
            />
          )}
          <Slider
            label="Puissance crête"
            value={peakPower}
            displayValue={peakPower + ' kWc'}
            min={1}
            max={200}
            step={0.5}
            onChange={setPeakPower}
            suffix="kWc"
          />
          <Slider
            label="Versement initial (HT)"
            value={initialPayment}
            displayValue={formatNumber(initialPayment) + ' €'}
            min={0}
            max={10000}
            step={100}
            onChange={setInitialPayment}
            suffix="€"
          />
        </div>

        <div className="mb-4">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-0 mb-2.5">
            Durée abonnement PV
          </div>
          <div className="grid grid-cols-4 gap-2 max-w-[380px]">
            {[10, 15, 20, 25].map((d) => (
              <DurationButton
                key={d}
                years={d}
                active={duration === d}
                onClick={() => setDuration(d as Duration)}
              />
            ))}
          </div>
        </div>

        {hasBattery && (
          <div className="mb-4">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-0 mb-2.5">
              Durée abonnement Batterie
            </div>
            <div className="grid grid-cols-2 gap-2 max-w-[190px]">
              {[10, 15].map((d) => (
                <DurationButton
                  key={d}
                  years={d}
                  active={batteryDuration === d}
                  onClick={() => setBatteryDuration(d as BatteryDuration)}
                />
              ))}
            </div>
          </div>
        )}

        {results.outOfRange && (
          <div className="bg-[#fdf0ec] border border-[#f5c9b8] text-[#c04a20] rounded-xl px-3.5 py-2.5 text-xs mb-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Prix HT dépasse le plafond autorisé pour cette puissance — Hors tarif SunLib</span>
          </div>
        )}

        {hasBattery && batteryCapacity > 0 && (batteryPrice / batteryCapacity) > 1000 && (
          <div className="bg-[#fdf0ec] border border-[#f5c9b8] text-[#c04a20] rounded-xl px-3.5 py-2.5 text-xs mb-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Prix de la batterie ({formatNumber(batteryPrice / batteryCapacity)} €/kWh) dépasse le maximum autorisé (1000 €/kWh)</span>
          </div>
        )}

        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-5 mb-2.5">
          Abonnements calculés
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <SubscriptionCard
            title="Abonnement PV mensuel"
            subscription={results.subscriptionPV}
            subtitle="Identique pour PV Seul et PV+BV"
            tvaLabel={tvaLabel}
            showHT={showHT}
            outOfRange={results.outOfRange}
          />
          <SubscriptionCard
            title="Batt. Physique mensuel"
            subscription={results.subscriptionBattery}
            subtitle={
              hasBattery && results.subscriptionBattery
                ? `${formatNumber(results.subscriptionBattery.annual)} € · durée ${batteryDuration} ans`
                : 'Aucune batterie physique'
            }
            tvaLabel={tvaLabel}
            showHT={showHT}
            dimmed={!hasBattery}
          />
        </div>

        <div className="bg-[#edfaf4] border border-[#b6e8d0] rounded-xl px-3.5 py-2.5 text-xs text-[#0f6e56] mb-4 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Batterie Virtuelle</strong> : énergie stockée rachetée à <strong>0,10 €/kWh</strong> vs prix réseau → économie nette garantie, sans frais fixes.
          </span>
        </div>

        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-5 mb-2.5">
          Paramètres rentabilité client
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
          <Slider
            label="Consommation annuelle"
            value={annualConsumption}
            displayValue={formatNumber(annualConsumption) + ' kWh'}
            min={2000}
            max={200000}
            step={1000}
            onChange={setAnnualConsumption}
            suffix="kWh"
          />
          <Slider
            label="Productible PVGIS / kWc"
            value={pvgisProduction}
            displayValue={formatNumber(pvgisProduction) + ' kWh'}
            min={700}
            max={1500}
            step={10}
            onChange={setPvgisProduction}
            suffix="kWh"
          />
          <Slider
            label="Prix moyen kWh client"
            value={avgKwhPrice}
            displayValue={avgKwhPrice.toFixed(3).replace('.', ',') + ' €'}
            min={0.10}
            max={0.30}
            step={0.005}
            onChange={setAvgKwhPrice}
            suffix="€"
          />
          <Slider
            label="Taux autoconso directe"
            value={autoConsoRate}
            displayValue={Math.round(autoConsoRate * 100) + ' %'}
            min={0.20}
            max={1.00}
            step={0.05}
            onChange={setAutoConsoRate}
            suffix="%"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-5">
          <MetricCard
            title="PV + Batt. Virtuelle"
            totalSavings={results.scenarioBV.totalSavings}
            breakEvenYear={results.scenarioBV.breakEvenYear}
            duration={duration}
          />
          <MetricCard
            title="PV Seul"
            totalSavings={results.scenarioPV.totalSavings}
            breakEvenYear={results.scenarioPV.breakEvenYear}
            duration={duration}
          />
          <MetricCard
            title="PV + Batt. Physique"
            totalSavings={results.scenarioBP.totalSavings}
            breakEvenYear={results.scenarioBP.breakEvenYear}
            duration={duration}
            dimmed={!hasBattery}
          />
        </div>

        {duration < 25 && (
          <div className="bg-[#eef5fd] border border-[#c5ddf7] rounded-xl px-3.5 py-2 text-xs text-[#185FA5] mb-2.5">
            ℹ️ Contrat {duration} ans — après l'an {duration}, l'abonnement tombe à zéro : autoconso pure, les économies s'accélèrent.
          </div>
        )}

        <div className="flex gap-1.5 mb-2.5">
          <button
            onClick={() => setChartMode('cumul')}
            className={`px-3 py-1 text-xs border rounded-lg transition-all ${
              chartMode === 'cumul'
                ? 'bg-gradient-to-r from-[#13A3AC] to-[#3CAE68] text-white border-[#13A3AC] font-semibold'
                : 'bg-transparent text-gray-500 border-gray-300 hover:border-[#13A3AC]'
            }`}
          >
            Économies cumulées
          </button>
          <button
            onClick={() => setChartMode('annuel')}
            className={`px-3 py-1 text-xs border rounded-lg transition-all ${
              chartMode === 'annuel'
                ? 'bg-gradient-to-r from-[#13A3AC] to-[#3CAE68] text-white border-[#13A3AC] font-semibold'
                : 'bg-transparent text-gray-500 border-gray-300 hover:border-[#13A3AC]'
            }`}
          >
            Économies annuelles
          </button>
        </div>

        <div className="flex flex-wrap gap-3.5 text-xs text-gray-500 mb-2.5">
          <button
            onClick={() => toggleDataset('bv')}
            className={`flex items-center gap-1.5 cursor-pointer hover:opacity-75 transition-opacity ${!visibleDatasets.bv ? 'opacity-35' : ''}`}
          >
            <span className="w-3 h-3 rounded bg-[#13A3AC] flex-shrink-0"></span>
            PV + Batt. Virtuelle
          </button>
          <button
            onClick={() => toggleDataset('pv')}
            className={`flex items-center gap-1.5 cursor-pointer hover:opacity-75 transition-opacity ${!visibleDatasets.pv ? 'opacity-35' : ''}`}
          >
            <span className="w-3 h-3 rounded bg-[#60B830] flex-shrink-0"></span>
            PV Seul
          </button>
          <button
            onClick={() => toggleDataset('bp')}
            className={`flex items-center gap-1.5 cursor-pointer hover:opacity-75 transition-opacity ${!hasBattery || !visibleDatasets.bp ? 'opacity-35' : ''}`}
            disabled={!hasBattery}
          >
            <span className="w-3 h-3 rounded bg-[#0EA3B4] flex-shrink-0"></span>
            PV + Batt. Physique
          </button>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-gray-300 flex-shrink-0"></span>
            Après fin contrat
          </span>
        </div>

        <ChartComponent
          mode={chartMode}
          duration={duration}
          scenarioBV={results.scenarioBV}
          scenarioPV={results.scenarioPV}
          scenarioBP={results.scenarioBP}
          hasBattery={hasBattery}
          visibleDatasets={visibleDatasets}
        />

        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-4 mb-2.5">
          Décomposition des économies — année 1
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <DecompositionCard
            title="PV + Batt. Virtuelle"
            color="#13A3AC"
            breakdown={results.breakdownBV}
            labels={{
              direct: `Autoconso directe (${Math.round(autoConsoRate * 100)}%)`,
              secondary: 'Énergie BV à 0,10 €/kWh'
            }}
          />
          <DecompositionCard
            title="PV Seul"
            color="#60B830"
            breakdown={results.breakdownPV}
            labels={{
              direct: 'Autoconso directe',
              secondary: 'Revente surplus (0,04 €/kWh)'
            }}
          />
          <DecompositionCard
            title="PV + Batt. Physique"
            color="#0EA3B4"
            breakdown={results.breakdownBP}
            labels={{
              direct: 'Autoconso directe (65%)',
              secondary: 'Revente surplus (0,04 €/kWh)',
              battery: true
            }}
            dimmed={!hasBattery}
          />
        </div>

        <p className="text-[11px] text-gray-400 text-center mt-4">
          Graphique toujours sur 25 ans · Après fin de contrat : autoconso pure sans abonnement · Évolution TRVE réelle · Abonnement +1,5 %/an · Revente surplus 0,04 €/kWh
        </p>
      </div>
    </div>
  );
}

export default App;
