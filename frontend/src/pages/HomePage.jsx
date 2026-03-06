import React, { useState, useEffect } from 'react';
import { Head } from '../components/Head';
import { MovieCard } from '../components/MovieCard';
import { HeroCarousel } from '../components/HeroCarousel';
import { AdBanner } from '../components/AdBanner';
import { moviesAPI, categoriesAPI } from '../utils/api';

export function HomePage() {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedCategory, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const categoriesRes = await categoriesAPI.getAll();
      setCategories(categoriesRes.data);

      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;

      const moviesRes = await moviesAPI.getAll(params);
      setMovies(moviesRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head />

      <main className="min-h-screen bg-gray-900 text-white">
        {/* Hero Section */}
        {!searchTerm && !selectedCategory && (
          <HeroCarousel movies={movies} />
        )}

        {/* Categories & Search Filter Header */}
        <section className="py-6 border-b border-gray-800 bg-gray-900 sticky top-0 z-20 shadow-md">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search Input */}
            <div className="w-full md:w-1/3">
              <input
                type="text"
                placeholder="Buscar filmes por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
              />
            </div>
            <div className="flex flex-wrap gap-3 pb-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${selectedCategory === null
                  ? 'bg-primary text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
              >
                Todos
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition ${selectedCategory === category.slug
                    ? 'bg-primary text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Movies Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">Carregando filmes...</p>
              </div>
            ) : movies.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg mb-4">Nenhum filme encontrado</p>
                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}
                    className="bg-primary text-white px-6 py-2 rounded-full hover:bg-secondary transition"
                  >
                    Limpar Filtros
                  </button>
                )}
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-8">
                  {searchTerm ? `Resultados para "${searchTerm}"` : 'Catálogo de Filmes'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Google Ads Component */}
          <AdBanner slotId="homepage-bottom" />
        </section>
      </main>
    </>
  );
}
