'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import styles from '@/styles/Chart.module.css';
import ClientOnly from '@/components/ClientOnly';

interface ChartData {
  date: string;
  "Active Players": number;
}

export default function MonthlyActiveChart({ data }: { data: ChartData[] }) {
  return (
    <div className={styles.chartCard}>
      <h3>Monthly Active Players</h3>
      <div className={styles.chartContainer}>
        <ClientOnly>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                contentStyle={{ backgroundColor: 'var(--background-light)', borderColor: 'var(--border-color)' }}
              />
              <Line type="monotone" dataKey="Active Players" stroke="var(--accent-blue)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ClientOnly>
      </div>
    </div>
  );
}