import React, { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export function AdBanner({ slotId = "auto", format = "auto", responsive = "true" }) {
    const { settings } = useSettings();
    const clientId = settings?.google_ads_client_id;

    useEffect(() => {
        // According to Google AdSense docs, we must push the ads array on component mount
        if (clientId && clientId.trim() !== '') {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (error) {
                console.error('Error loading AdSense:', error);
            }
        }
    }, [clientId]);

    // If there's no client ID configured in the admin panel, don't render anything
    if (!clientId || clientId.trim() === '') {
        return null;
    }

    return (
        <div className="w-full overflow-hidden flex justify-center py-4 my-2">
            <ins
                className="adsbygoogle"
                style={{ display: 'block', minWidth: '300px', minHeight: '100px' }}
                data-ad-client={clientId.trim()}
                data-ad-slot={slotId}
                data-ad-format={format}
                data-full-width-responsive={responsive}
                data-adtest="on" // Marks it as a test ad for local environments so policies aren't violated
            ></ins>
        </div>
    );
}
