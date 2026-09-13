import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';

import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { AuthProvider } from './context/AuthContext';
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
  return (
    <AppLayout>
      <Navbar />
      <MainContent>
        <Routes>
          {/* Rotas públicas: Qualquer visitante ou aluno pode listar e ler posts */}
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas protegidas: Criação, edição e administração exigem autenticação */}
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

          {/* Redirecionamento padrão para a página principal */}
          <Route path="*" element={<Navigate to="/" replace />} />
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
