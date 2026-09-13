import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  PlusCircle,
  ShieldCheck,
  LogIn,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const NavContainer = styled.nav`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.85rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 1.35rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;

  span.badge {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.15rem 0.45rem;
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.radii.full};
    border: 1px solid rgba(37, 99, 235, 0.2);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.colors.surface};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding: 1.5rem;
    gap: 1rem;
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.925rem;
  font-weight: 600;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};
  padding: 0.4rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-left: 0.75rem;
  border-left: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    border-left: none;
    padding-left: 0;
    width: 100%;
    justify-content: space-between;
    padding-top: 0.75rem;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .name {
    font-size: 0.85rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .role {
    font-size: 0.7rem;
    text-transform: capitalize;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s;

  &.login {
    background: ${({ theme }) => theme.colors.primary};
    color: white;

    &:hover {
      background: ${({ theme }) => theme.colors.primaryHover};
    }
  }

  &.logout {
    background: ${({ theme }) => theme.colors.dangerLight};
    color: ${({ theme }) => theme.colors.danger};

    &:hover {
      background: #fee2e2;
      color: ${({ theme }) => theme.colors.dangerHover};
    }
  }
`;

const MobileToggle = styled.button`
  display: none;
  color: ${({ theme }) => theme.colors.textPrimary};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: block;
  }
`;

export const Navbar = () => {
  const { user, isAuthenticated, isTeacher, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const closeMenu = () => setMobileOpen(false);

  return (
    <NavContainer>
      <NavContent>
        <Logo to="/" onClick={closeMenu}>
          <BookOpen size={26} />
          EduBlog
          <span className="badge">Pós Tech</span>
        </Logo>

        <MobileToggle onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </MobileToggle>

        <NavLinks $isOpen={mobileOpen}>
          <NavItem to="/" $active={location.pathname === '/'} onClick={closeMenu}>
            Início
          </NavItem>

          {isTeacher && (
            <>
              <NavItem
                to="/posts/new"
                $active={location.pathname === '/posts/new'}
                onClick={closeMenu}
              >
                <PlusCircle size={17} />
                Nova Postagem
              </NavItem>
              <NavItem
                to="/admin"
                $active={location.pathname === '/admin'}
                onClick={closeMenu}
              >
                <ShieldCheck size={17} />
                Painel Administrativo
              </NavItem>
            </>
          )}

          {isAuthenticated ? (
            <UserSection>
              <UserInfo>
                <span className="name">{user?.name}</span>
                <span className="role">{user?.role}</span>
              </UserInfo>
              <ActionButton className="logout" onClick={handleLogout} title="Encerrar Sessão">
                <LogOut size={16} />
                Sair
              </ActionButton>
            </UserSection>
          ) : (
            <UserSection>
              <ActionButton
                className="login"
                onClick={() => {
                  navigate('/login');
                  closeMenu();
                }}
              >
                <LogIn size={16} />
                Área do Docente
              </ActionButton>
            </UserSection>
          )}
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
};
