import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';

import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';

import { HomePage } from './pages/HomePage';
import { PostDetailPage } from './pages/PostDetailPage';
import { LoginPage } from './pages/LoginPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { EditPostPage } from './pages/EditPostPage';
import { AdminPage } from './pages/AdminPage';

const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
`;

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <AppLayout>
      {isAuthenticated && <Navbar />}
      <MainContent>
        <Routes>
          {/* Se não autenticado, qualquer acesso exibe a tela de login */}
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              {/* Rotas autenticadas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
              <Route path="/login" element={<Navigate to="/" replace />} />

              {/* Rotas restritas para professores e administradores */}
              <Route
                path="/posts/new"
                element={
                  <ProtectedRoute allowedRoles={['professor', 'administrador']}>
                    <CreatePostPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['professor', 'administrador']}>
                    <EditPostPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['professor', 'administrador']}>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />

              {/* Redirecionamento padrão */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </MainContent>
    </AppLayout>
  );
};

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
