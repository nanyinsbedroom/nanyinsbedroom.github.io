'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from '@/styles/Chart.module.css';
import ClientOnly from '@/components/ClientOnly';

const COLORS = ['var(--accent-blue)', 'var(--accent-purple)', 'var(--accent-cyan)', 'var(--accent-orange)', 'var(--accent-pink)'];

interface CrewData { name: string; players: number; }

export default function TopCrewsChart({ data }: { data: CrewData[] }) {
  return (
    <div className={styles.chartCard}>
      <h3>Top 5 Crews</h3>
      <div className={styles.chartContainer}>
        <ClientOnly>
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={80} tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} interval={0} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--background-light)', borderColor: 'var(--border-color)' }} />
                <Bar dataKey="players" radius={[0, 4, 4, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.noData}>No crew data to display</div>
          )}
        </ClientOnly>
      </div>
    </div>
  );
}