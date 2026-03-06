import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export function AdminSettingsForm() {
    const { settings, updateSettings } = useSettings();
    const [formData, setFormData] = useState({
        site_name: '',
        site_description: '',
        primary_color: '#000000',
        secondary_color: '#000000',
        google_ads_client_id: '',
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (settings) {
            setFormData({
                site_name: settings.site_name || '',
                site_description: settings.site_description || '',
                primary_color: settings.primary_color || '#6D28D9',
                secondary_color: settings.secondary_color || '#EC4899',
                google_ads_client_id: settings.google_ads_client_id || '',
            });
        }
    }, [settings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        const result = await updateSettings(formData);

        if (result.success) {
            setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
        } else {
            setMessage({ type: 'error', text: result.error || 'Erro ao salvar configurações' });
        }

        setSaving(false);

        // Clear success message after 3 seconds
        setTimeout(() => {
            setMessage({ type: '', text: '' });
        }, 3000);
    };

    return (
        <div className="bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-white">Configurações Gerais</h2>

            {message.text && (
                <div className={`p-4 rounded mb-6 ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2">
                        Nome do Site / Plataforma
                    </label>
                    <input
                        type="text"
                        name="site_name"
                        value={formData.site_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary focus:outline-none"
                        placeholder="Ex: MyStreaming"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2">
                        Descrição do Site (SEO)
                    </label>
                    <textarea
                        name="site_description"
                        value={formData.site_description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary focus:outline-none"
                        placeholder="Descrição curta para aparecer nos motores de busca"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2">
                            Cor Primária
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                name="primary_color"
                                value={formData.primary_color}
                                onChange={handleChange}
                                className="w-16 h-12 rounded cursor-pointer bg-gray-700 border-0 p-1"
                                title="Escolha a cor primária"
                            />
                            <span className="text-gray-400 font-mono">{formData.primary_color}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2">
                            Cor Secundária
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                name="secondary_color"
                                value={formData.secondary_color}
                                onChange={handleChange}
                                className="w-16 h-12 rounded cursor-pointer bg-gray-700 border-0 p-1"
                                title="Escolha a cor secundária"
                            />
                            <span className="text-gray-400 font-mono">{formData.secondary_color}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2">
                        Google Ads Client ID (Monetização)
                    </label>
                    <input
                        type="text"
                        name="google_ads_client_id"
                        value={formData.google_ads_client_id}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary focus:outline-none"
                        placeholder="Ex: ca-pub-1234567890123456"
                    />
                    <p className="text-gray-400 text-xs mt-1">
                        Deixe em branco se não desejar exibir anúncios. O código será injetado automaticamente na página.
                    </p>
                </div>

                <div className="pt-6 border-t border-gray-700">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-primary hover:bg-secondary text-white font-bold py-2 px-6 rounded transition disabled:opacity-50"
                    >
                        {saving ? 'Salvando...' : 'Salvar Configurações'}
                    </button>
                </div>
            </form>
        </div>
    );
}
