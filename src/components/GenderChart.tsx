'use client';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Account } from '@/lib/types';
import styles from '@/styles/Chart.module.css';
import { useMemo } from 'react';

const COLORS = ['#58a6ff', '#e573e0']; // Blue and Pink
const RADIAN = Math.PI / 180;

// Renders custom percentage labels inside the pie chart slices.
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Avoid rendering labels for very small slices.
  if (percent < 0.05) return null;

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="600">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function GenderChart({ accounts }: { accounts: Account[] }) {
  // Memoize data calculation for the chart.
  const data = useMemo(() => {
    const maleCount = accounts.filter(acc => acc.gender === 0).length;
    const femaleCount = accounts.length - maleCount;
    return [
      { name: 'Male', value: maleCount },
      { name: 'Female', value: femaleCount },
    ];
  }, [accounts]);

  return (
    <div className={styles.chartCard}>
      <h3>Gender Distribution</h3>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}