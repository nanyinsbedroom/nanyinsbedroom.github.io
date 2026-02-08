'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, TooltipProps } from 'recharts';
import { CrewActivity } from '@/lib/playerUtils';
import styles from '@/styles/Chart.module.css';
import ClientOnly from '@/components/ClientOnly';
import { useTranslations } from '@/context/LanguageContext';

const COLORS = [
  'var(--brand-glow)',
  'var(--accent-green)',
  'var(--accent-pink)',
  'var(--accent-orange)',
  '#39c5cf'
];

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CrewActivity;
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{data.name}</p>
        <p>Avg. Last Seen: <strong>{data.activityScore.toFixed(1)} days ago</strong></p>
        <p>Members: <strong>{data.memberCount}</strong></p>
      </div>
    );
  }
  return null;
};

interface TopCrewsChartProps {
  data: CrewActivity[];
}

export default function TopCrewsByActivityChart({ data }: TopCrewsChartProps) {
  const t = useTranslations('Sidebar');
  const chartData = data.slice(0, 5).reverse();

  return (
    <div className={styles.chartCard}>
      <h3>{t('activeCrews')}</h3>
      <div className={styles.chartContainer}>
        <ClientOnly>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                  interval={0}
                  stroke="var(--text-secondary)"
                />
                <Tooltip
                  cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }}
                  content={<CustomTooltip />}
                />
                <Bar dataKey="memberCount" radius={[0, 4, 4, 0]} background={{ fill: 'rgba(255,255,255,0.05)' }}>
                  {chartData.map((_entry, index) => (
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