import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsAPI } from '../utils/api';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState({
        site_name: 'Minha Plataforma',
        site_description: 'Plataforma de streaming de vídeos',
        primary_color: '#6D28D9',
        secondary_color: '#EC4899',
    });
    const [loading, setLoading] = useState(true);

    const applyGoogleAds = (clientId) => {
        // Remove existing ads script if present to prevent duplicates when settings change
        const existingScript = document.getElementById('google-adsense-script');
        if (existingScript) {
            existingScript.remove();
        }

        if (clientId && clientId.trim() !== '') {
            const script = document.createElement('script');
            script.id = 'google-adsense-script';
            script.async = true;
            script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId.trim()}`;
            script.crossOrigin = "anonymous";
            document.head.appendChild(script);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await settingsAPI.getAll();
            const currentSettings = response.data;

            setSettings(currentSettings);

            // Apply CSS variables dynamically
            if (currentSettings.primary_color) {
                document.documentElement.style.setProperty('--color-primary', currentSettings.primary_color);
            }
            if (currentSettings.secondary_color) {
                document.documentElement.style.setProperty('--color-secondary', currentSettings.secondary_color);
            }

            // Apply Google Ads dynamically
            if (currentSettings.google_ads_client_id) {
                applyGoogleAds(currentSettings.google_ads_client_id);
            }

        } catch (error) {
            console.error('Erro ao carregar configurações globais:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings) => {
        try {
            const response = await settingsAPI.update(newSettings);
            const updatedSettings = response.data.settings; // API returns { message, settings }
            setSettings(updatedSettings);

            // Re-apply CSS variables
            if (updatedSettings.primary_color) {
                document.documentElement.style.setProperty('--color-primary', updatedSettings.primary_color);
            }
            if (updatedSettings.secondary_color) {
                document.documentElement.style.setProperty('--color-secondary', updatedSettings.secondary_color);
            }

            // Re-apply Google Ads if client ID changed or was added
            if (updatedSettings.google_ads_client_id !== undefined) {
                applyGoogleAds(updatedSettings.google_ads_client_id);
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Erro ao atualizar configurações' };
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
}
