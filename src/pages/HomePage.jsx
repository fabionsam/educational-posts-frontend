import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';
import { Search, Calendar, User, ArrowRight, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
`;



const SearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto 3rem auto;
  position: relative;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 0.6rem 1rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all 0.2s;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  svg {
    color: ${({ theme }) => theme.colors.textMuted};
    margin-right: 0.75rem;
  }

  input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.textPrimary};
    background: transparent;

    &::placeholder {
      color: ${({ theme }) => theme.colors.textMuted};
    }
  }
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const PostCard = styled(Link)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.75rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 0.75rem;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  p.description {
    font-size: 0.925rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.6;
    margin-bottom: 1.25rem;
    flex-grow: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 1rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};

  .author {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  .date {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
`;

const ReadMore = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 1rem;

  svg {
    transition: transform 0.2s;
  }

  ${PostCard}:hover & svg {
    transform: translateX(4px);
  }
`;

const StateContainer = styled.div`
  text-align: center;
  padding: 4rem 1.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  max-width: 500px;
  margin: 2rem auto;

  svg {
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.95rem;
  }
`;

export const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (query.trim()) {
        response = await api.get(`/posts/search?q=${encodeURIComponent(query.trim())}`);
      } else {
        response = await api.get('/posts');
      }
      setPosts(response.data);
    } catch (err) {
      setError('Não foi possível carregar as postagens. Verifique se o backend está ativo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPosts(searchTerm);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <PageContainer>


      <SearchContainer>
        <SearchInputWrapper>
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por palavras-chave (ex: Node, React, PostgreSQL)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInputWrapper>
      </SearchContainer>

      {loading ? (
        <StateContainer>
          <RefreshCw size={36} className="animate-spin" />
          <h3>Carregando postagens...</h3>
          <p>Conectando aos serviços educacionais.</p>
        </StateContainer>
      ) : error ? (
        <StateContainer>
          <AlertCircle size={36} color="#ef4444" />
          <h3>Erro ao carregar</h3>
          <p>{error}</p>
        </StateContainer>
      ) : posts.length === 0 ? (
        <StateContainer>
          <BookOpen size={36} />
          <h3>Nenhuma postagem encontrada</h3>
          <p>
            {searchTerm
              ? `Nenhum resultado corresponde à pesquisa "${searchTerm}".`
              : 'Ainda não há postagens publicadas.'}
          </p>
        </StateContainer>
      ) : (
        <PostsGrid>
          {posts.map((post) => (
            <PostCard key={post.id} to={`/posts/${post.id}`}>
              <h2>{post.title}</h2>
              <p className="description">{post.content}</p>

              <PostMeta>
                <div className="author">
                  <User size={14} />
                  <span>{post.author || 'Docente'}</span>
                </div>
                <div className="date">
                  <Calendar size={14} />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </PostMeta>

              <ReadMore>
                Ler conteúdo completo
                <ArrowRight size={15} />
              </ReadMore>
            </PostCard>
          ))}
        </PostsGrid>
      )}
    </PageContainer>
  );
};
