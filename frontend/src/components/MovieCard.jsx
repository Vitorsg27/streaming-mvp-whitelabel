import React from 'react';
import { Link } from 'react-router-dom';

export function MovieCard({ movie }) {
  const imageStyle = {
    backgroundImage: `url(${movie.thumbnail_url || 'https://via.placeholder.com/300x400?text=No+Image'})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <article className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:scale-105">
      <Link to={`/movie/${movie.id}`}>
        <div className="relative h-56 bg-gray-800" style={imageStyle}>
          <div className="absolute inset-0 bg-black bg-opacity-40 hover:bg-opacity-20 transition flex items-center justify-center">
            <button className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center hover:bg-secondary transition">
              ▶
            </button>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
          {movie.title}
        </h3>
        
        {movie.category_name && (
          <span className="inline-block bg-primary text-white text-xs px-3 py-1 rounded-full mb-2">
            {movie.category_name}
          </span>
        )}

        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
          {movie.description || 'Sem descrição disponível'}
        </p>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>👁️ {movie.views} visualizações</span>
          <Link
            to={`/movie/${movie.id}`}
            className="bg-primary text-white px-3 py-1 rounded hover:bg-secondary transition"
          >
            Assistir
          </Link>
        </div>
      </div>
    </article>
  );
}
