import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

const Container = styled.div`
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  width: 100%;
  max-width: 440px;
  padding: 2.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.75rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  .icon-wrapper {
    width: 50px;
    height: 50px;
    border-radius: ${({ theme }) => theme.radii.full};
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem auto;
  }

  h1 {
    font-size: 1.65rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.textPrimary};
    letter-spacing: -0.02em;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.925rem;
    margin-top: 0.35rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    border: 1.5px solid
      ${({ $hasError, theme }) =>
        $hasError ? theme.colors.danger : theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.md};
    padding: 0.65rem 0.85rem;
    background: ${({ theme }) => theme.colors.surface};
    transition: all 0.2s;

    &:focus-within {
      border-color: ${({ $hasError, theme }) =>
        $hasError ? theme.colors.danger : theme.colors.primary};
      box-shadow: 0 0 0 3px
        ${({ $hasError }) =>
          $hasError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(37, 99, 235, 0.15)'};
    }

    svg {
      color: ${({ theme }) => theme.colors.textMuted};
      margin-right: 0.65rem;
    }

    input {
      width: 100%;
      border: none;
      outline: none;
      font-size: 0.95rem;
      color: ${({ theme }) => theme.colors.textPrimary};

      &::placeholder {
        color: ${({ theme }) => theme.colors.textMuted};
      }
    }
  }

  .error-message {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.danger};
    margin-top: 0.2rem;
  }
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const ErrorAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background: ${({ theme }) => theme.colors.dangerLight};
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: ${({ theme }) => theme.colors.danger};
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
`;

const DemoBox = styled.div`
  background: #f8fafc;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 1rem;
  margin-top: 1.75rem;
  font-size: 0.825rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  .demo-title {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 0.5rem;
  }

  .demo-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  button {
    font-size: 0.8rem;
    padding: 0.5rem 0.5rem;
    border-radius: ${({ theme }) => theme.radii.sm};
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.border};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
    text-align: center;
    white-space: nowrap;
    transition: all 0.15s;

    &:hover {
      background: ${({ theme }) => theme.colors.primaryLight};
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState(null);

  const from = location.state?.from?.pathname || '/admin';

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Informe um endereço de e-mail válido')
        .required('O e-mail é obrigatório'),
      password: Yup.string()
        .min(6, 'A senha deve ter no mínimo 6 caracteres')
        .required('A senha é obrigatória'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setApiError(null);
      try {
        await login(values.email, values.password);
        navigate(from, { replace: true });
      } catch (err) {
        setApiError(
          err.response?.data?.error || 'Falha na autenticação. Verifique seu e-mail e senha.'
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fillDemo = (email, password) => {
    formik.setFieldValue('email', email);
    formik.setFieldValue('password', password);
  };

  return (
    <Container>
      <Card>
        <Header>
          <div className="icon-wrapper">
            <Lock size={24} />
          </div>
        </Header>

        {apiError && (
          <ErrorAlert>
            <AlertCircle size={18} />
            <span>{apiError}</span>
          </ErrorAlert>
        )}

        <Form onSubmit={formik.handleSubmit}>
          <FormGroup $hasError={formik.touched.email && Boolean(formik.errors.email)}>
            <label htmlFor="email">E-mail</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seu.email@escola.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <span className="error-message">{formik.errors.email}</span>
            )}
          </FormGroup>

          <FormGroup $hasError={formik.touched.password && Boolean(formik.errors.password)}>
            <label htmlFor="password">Senha</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <span className="error-message">{formik.errors.password}</span>
            )}
          </FormGroup>

          <SubmitButton type="submit" disabled={formik.isSubmitting}>
            <LogIn size={18} />
            {formik.isSubmitting ? 'Entrando...' : 'Entrar'}
          </SubmitButton>
        </Form>

        <DemoBox>
          <div className="demo-title">
            <Sparkles size={15} color="#f59e0b" />
            <span>Credenciais de Demonstração:</span>
          </div>
          <p>Use os botões rápidos para testar o login de diferentes papéis:</p>
          <div className="demo-actions">
            <button
              type="button"
              onClick={() => fillDemo('student@test.com', 'password123')}
            >
              Aluno
            </button>
            <button
              type="button"
              onClick={() => fillDemo('teacher1@test.com', 'password123')}
            >
              Professor 1
            </button>
            <button
              type="button"
              onClick={() => fillDemo('teacher2@test.com', 'password123')}
            >
              Professor 2
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@test.com', 'password123')}
            >
              Administrador
            </button>
          </div>
        </DemoBox>
      </Card>
    </Container>
  );
};
