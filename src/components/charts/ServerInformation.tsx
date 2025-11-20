'use client';
import styles from '@/styles/Chart.module.css';
import ClientOnly from '@/components/ClientOnly';
import { useTranslations } from '@/context/LanguageContext';

type Server = {
    name: string;
    ip: string;
    country_name: string;
    region_name: string;
    district: string;
    city_name: string;
    zip_code: string;
    latitude: number;
    longitude: number;
    time_zone: string;
    isp: string;
    net_speed: string;
    address_type: string;
    ads_category_name: string;
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
                                    <h2>{srv.name}</h2>
                                    <ul>
                                        <li><strong>IP Address:</strong> {srv.ip || 'N/A'}</li>
                                        <li><strong>Country:</strong> {srv.country_name || 'N/A'}</li>
                                        <li><strong>Region:</strong> {srv.region_name || 'N/A'}</li>
                                        <li><strong>District:</strong> {srv.district || 'N/A'}</li>
                                        <li><strong>City:</strong> {srv.city_name || 'N/A'}</li>
                                        <li><strong>Coordinates:</strong> {srv.latitude ? `${srv.latitude}, ${srv.longitude}` : 'N/A'}</li>
                                        <li><strong>ZIP Code:</strong> {srv.zip_code || 'N/A'}</li>
                                        <li><strong>Timezone:</strong> {srv.time_zone || 'N/A'}</li>
                                        <li><strong>ISP:</strong> {srv.isp || 'N/A'}</li>
                                        <li><strong>Network Speed:</strong> {srv.net_speed || 'N/A'}</li>
                                        <li><strong>Address Type:</strong> {srv.address_type || 'N/A'}</li>
                                        <li><strong>Category:</strong> {srv.ads_category_name || 'N/A'}</li>
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