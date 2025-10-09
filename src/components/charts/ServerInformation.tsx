'use client';
import styles from '@/styles/Chart.module.css';
import ClientOnly from '@/components/ClientOnly';
import { useTranslations } from '@/context/LanguageContext';

type Server = {
    region: string;
    name: string;
    [key: string]: any;
};

export default function ServerInformation({ server }: { server: Server[] }) {
    const t = useTranslations('Charts');

    if (!server || server.length === 0) return <div className={styles.chartCard}><h3>{t('serverInformation')}</h3><div>No server data available.</div></div>;

    return (
        <div className={styles.chartCard}>
            <h3>{t('serverInformation')}</h3>
            <div className={styles.infoAndCharts}>
                <div className={styles.serverInfoSection}>
                    <ClientOnly>
                        <ul className={styles.serverInfoList}>
                            {server.map((srv, idx) => (
                                <li key={idx} className={styles.serverRegionItem}>
                                    <h2>{srv.region}{srv.name}</h2>
                                    <ul>
                                        {Object.entries(srv).map(([k, v]) =>
                                            (k !== 'region' && k !== 'name') ? (
                                                <li key={k}><strong>{k}:</strong> {v}</li>
                                            ) : null
                                        )}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </ClientOnly>
                </div>
            </div>
        </div>
    );
}