import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  User,
  ArrowLeft,
  Edit,
  Trash2,
  AlertCircle,
  RefreshCw,
  Clock,
} from 'lucide-react';

const PageContainer = styled.div`
  max-width: 850px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    transform: translateX(-3px);
  }
`;

const ArticleCard = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 2.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.5rem;
  }
`;

const Header = styled.header`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 1.75rem;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.25rem;
    font-weight: 800;
    line-height: 1.3;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 1.25rem;
    letter-spacing: -0.02em;

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 1.75rem;
    }
  }
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const AuthorDate = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  .item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 500;

    strong {
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;

  &.edit {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};

    &:hover {
      background: #dbeafe;
    }
  }

  &.delete {
    background: ${({ theme }) => theme.colors.dangerLight};
    color: ${({ theme }) => theme.colors.danger};

    &:hover {
      background: #fee2e2;
    }
  }
`;

const ContentBody = styled.div`
  font-size: 1.125rem;
  line-height: 1.8;
  color: #334155;
  white-space: pre-line;
  word-break: break-word;
`;

const StateContainer = styled.div`
  text-align: center;
  padding: 4rem 1.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;

export const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Postagem não encontrada.');
        } else {
          setError('Erro ao carregar os dados desta postagem.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza de que deseja excluir esta postagem permanentemente?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/posts/${id}`);
      alert('Postagem excluída com sucesso.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao excluir a postagem.');
      setIsDeleting(false);
    }
  };

  const isAuthor = user && (user.id === post?.userId || user.name === post?.author);
  const canModify = isAdmin || isAuthor;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <StateContainer>
          <RefreshCw size={36} className="animate-spin" />
          <h3 style={{ marginTop: '1rem' }}>Carregando conteúdo...</h3>
        </StateContainer>
      </PageContainer>
    );
  }

  if (error || !post) {
    return (
      <PageContainer>
        <BackButton to="/">
          <ArrowLeft size={18} />
          Voltar para Início
        </BackButton>
        <StateContainer>
          <AlertCircle size={36} color="#ef4444" />
          <h3 style={{ marginTop: '1rem' }}>{error || 'Post não encontrado'}</h3>
        </StateContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackButton to="/">
        <ArrowLeft size={18} />
        Voltar para Início
      </BackButton>

      <ArticleCard>
        <Header>
          <h1>{post.title}</h1>
          <MetaRow>
            <AuthorDate>
              <div className="item">
                <User size={16} />
                <span>
                  Autor: <strong>{post.author || 'Docente'}</strong>
                </span>
              </div>
              <div className="item">
                <Calendar size={16} />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </AuthorDate>

            {canModify && (
              <Actions>
                <ActionBtn
                  className="edit"
                  onClick={() => navigate(`/posts/${post.id}/edit`)}
                  title="Editar postagem"
                >
                  <Edit size={15} />
                  Editar
                </ActionBtn>
                <ActionBtn
                  className="delete"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  title="Excluir postagem"
                >
                  <Trash2 size={15} />
                  {isDeleting ? 'Excluindo...' : 'Excluir'}
                </ActionBtn>
              </Actions>
            )}
          </MetaRow>
        </Header>

        <ContentBody>{post.content}</ContentBody>
      </ArticleCard>
    </PageContainer>
  );
};
