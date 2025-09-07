'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import styles from '@/styles/Chart.module.css';

interface TrendData {
  date: string;
  "Total Players": number;
}

export default function PlayerTrendChart({ data }: { data: TrendData[] }) {
  return (
    <div className={`${styles.chartCard} ${styles.trendChartCard}`}>
      <h3>Player Growth Over Time</h3>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} />
            <YAxis stroke="var(--text-secondary)" fontSize={12} />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
              contentStyle={{
                backgroundColor: 'var(--background-light)',
                borderColor: 'var(--border-color)',
              }}
            />
            <Line
              type="monotone"
              dataKey="Total Players"
              stroke="var(--accent-green)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}