'use client';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';
import { Account } from '@/lib/types';
import styles from '@/styles/Chart.module.css';
import ClientOnly from '@/components/ClientOnly';
import { useTranslations } from '@/context/LanguageContext';

const COLORS = ['var(--brand-glow)', 'var(--accent-pink)'];

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{data.name}: {data.value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
    if (percent < 0.05) return null;
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="600">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
};

export default function GenderChart({ accounts }: { accounts: Account[] }) {
  const t = useTranslations('Charts');
  const tFilters = useTranslations('Filters');
  const data = useMemo(() => {
    const maleCount = accounts.filter(acc => acc.gender === 0).length;
    const femaleCount = accounts.length - maleCount;
    return [
      { name: tFilters('male'), value: maleCount },
      { name: tFilters('female'), value: femaleCount },
    ];
  }, [accounts, tFilters]);

  return (
    <div className={styles.chartCard}>
      <h3>{t('genderDistribution')}</h3>
      <div className={styles.chartContainer}>
        <ClientOnly>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie data={data} dataKey="value" cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={80}>
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ClientOnly>
      </div>
    </div>
  );
}