import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  FileText,
  UserCheck,
  AlertCircle,
  RefreshCw,
  Award,
} from 'lucide-react';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
`;

const TopBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2.5rem;

  h1 {
    font-size: 2rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.textPrimary};
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.95rem;
    margin-top: 0.25rem;
  }
`;

const CreateButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const MetricCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  align-items: center;
  gap: 1.25rem;

  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: ${({ theme }) => theme.radii.md};
    display: flex;
    align-items: center;
    justify-content: center;

    &.blue {
      background: ${({ theme }) => theme.colors.primaryLight};
      color: ${({ theme }) => theme.colors.primary};
    }
    &.green {
      background: ${({ theme }) => theme.colors.successLight};
      color: ${({ theme }) => theme.colors.success};
    }
  }

  .info {
    display: flex;
    flex-direction: column;

    span.label {
      font-size: 0.85rem;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.textSecondary};
    }

    strong.value {
      font-size: 1.75rem;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.textPrimary};
      line-height: 1.2;
    }
  }
`;

const TableCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

const TableResponsive = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.925rem;

  th,
  td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  th {
    background: #f8fafc;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  tr:hover td {
    background: #f8fafc;
  }

  td.title-cell {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: all 0.15s;

  &.view {
    color: ${({ theme }) => theme.colors.textSecondary};
    &:hover {
      background: #f1f5f9;
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  &.edit {
    color: ${({ theme }) => theme.colors.primary};
    &:hover {
      background: ${({ theme }) => theme.colors.primaryLight};
    }
  }

  &.delete {
    color: ${({ theme }) => theme.colors.danger};
    &:hover {
      background: ${({ theme }) => theme.colors.dangerLight};
    }
  }
`;

const StateContainer = styled.div`
  text-align: center;
  padding: 4rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (err) {
      setError('Erro ao listar postagens.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId, postTitle) => {
    if (!window.confirm(`Deseja realmente excluir a postagem "${postTitle}"?`)) {
      return;
    }

    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      alert('Postagem excluída com sucesso.');
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao excluir a postagem.');
    }
  };

  // Filtragem estrita: Administradores veem todos os posts. Professores veem apenas seus próprios posts.
  const displayedPosts = isAdmin
    ? posts
    : posts.filter(
        (p) => user && (p.userId === user.id || p.author === user.name)
      );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <PageContainer>
      <TopBar>
        <div>
          <h1>
            <ShieldCheck size={32} color="#2563eb" />
            {isAdmin
              ? 'Painel Geral de Postagens (Administrador)'
              : 'Minhas Postagens (Painel do Professor)'}
          </h1>
          <p>
            {isAdmin
              ? 'Gestão e controle de todas as postagens publicadas por docentes no sistema.'
              : 'Gerenciamento exclusivo das postagens didáticas de sua autoria.'}
          </p>
        </div>

        <CreateButton to="/posts/new">
          <PlusCircle size={18} />
          Nova Postagem
        </CreateButton>
      </TopBar>

      <MetricsGrid>
        <MetricCard>
          <div className="icon-wrapper blue">
            <FileText size={24} />
          </div>
          <div className="info">
            <span className="label">
              {isAdmin ? 'Total Geral de Postagens' : 'Suas Postagens Publicadas'}
            </span>
            <strong className="value">{displayedPosts.length}</strong>
          </div>
        </MetricCard>

        <MetricCard>
          <div className="icon-wrapper green">
            {isAdmin ? <UserCheck size={24} /> : <Award size={24} />}
          </div>
          <div className="info">
            <span className="label">
              {isAdmin ? 'Total no Sistema' : 'Docente Responsável'}
            </span>
            <strong className="value" style={{ fontSize: isAdmin ? '1.75rem' : '1.2rem' }}>
              {isAdmin ? posts.length : user?.name || 'Professor'}
            </strong>
          </div>
        </MetricCard>
      </MetricsGrid>

      <TableCard>
        {loading ? (
          <StateContainer>
            <RefreshCw size={36} className="animate-spin" />
            <p style={{ marginTop: '1rem' }}>Carregando postagens...</p>
          </StateContainer>
        ) : error ? (
          <StateContainer>
            <AlertCircle size={36} color="#ef4444" />
            <p style={{ marginTop: '1rem', color: '#ef4444' }}>{error}</p>
          </StateContainer>
        ) : displayedPosts.length === 0 ? (
          <StateContainer>
            <FileText size={36} />
            <p style={{ marginTop: '1rem' }}>
              {isAdmin
                ? 'Nenhuma postagem cadastrada no sistema ainda.'
                : 'Você ainda não possui nenhuma postagem publicada.'}
            </p>
          </StateContainer>
        ) : (
          <TableResponsive>
            <Table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Data</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {displayedPosts.map((post) => (
                  <tr key={post.id}>
                    <td className="title-cell" title={post.title}>
                      {post.title}
                    </td>
                    <td>{post.author || 'Docente'}</td>
                    <td>{formatDate(post.createdAt)}</td>
                    <td>
                      <ActionGroup style={{ justifyContent: 'flex-end' }}>
                        <ActionBtn
                          className="view"
                          onClick={() => navigate(`/posts/${post.id}`)}
                          title="Visualizar Postagem"
                        >
                          <Eye size={16} />
                        </ActionBtn>

                        <ActionBtn
                          className="edit"
                          onClick={() => navigate(`/posts/${post.id}/edit`)}
                          title="Editar Postagem"
                        >
                          <Edit size={16} />
                        </ActionBtn>

                        <ActionBtn
                          className="delete"
                          onClick={() => handleDelete(post.id, post.title)}
                          title="Excluir Postagem"
                        >
                          <Trash2 size={16} />
                        </ActionBtn>
                      </ActionGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableResponsive>
        )}
      </TableCard>
    </PageContainer>
  );
};
