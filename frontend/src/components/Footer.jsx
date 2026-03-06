import React from 'react';
import { useSettings } from '../context/SettingsContext';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  return (
    <footer className="bg-gray-900 text-gray-400 mt-12 border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">{settings.site_name}</h3>
            <p className="text-sm">{settings.site_description}</p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Links Úteis</h4>
            <ul className="text-sm space-y-2">
              <li><a href="/" className="hover:text-white transition">Catálogo</a></li>
              <li><a href="/about" className="hover:text-white transition">Sobre Nós</a></li>
              <li><a href="/privacy" className="hover:text-white transition">Privacidade</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contato</h4>
            <p className="text-sm">Email: contato@{settings.site_name.toLowerCase().replace(/\s+/g, '')}.com</p>
            <p className="text-sm">Telefone: (11) 9999-9999</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} {settings.site_name}. Todos os direitos reservados.</p>
        </div>
      </div>

      {/* Google Ads Placeholder */}
      <div className="bg-gray-800 text-center py-2 text-xs">
        {/* Espaço para Google Ads */}
      </div>
    </footer>
  );
}
