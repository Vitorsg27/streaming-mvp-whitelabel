import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function AdminPasswordForm() {
    const { changePassword } = useAuth();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'As novas senhas não coincidem' });
            setSaving(false);
            return;
        }

        if (formData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres' });
            setSaving(false);
            return;
        }

        const result = await changePassword(formData.currentPassword, formData.newPassword);

        if (result.success) {
            setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            setMessage({ type: 'error', text: result.error || 'Erro ao alterar a senha' });
        }

        setSaving(false);

        setTimeout(() => {
            setMessage({ type: '', text: '' });
        }, 5000);
    };

    return (
        <div className="bg-gray-800 rounded-lg p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-white">Alterar Senha do Administrador</h2>

            {message.text && (
                <div className={`p-4 rounded mb-6 ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2">
                        Senha Atual
                    </label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary focus:outline-none"
                        placeholder="Digite a senha atual"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2">
                        Nova Senha
                    </label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary focus:outline-none"
                        placeholder="No mínimo 6 caracteres"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2">
                        Confirmar Nova Senha
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary focus:outline-none"
                        placeholder="Repita a nova senha"
                        required
                    />
                </div>

                <div className="pt-6 border-t border-gray-700">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-primary hover:bg-secondary text-white font-bold py-2 px-6 rounded transition disabled:opacity-50"
                    >
                        {saving ? 'Atualizando...' : 'Atualizar Senha'}
                    </button>
                </div>
            </form>
        </div>
    );
}
