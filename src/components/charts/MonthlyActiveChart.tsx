'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, TooltipProps } from 'recharts';
import styles from '@/styles/Chart.module.css';
import ClientOnly from '@/components/ClientOnly';
import { useTranslations } from '@/context/LanguageContext';

interface ChartData {
  date: string;
  "Active Players": number;
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{data.payload.date}</p>
        <p>{data.value?.toLocaleString()} Active Players</p>
      </div>
    );
  }
  return null;
};

export default function MonthlyActiveChart({ data }: { data: ChartData[] }) {
  const t = useTranslations('Charts');
  return (
    <div className={styles.chartCard}>
      <h3>{t('monthlyActivePlayers')}</h3>
      <div className={styles.chartContainer}>
        <ClientOnly>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={'rgba(55, 65, 81, 0.6)'} />
              <XAxis 
                dataKey="date" 
                stroke="var(--text-tertiary)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="var(--text-tertiary)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }}
                content={<CustomTooltip />}
              />
              <Line 
                type="monotone" 
                dataKey="Active Players" 
                stroke="var(--brand-glow)" 
                strokeWidth={2} 
                dot={data.length === 1}
                activeDot={{ r: 6, stroke: 'var(--brand-glow)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ClientOnly>
      </div>
    </div>
  );
}