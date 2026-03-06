import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Head } from '../components/Head';
import { VideoPlayer } from '../components/VideoPlayer';
import { AdBanner } from '../components/AdBanner';
import { moviesAPI } from '../utils/api';

import { useSettings } from '../context/SettingsContext';

export function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { settings } = useSettings();

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const response = await moviesAPI.getById(id);
      setMovie(response.data);
      setError(null);
    } catch (err) {
      const errorData = {
        status: err.response?.status,
        message: err.response?.data?.error || 'Erro ao carregar filme'
      };
      setError(errorData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (error || !movie) {
    const isForbidden = error?.status === 403;

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          {isForbidden ? (
            <>
              <h1 className="text-2xl mb-4">Acesso Restrito</h1>
              <p className="text-gray-400 mb-6">Este filme está em rascunho e só pode ser visualizado por administradores.</p>
              <Link to="/login" className="text-primary hover:text-secondary transition mr-4">
                Fazer Login →
              </Link>
              <Link to="/" className="text-gray-400 hover:text-gray-300 transition">
                ← Voltar ao catálogo
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl mb-4">Filme não encontrado</h1>
              <Link to="/" className="text-primary hover:text-secondary transition">
                ← Voltar ao catálogo
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Head
        title={`${movie.title} | ${settings.site_name}`}
        description={movie.description}
        image={movie.thumbnail_url}
        url={window.location.href}
      />

      <main className="min-h-screen bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <Link to="/" className="text-primary hover:text-secondary mb-8 inline-block">
            ← Voltar ao catálogo
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <VideoPlayer url={movie.video_url} title={movie.title} />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>

              {movie.category_name && (
                <div className="mb-4">
                  <span className="bg-primary px-4 py-2 rounded-full text-sm">
                    {movie.category_name}
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm uppercase mb-2">Visualizações</h3>
                  <p className="text-2xl font-bold">{movie.views}</p>
                </div>

                <div>
                  <h3 className="text-gray-400 text-sm uppercase mb-2">Adicionado em</h3>
                  <p>{new Date(movie.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              {/* Google Ads Component */}
              <div className="mt-6">
                <AdBanner slotId="movie-sidebar" />
              </div>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Sinopse</h2>
            <p className="text-gray-300 leading-relaxed text-lg max-w-3xl">
              {movie.description || 'Sem descrição disponível'}
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
