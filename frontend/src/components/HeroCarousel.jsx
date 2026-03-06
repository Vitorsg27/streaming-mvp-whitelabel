import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function HeroCarousel({ movies }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter to keep only published movies if necessary, though assuming
    // the backend already filters this for non-admins
    const featuredMovies = movies?.slice(0, 5) || [];

    useEffect(() => {
        if (featuredMovies.length <= 1) return;

        // Auto-slide every 5 seconds
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === featuredMovies.length - 1 ? 0 : prev + 1));
        }, 5000);

        return () => clearInterval(interval);
    }, [featuredMovies.length]);

    if (featuredMovies.length === 0) {
        return (
            <section className="relative py-16 bg-gradient-to-b from-primary to-gray-900 border-b border-gray-800 flex items-center justify-center min-h-[400px]">
                <h2 className="text-3xl font-bold text-white mb-4">Carregando Destaques...</h2>
            </section>
        );
    }

    const currentMovie = featuredMovies[currentIndex];

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === featuredMovies.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? featuredMovies.length - 1 : prev - 1));
    };

    return (
        <section className="relative w-full h-[50vh] min-h-[400px] max-h-[600px] bg-gray-900 overflow-hidden group">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 transition-opacity duration-1000"
                style={{
                    backgroundImage: `url(${currentMovie.thumbnail_url || 'https://via.placeholder.com/1200x600?text=No+Image'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="relative h-full container mx-auto px-4 sm:px-8 flex flex-col justify-center">
                <div className="max-w-2xl animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Destaque
                        </span>
                        {currentMovie.category_name && (
                            <span className="text-gray-300 text-sm font-medium">
                                {currentMovie.category_name}
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg line-clamp-2">
                        {currentMovie.title}
                    </h1>

                    <p className="text-gray-200 text-base sm:text-lg mb-8 line-clamp-3 text-shadow max-w-xl">
                        {currentMovie.description || 'Sem descrição disponível'}
                    </p>

                    <div className="flex gap-4">
                        <Link
                            to={`/movie/${currentMovie.id}`}
                            className="bg-primary hover:bg-secondary text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                        >
                            <span className="text-xl">▶</span>
                            Assistir Agora
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navigation Controls (Visible on Hover) */}
            {featuredMovies.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-10"
                        aria-label="Anterior"
                    >
                        &#10094;
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-10"
                        aria-label="Próximo"
                    >
                        &#10095;
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {featuredMovies.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-secondary w-8' : 'bg-white/50 hover:bg-white'
                                    }`}
                                aria-label={`Ir para o slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
