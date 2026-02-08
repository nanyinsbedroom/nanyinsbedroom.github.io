'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { Account } from '@/lib/types';
import styles from '@/styles/Chart.module.css';
import ClientOnly from '@/components/ClientOnly';
import { parseAllDateFormats } from '@/lib/formatters';
import { useTranslations } from '@/context/LanguageContext';

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>Year {data.payload.year}</p>
        <p>{data.value?.toLocaleString()} New Players</p>
      </div>
    );
  }
  return null;
};

export default function RegistrationChart({ accounts }: { accounts: Account[] }) {
  const t = useTranslations('Charts');
  const data = useMemo(() => {
    const counts: { [key: string]: number } = {};
    accounts.forEach(acc => {
      const date = parseAllDateFormats(acc.registered);
      if (date && !isNaN(date.getTime())) { // Ensure date is valid
        const year = date.getFullYear().toString();
        counts[year] = (counts[year] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([year, count]) => ({ year, "New Players": count }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [accounts]);

  return (
    <div className={styles.chartCard}>
      <h3>{t('newPlayersByYear')}</h3>
      <div className={styles.chartContainer}>
        <ClientOnly>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="year" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(35, 134, 54, 0.1)' }}
                content={<CustomTooltip />}
              />
              <Bar dataKey="New Players" fill="var(--accent-green)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ClientOnly>
      </div>
    </div>
  );
}