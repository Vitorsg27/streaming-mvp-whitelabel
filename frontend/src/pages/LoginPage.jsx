import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Head } from '../components/Head';

import { useSettings } from '../context/SettingsContext';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <>
      <Head
        title={`Login - Painel Admin | ${settings.site_name}`}
        description="Acesso ao painel de administração"
      />

      <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Admin Login</h1>

          {error && (
            <div className="bg-red-600 text-white p-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary focus:outline-none"
                placeholder="Digite seu usuário"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary focus:outline-none"
                placeholder="Digite sua senha"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-secondary text-white font-bold py-2 rounded transition disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-gray-400 text-sm text-center mt-6">
            Credenciais padrão: admin / admin123
          </p>
        </div>
      </main>
    </>
  );
}
