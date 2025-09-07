'use client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import styles from '@/styles/Chart.module.css';

interface CrewData {
  name: string;
  players: number;
}

export default function TopCrewsChart({ data }: { data: CrewData[] }) {
  return (
    <div className={`${styles.chartCard} ${styles.topCrewsCard}`}>
      <h3>Top 5 Crews</h3>
      <div className={styles.chartContainer}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                stroke="var(--text-secondary)"
                fontSize={12}
                width={80}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                contentStyle={{ backgroundColor: 'var(--background-light)', borderColor: 'var(--border-color)' }}
              />
              <Bar dataKey="players" fill="var(--accent-blue)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className={styles.noData}>No crew data to display.</div>
        )}
      </div>
    </div>
  );
}