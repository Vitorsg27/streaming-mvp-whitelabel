import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { moviesAPI, categoriesAPI } from '../utils/api';

export function AdminMovieForm({ movieId, onSaveSuccess }) {
  const navigate = useNavigate();
  const id = movieId; // Usar a prop ao invés de useParams
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    category_id: '',
    status: 'draft',
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchMovie();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      setError('Erro ao carregar categorias');
    }
  };

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const response = await moviesAPI.getById(id);
      const movie = response.data;
      setFormData({
        title: movie.title,
        description: movie.description || '',
        video_url: movie.video_url,
        thumbnail_url: movie.thumbnail_url || '',
        category_id: movie.category_id || '',
        status: movie.status,
      });
    } catch (err) {
      setError('Erro ao carregar filme');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateVideoUrl = () => {
    if (!formData.video_url) return;
    
    // Simple local validation - check if it's a valid URL format
    const urlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    
    if (!urlRegex.test(formData.video_url)) {
      setValidationError('Por favor, insira uma URL de vídeo válida (YouTube)');
      return;
    }
    
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationError('');

    if (!formData.title || !formData.video_url) {
      setError('Título e URL do vídeo são obrigatórios');
      return;
    }

    try {
      setLoading(true);
      console.log('Enviando dados:', formData);
      console.log('Editando:', isEditing, 'ID:', id);

      if (isEditing) {
        console.log('Atualizando filme...');
        const updateResponse = await moviesAPI.update(id, formData);
        console.log('Resposta da atualização:', updateResponse);
      } else {
        console.log('Criando novo filme...');
        const createResponse = await moviesAPI.create(formData);
        console.log('Resposta da criação:', createResponse);
      }

      console.log('Filme salvo com sucesso! Navegando para /admin');
      if (onSaveSuccess) {
        onSaveSuccess();
      } else {
        navigate('/admin');
      }
    } catch (err) {
      console.error('Erro completo:', err);
      console.error('Erro response:', err.response);
      const errorMessage = err.response?.data?.error || 'Erro ao salvar filme';
      console.error('Mensagem de erro:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-600 text-white p-4 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-gray-300 text-sm font-bold mb-2">
          Título *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-bold mb-2">
          Descrição
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="4"
          className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-bold mb-2">
          URL do Vídeo (YouTube ou link) *
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            name="video_url"
            value={formData.video_url}
            onChange={handleInputChange}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary focus:outline-none"
            placeholder="https://youtube.com/watch?v=... ou https://..."
            required
          />
          <button
            type="button"
            onClick={validateVideoUrl}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            Validar
          </button>
        </div>
        {validationError && (
          <p className="text-red-400 text-sm mt-1">{validationError}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-bold mb-2">
          URL da Thumbnail (Capa)
        </label>
        <input
          type="url"
          name="thumbnail_url"
          value={formData.thumbnail_url}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary focus:outline-none"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-bold mb-2">
          Categoria
        </label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary focus:outline-none"
        >
          <option value="">Nenhuma categoria</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-bold mb-2">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-primary focus:outline-none"
        >
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary hover:bg-secondary text-white font-bold py-2 rounded transition disabled:opacity-50"
        >
          {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
