'use client';

import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { CohortData } from '@/lib/cohortUtils';
import styles from '@/styles/StatisticsModal.module.css';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CohortData[];
  averageRetention: (number | null)[];
}

function getRetentionStyle(percentage: number | null): { emoji: string; color: string } {
  if (percentage === null || percentage === undefined) return { emoji: '⚪', color: 'var(--text-tertiary)' };
  if (percentage >= 70) return { emoji: '😀', color: 'var(--accent-green)' };
  if (percentage >= 40) return { emoji: '🙂', color: '#39c5cf' };
  if (percentage >= 20) return { emoji: '😐', color: 'var(--accent-orange)' };
  return { emoji: '😢', color: '#db61a2' };
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const month = payload[0].payload.month;
    const cohortValue = payload.find(p => p.dataKey === 'cohortValue');
    const averageValue = payload.find(p => p.dataKey === 'averageValue');
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>Month {month}</p>
        {cohortValue && <p>Cohort: <strong>{cohortValue.value}%</strong></p>}
        {averageValue && <p>Average: <strong>{averageValue.value}%</strong></p>}
      </div>
    );
  }
  return null;
};

export default function StatisticsModal({ isOpen, onClose, data, averageRetention }: StatisticsModalProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          <h3>Detailed Player Retention</h3>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close modal"><FaTimes size={20} /></button>
        </header>
        <div className={styles.modalBody}>
          <p className={styles.modalDescription}>
            This chart analyzes cohorts based on their registration month. It shows key retention milestones and a 12-month survival curve (solid purple line) for each group compared to the all-time average (solid green line).
          </p>
          <div className={styles.detailGrid}>
            <div className={styles.gridHeader}>
              <div>Cohort</div>
              <div>Month 1</div>
              <div>Month 3</div>
              <div>Month 6</div>
              <div>Retention Trend (vs. Average)</div>
            </div>

            {data.map(({ cohortMonth, totalPlayers, retention }) => {
              const chartData = Array.from({ length: 12 }, (_, i) => ({
                month: i + 1,
                cohortValue: retention[i + 1] ?? null,
                averageValue: averageRetention[i + 1] ?? null,
              }));

              const m1 = getRetentionStyle(retention[1]);
              const m3 = getRetentionStyle(retention[3]);
              const m6 = getRetentionStyle(retention[6]);

              return (
                <div key={cohortMonth} className={styles.cohortRow}>
                  <div>
                    <div className={styles.cohortInfo}>{cohortMonth}</div>
                    <div className={styles.cohortTotal}>{totalPlayers.toLocaleString()} players</div>
                  </div>
                  <div className={styles.milestone}>
                    <span className={styles.milestoneEmoji}>{m1.emoji}</span>
                    <span className={styles.milestoneValue} style={{ color: m1.color }}>{retention[1]?.toFixed(1) ?? '–'}%</span>
                  </div>
                  <div className={styles.milestone}>
                    <span className={styles.milestoneEmoji}>{m3.emoji}</span>
                    <span className={styles.milestoneValue} style={{ color: m3.color }}>{retention[3]?.toFixed(1) ?? '–'}%</span>
                  </div>
                  <div className={styles.milestone}>
                    <span className={styles.milestoneEmoji}>{m6.emoji}</span>
                    <span className={styles.milestoneValue} style={{ color: m6.color }}>{retention[6]?.toFixed(1) ?? '–'}%</span>
                  </div>
                  <div className={styles.sparklineCell}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData}>
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--brand-muted)', strokeDasharray: '3 3' }} />
                        <XAxis dataKey="month" hide />
                        <YAxis hide domain={[0, 100]} />
                        <Line 
                          dataKey="averageValue" 
                          stroke="var(--accent-green)" 
                          strokeWidth={2} 
                          dot={false} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="cohortValue" 
                          stroke="var(--brand-glow)" 
                          strokeWidth={2} 
                          dot={false} 
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}