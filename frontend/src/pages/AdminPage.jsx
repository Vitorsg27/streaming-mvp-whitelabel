import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { moviesAPI } from '../utils/api';
import { AdminMovieForm } from './AdminMovieForm';
import { AdminSettingsForm } from './AdminSettingsForm';
import { AdminPasswordForm } from './AdminPasswordForm';

export function AdminPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('movies'); // 'movies', 'settings', or 'security'
  const itemsPerPage = 10;

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    fetchMovies();
  }, [isAdmin, navigate]);

  // Recarregar filmes quando o formulário é fechado
  useEffect(() => {
    if (!showForm) {
      console.log('Formulário fechado, recarregando filmes...');
      fetchMovies();
    }
  }, [showForm]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await moviesAPI.getAll();
      setMovies(response.data);
    } catch (err) {
      console.error('Erro ao carregar filmes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que quer deletar este filme?')) return;

    try {
      await moviesAPI.delete(id);
      setMovies(movies.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Erro ao deletar:', err);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingId(null);
    fetchMovies();
  };

  const paginatedMovies = movies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(movies.length / itemsPerPage);

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Painel de Administração</h1>
          <p className="text-gray-400">Bem-vindo, {user?.username}</p>
        </div>

        {user?.isDefaultPassword && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-8 shadow-lg flex items-center justify-between">
            <div>
              <p className="font-bold text-lg mb-1">⚠️ Aviso de Segurança Crítico</p>
              <p>Você está utilizando a senha padrão do sistema. Para evitar invasões, por favor, altere sua senha imediatamente.</p>
            </div>
            <button
              onClick={() => setActiveTab('security')}
              className="bg-white text-red-600 px-4 py-2 rounded font-bold hover:bg-gray-100 transition whitespace-nowrap ml-4"
            >
              Trocar Senha
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('movies')}
            className={`px-6 py-3 font-semibold transition whitespace-nowrap ${activeTab === 'movies'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Gerenciar Filmes
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-semibold transition whitespace-nowrap ${activeTab === 'settings'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Configurações Globais
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3 font-semibold transition whitespace-nowrap ${activeTab === 'security'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Segurança
          </button>
        </div>

        {activeTab === 'security' ? (
          <AdminPasswordForm />
        ) : activeTab === 'settings' ? (
          <AdminSettingsForm />
        ) : showForm ? (
          <div className="bg-gray-800 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Editar Filme' : 'Novo Filme'}
            </h2>
            <AdminMovieForm
              key={editingId || 'new'}
              movieId={editingId}
              onSaveSuccess={handleFormClose}
            />
            <button
              onClick={handleFormClose}
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              ← Voltar
            </button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-gray-400 text-sm uppercase mb-2">Total de Filmes</h3>
                <p className="text-3xl font-bold">{movies.length}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-gray-400 text-sm uppercase mb-2">Publicados</h3>
                <p className="text-3xl font-bold">
                  {movies.filter((m) => m.status === 'published').length}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-gray-400 text-sm uppercase mb-2">Rascunhos</h3>
                <p className="text-3xl font-bold">
                  {movies.filter((m) => m.status === 'draft').length}
                </p>
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
              }}
              className="mb-8 bg-primary hover:bg-secondary text-white font-bold py-2 px-6 rounded transition"
            >
              + Novo Filme
            </button>

            {/* Movies Table */}
            {loading ? (
              <div className="text-center py-8">Carregando filmes...</div>
            ) : movies.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Nenhum filme cadastrado
              </div>
            ) : (
              <>
                <div className="overflow-x-auto bg-gray-800 rounded-lg w-full">
                  <table className="w-full text-sm sm:text-base">
                    <thead className="bg-gray-700 border-b border-gray-600 whitespace-nowrap">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left">Título</th>
                        <th className="px-4 sm:px-6 py-3 text-left">Categoria</th>
                        <th className="px-4 sm:px-6 py-3 text-left">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-left">Visualizações</th>
                        <th className="px-4 sm:px-6 py-3 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedMovies.map((movie) => (
                        <tr
                          key={movie.id}
                          className="border-b border-gray-700 hover:bg-gray-700 transition"
                        >
                          <td className="px-4 sm:px-6 py-4 max-w-[150px] sm:max-w-[250px] truncate">
                            <a
                              href={`/movie/${movie.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline block truncate"
                              title={movie.title}
                            >
                              {movie.title}
                            </a>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-gray-400 whitespace-nowrap">
                            {movie.category_name || '-'}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${movie.status === 'published'
                                ? 'bg-green-600'
                                : 'bg-yellow-600'
                                }`}
                            >
                              {movie.status === 'published'
                                ? 'Publicado'
                                : 'Rascunho'}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-gray-400">{movie.views}</td>
                          <td className="px-4 sm:px-6 py-4 flex gap-2">
                            <button
                              onClick={() => {
                                setShowForm(true);
                                setEditingId(movie.id);
                              }}
                              className="text-primary hover:text-secondary underline"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(movie.id)}
                              className="text-red-500 hover:text-red-700 underline"
                            >
                              Deletar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded ${currentPage === i + 1
                          ? 'bg-primary text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
