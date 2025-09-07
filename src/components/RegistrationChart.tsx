'use client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Account } from '@/lib/types';
import styles from '@/styles/Chart.module.css';
import { useMemo } from 'react';

export default function RegistrationChart({ accounts }: { accounts: Account[] }) {
  // Memoize data calculation for the chart.
  const data = useMemo(() => {
    const counts: { [key: string]: number } = {};
    accounts.forEach(acc => {
      const year = new Date(acc.registered).getFullYear().toString();
      if (!counts[year]) counts[year] = 0;
      counts[year]++;
    });
    return Object.entries(counts)
      .map(([year, count]) => ({ year, "New Players": count }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [accounts]);

  return (
    <div className={styles.chartCard}>
      <h3>New Players by Year</h3>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <XAxis dataKey="year" stroke="var(--text-secondary)" fontSize={12} />
            <YAxis stroke="var(--text-secondary)" fontSize={12} />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
              contentStyle={{ backgroundColor: 'var(--background-light)', borderColor: 'var(--border-color)' }}
            />
            <Bar dataKey="New Players" fill="var(--accent-green)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}