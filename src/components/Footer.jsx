import React from 'react';
import styled from 'styled-components';
import { Heart } from 'lucide-react';

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 2.5rem 1.5rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1rem;
  }
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};

  svg {
    color: ${({ theme }) => theme.colors.danger};
  }
`;

export const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Brand>
          <strong>EduBlog - Plataforma Educacional</strong>
          <span>Tech Challenge Fase 03 • Full Stack Development</span>
        </Brand>

        <Meta>
          <span>Desenvolvido com</span>
          <Heart size={14} fill="#ef4444" />
          <span>em React & Node.js</span>
        </Meta>
      </FooterContent>
    </FooterContainer>
  );
};
