import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type Plugin
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { ChartMode, ScenarioResult } from '../types/simulator';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface ChartComponentProps {
  mode: ChartMode;
  duration: number;
  scenarioBV: ScenarioResult;
  scenarioPV: ScenarioResult;
  scenarioBP: ScenarioResult;
  hasBattery: boolean;
  visibleDatasets: {
    bv: boolean;
    pv: boolean;
    bp: boolean;
  };
}

export function ChartComponent({ mode, duration, scenarioBV, scenarioPV, scenarioBP, hasBattery, visibleDatasets }: ChartComponentProps) {
  const chartRef = useRef<ChartJS<'bar'>>(null);

  const isCumulative = mode === 'cumul';
  const labels = Array.from({ length: 25 }, (_, i) => `An ${i + 1}`);

  const datasets = [];

  if (visibleDatasets.pv) {
    datasets.push({
      label: 'PV Seul',
      data: isCumulative ? scenarioPV.cumulativeData : scenarioPV.yearlyData,
      backgroundColor: scenarioPV.colors,
      borderRadius: 4,
      borderSkipped: false as const
    });
  }

  if (visibleDatasets.bv) {
    datasets.push({
      label: 'PV+BV',
      data: isCumulative ? scenarioBV.cumulativeData : scenarioBV.yearlyData,
      backgroundColor: scenarioBV.colors,
      borderRadius: 4,
      borderSkipped: false as const
    });
  }

  if (hasBattery && visibleDatasets.bp) {
    datasets.push({
      label: 'PV+BP',
      data: isCumulative ? scenarioBP.cumulativeData : scenarioBP.yearlyData,
      backgroundColor: scenarioBP.colors,
      borderRadius: 4,
      borderSkipped: false as const
    });
  }

  const endLinePlugin: Plugin<'bar'> = {
    id: 'endLine',
    afterDraw: (chart) => {
      if (duration >= 25) return;

      const { ctx, scales: { x, y } } = chart;
      const xPos = x.getPixelForValue(duration - 0.5);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(xPos, y.top);
      ctx.lineTo(xPos, y.bottom);
      ctx.strokeStyle = '#DC3C3C';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#DC3C3C';
      ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Fin du contrat', xPos, y.top + 16);

      ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#666';
      ctx.fillText('(après: sans abonnement)', xPos, y.top + 32);
      ctx.restore();
    }
  };

  const zeroLinePlugin: Plugin<'bar'> = {
    id: 'zeroLine',
    afterDraw: (chart) => {
      const { ctx, scales: { x, y } } = chart;
      if (y.min < 0 && y.max > 0) {
        const yPos = y.getPixelForValue(0);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x.left, yPos);
        ctx.lineTo(x.right, yPos);
        ctx.strokeStyle = 'rgba(100,100,100,0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: (items) => {
            const year = parseInt(items[0].label.replace('An ', ''));
            return items[0].label + (year > duration ? ' (après contrat)' : ' (sous contrat)');
          },
          label: (context) => {
            const value = context.raw as number;
            return ' ' + context.dataset.label + ': ' + (value >= 0 ? '+' : '') + Math.round(value).toLocaleString('fr-FR') + ' €';
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#999',
          autoSkip: true,
          maxTicksLimit: 13,
          maxRotation: 0
        },
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          color: '#999',
          callback: (value) => {
            const v = typeof value === 'number' ? value : 0;
            const abs = Math.abs(v);
            const sign = v < 0 ? '-' : '+';
            return abs >= 1000 ? sign + Math.round(abs / 1000) + 'k€' : (v === 0 ? '0' : sign + abs + '€');
          }
        },
        grid: {
          color: 'rgba(0,0,0,0.06)'
        }
      }
    }
  };

  return (
    <div className="relative w-full h-[280px]">
      <Bar ref={chartRef} data={{ labels, datasets }} options={options} plugins={[zeroLinePlugin, endLinePlugin]} />
    </div>
  );
}
