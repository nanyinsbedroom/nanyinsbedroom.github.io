'use client';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Account } from '@/lib/types';
import styles from '@/styles/Chart.module.css';
import ClientOnly from '@/components/ClientOnly';

const COLORS = ['var(--accent-cyan)', 'var(--accent-pink)'];

// ... (rest of the component is the same, but provided for completeness)
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
          <ClientOnly>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={{ backgroundColor: 'var(--background-light)', borderColor: 'var(--border-color)' }} />
                <Pie data={data} dataKey="value" cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={80} paddingAngle={5}>
                  {data.map((entry, index) => (
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