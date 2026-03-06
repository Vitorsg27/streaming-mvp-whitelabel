import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl sm:text-2xl font-bold flex flex-shrink-0 items-center gap-2 truncate pr-2">
            <span className="flex-shrink-0">🎬</span> <span className="truncate">{settings.site_name}</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-gray-200 transition">Catálogo</Link>
            {isAdmin && (
              <Link to="/admin" className="hover:text-gray-200 transition">Admin</Link>
            )}
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-sm">Olá, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-primary px-4 py-2 rounded hover:bg-gray-200 transition"
                >
                  Sair
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-2">
            <Link to="/" className="hover:text-gray-200 transition block">Catálogo</Link>
            {isAdmin && (
              <Link to="/admin" className="hover:text-gray-200 transition block">Admin</Link>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="bg-white text-primary px-4 py-2 rounded hover:bg-gray-200 transition w-full"
              >
                Sair
              </button>
            )}
          </nav>
        )}
      </div>

      {/* Google Ads Placeholder */}
      <div className="bg-gray-900 text-center py-2 text-xs text-gray-400">
        {/* Espaço para Google Ads */}
      </div>
    </header>
  );
}
