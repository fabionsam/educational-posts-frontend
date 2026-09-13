import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, ArrowLeft, Send, AlertCircle, CheckCircle } from 'lucide-react';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
`;

const BackLink = styled(Link)`
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

const FormCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 2.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.5rem;
  }
`;

const Header = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.85rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.textPrimary};
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.95rem;
    margin-top: 0.35rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.9rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  input,
  textarea {
    border: 1.5px solid
      ${({ $hasError, theme }) =>
        $hasError ? theme.colors.danger : theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.md};
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.surface};
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: ${({ $hasError, theme }) =>
        $hasError ? theme.colors.danger : theme.colors.primary};
      box-shadow: 0 0 0 3px
        ${({ $hasError }) =>
          $hasError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(37, 99, 235, 0.15)'};
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.textMuted};
    }
  }

  textarea {
    min-height: 220px;
    resize: vertical;
    line-height: 1.6;
  }

  .error-text {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.danger};
    font-weight: 500;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.95rem;
  font-weight: 700;
  transition: all 0.2s;

  &.primary {
    background: ${({ theme }) => theme.colors.primary};
    color: white;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryHover};
    }
  }

  &.secondary {
    background: #f1f5f9;
    color: ${({ theme }) => theme.colors.textSecondary};

    &:hover {
      background: #e2e8f0;
    }
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const Alert = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.85rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.9rem;
  margin-bottom: 1.5rem;

  &.error {
    background: ${({ theme }) => theme.colors.dangerLight};
    color: ${({ theme }) => theme.colors.danger};
    border: 1px solid rgba(239, 68, 68, 0.2);
  }
`;

export const CreatePostPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [apiError, setApiError] = useState(null);

  const formik = useFormik({
    initialValues: {
      title: '',
      author: user?.name || '',
      content: '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(4, 'O título deve ter no mínimo 4 caracteres')
        .required('O título da postagem é obrigatório'),
      author: Yup.string().required('O nome do autor é obrigatório'),
      content: Yup.string()
        .min(15, 'O conteúdo deve ter pelo menos 15 caracteres')
        .required('O conteúdo da postagem é obrigatório'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setApiError(null);
      try {
        const response = await api.post('/posts', {
          title: values.title,
          author: values.author,
          content: values.content,
        });
        navigate(`/posts/${response.data.id}`);
      } catch (err) {
        setApiError(
          err.response?.data?.error ||
            'Não foi possível criar a postagem. Verifique sua conexão e tente novamente.'
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <PageContainer>
      <BackLink to="/">
        <ArrowLeft size={18} />
        Voltar para Início
      </BackLink>

      <FormCard>
        <Header>
          <h1>
            <PlusCircle size={28} color="#2563eb" />
            Criar Nova Postagem
          </h1>
          <p>
            Compartilhe conteúdos educativos, tutoriais ou materiais didáticos com seus alunos.
          </p>
        </Header>

        {apiError && (
          <Alert className="error">
            <AlertCircle size={18} />
            <span>{apiError}</span>
          </Alert>
        )}

        <Form onSubmit={formik.handleSubmit}>
          <FormGroup $hasError={formik.touched.title && Boolean(formik.errors.title)}>
            <label htmlFor="title">Título da Postagem</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Ex: Introdução a Microsserviços com Docker"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.title && formik.errors.title && (
              <span className="error-text">{formik.errors.title}</span>
            )}
          </FormGroup>

          <FormGroup $hasError={formik.touched.author && Boolean(formik.errors.author)}>
            <label htmlFor="author">Autor</label>
            <input
              id="author"
              name="author"
              type="text"
              placeholder="Nome do docente ou autor"
              value={formik.values.author}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.author && formik.errors.author && (
              <span className="error-text">{formik.errors.author}</span>
            )}
          </FormGroup>

          <FormGroup $hasError={formik.touched.content && Boolean(formik.errors.content)}>
            <label htmlFor="content">Conteúdo Completo</label>
            <textarea
              id="content"
              name="content"
              placeholder="Escreva aqui o artigo completo, explicações e instruções didáticas..."
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.content && formik.errors.content && (
              <span className="error-text">{formik.errors.content}</span>
            )}
          </FormGroup>

          <Actions>
            <Button
              type="button"
              className="secondary"
              onClick={() => navigate('/')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="primary"
              disabled={formik.isSubmitting}
            >
              <Send size={16} />
              {formik.isSubmitting ? 'Publicando...' : 'Publicar Postagem'}
            </Button>
          </Actions>
        </Form>
      </FormCard>
    </PageContainer>
  );
};
