# EduBlog - Front-End (Tech Challenge Fase 03)

Este repositório contém a interface gráfica (Front-End) da aplicação de blogging educacional desenvolvida em **React**, integrando-se à API RESTful construída na Fase 02. O projeto foi desenvolvido como parte integrante do **Tech Challenge - Fase 03** da **Pós Tech**.

---

## 🛠️ Tecnologias Utilizadas

- **React 18**: Biblioteca base com componentes funcionais e hooks.
- **Webpack 5 & Babel**: Toolchain de empacotamento e transpilação (sem utilização do Vite, garantindo compatibilidade e robustez corporativa).
- **Styled Components**: Estilização baseada em CSS-in-JS com suporte a temas globais e responsividade para dispositivos móveis e desktops.
- **Formik & Yup**: Gerenciamento de estado de formulários com validações síncronas/assíncronas declarativas.
- **React Router DOM v6**: Roteamento declarativo com suporte a rotas públicas e rotas protegidas por papéis (RBAC).
- **Axios**: Cliente HTTP configurado com interceptors para injeção automática de tokens Bearer JWT.
- **Context API**: Gerenciamento do estado global de autenticação (`AuthContext`).
- **Lucide React**: Conjunto de ícones leves e modernos.
- **Docker & Nginx**: Containerização com build multi-stage e servidor Nginx de alta performance para produção.
- **GitHub Actions**: Pipeline de CI/CD para validação automática de build e publicação de imagens no GitHub Container Registry (GHCR).

---

## 📐 Arquitetura da Aplicação

A aplicação foi estruturada seguindo as melhores práticas de separação de responsabilidades em projetos React modernos:

```
educational-posts-frontend/
├── .github/
│   └── workflows/
│       └── ci-cd.yml         # Pipeline de CI/CD (GitHub Actions)
├── public/
│   └── index.html            # Shell HTML principal com fontes e viewport
├── src/
│   ├── components/
│   │   ├── Navbar.js         # Barra de navegação responsiva com controle de perfil
│   │   ├── Footer.js         # Rodapé institucional
│   │   └── ProtectedRoute.js # Guarda de rotas autenticadas e papéis (RBAC)
│   ├── context/
│   │   └── AuthContext.js    # Estado global de autenticação (JWT e dados do usuário)
│   ├── pages/
│   │   ├── HomePage.js       # Lista de posts com cards e busca textual por palavra-chave
│   │   ├── PostDetailPage.js # Visualização detalhada do conteúdo do post
│   │   ├── LoginPage.js      # Autenticação de docentes (Formik + Yup)
│   │   ├── CreatePostPage.js # Formulário de criação de posts (Formik + Yup)
│   │   ├── EditPostPage.js   # Formulário de edição de posts (Formik + Yup)
│   │   └── AdminPage.js      # Painel administrativo com listagem, edição e exclusão
│   ├── services/
│   │   └── api.js            # Instância do Axios com interceptor de autenticação
│   ├── styles/
│   │   ├── GlobalStyles.js   # Reset CSS, fontes e estilos base
│   │   └── theme.js          # Design tokens (cores, sombras, espaçamentos, breakpoints)
│   ├── App.js                # Roteamento e configuração dos Providers globais
│   └── index.js              # Ponto de montagem no DOM
├── .dockerignore
├── .env.example              # Exemplo de variáveis de ambiente
├── Dockerfile                # Build multi-stage (Node.js + Nginx)
├── docker-compose.yml        # Orquestração do contêiner local
├── nginx.conf                # Configuração do servidor Nginx para SPA
├── package.json              # Dependências e scripts
├── webpack.config.js         # Configurações do Webpack
└── README.md                 # Documentação técnica detalhada
```

---

## 🎯 Atendimento aos Requisitos do Desafio

| Requisito Funcional | Página / Componente | Descrição da Implementação |
| :--- | :--- | :--- |
| **1. Página principal** | `HomePage.js` | Lista todos os posts (`GET /posts`), exibe título, autor, resumo e data formatada. Possui campo de pesquisa dinâmico com debounce que consome `GET /posts/search?q=...`. |
| **2. Leitura de post** | `PostDetailPage.js` | Exibe o conteúdo completo da postagem selecionada (`GET /posts/:id`) e metadados do autor. Se o usuário autenticado for o autor ou administrador, exibe atalhos para edição e exclusão. |
| **3. Criação de postagens** | `CreatePostPage.js` | Formulário construído com **Formik** e validado com **Yup** para título, conteúdo e autor. Submete requisição autenticada para `POST /posts`. |
| **4. Edição de postagens** | `EditPostPage.js` | Carrega previamente os dados atuais do post (`GET /posts/:id`), preenche os campos do **Formik** (`enableReinitialize`) e envia para `PUT /posts/:id`. |
| **5. Página administrativa** | `AdminPage.js` | Tabela gerencial de posts com métricas em tempo real, permitindo a docentes visualizarem, editarem e excluírem (`DELETE /posts/:id`) registros. |
| **6. Autenticação e autorização** | `LoginPage.js` & `ProtectedRoute.js` | Login de professores/administradores com Formik. Rotas de criação, edição e administração são protegidas, impedindo acesso de usuários não autenticados. |

---

## ⚙️ Instalação e Execução

### 1. Pré-requisitos
- Node.js instalado (v18+)
- npm instalado
- Back-end em execução (localmente na porta `3000` ou apontando para a API no Render)

### 2. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo para `.env`:
```bash
cp .env.example .env
```
O arquivo `.env` contém:
```env
REACT_APP_API_URL=http://localhost:3000
```
*(Para conectar diretamente à API em nuvem no Render, utilize: `REACT_APP_API_URL=https://educational-posts-backend.onrender.com`)*

### 3. Instalar Dependências
```bash
npm install
```

### 4. Executar em Desenvolvimento
```bash
npm start
```
A aplicação abrirá no endereço: **`http://localhost:3001`**

### 5. Gerar Build de Produção
```bash
npm run build
```
Os arquivos estáticos otimizados serão gerados na pasta `dist/`.

---

## 🐳 Executando com Docker

Você pode subir a aplicação em contêiner de produção com apenas um comando:

```bash
docker-compose up --build
```
A aplicação será servida via Nginx na porta `3001`: **`http://localhost:3001`**.

Para parar o contêiner:
```bash
docker-compose down
```

---

## 📖 Guia de Uso da Aplicação

### 1. Navegação de Alunos (Pública)
1. Acesse a página inicial (`/`).
2. Digite termos na barra de busca para filtrar postagens instantaneamente por palavras-chave no título ou conteúdo.
3. Clique em **"Ler conteúdo completo"** em qualquer post para acessar a tela de leitura detalhada.

### 2. Acesso de Docentes
1. No menu superior, clique em **"Área do Docente"** (ou acesse `/login`).
2. Utilize as credenciais do seu usuário docente ou utilize os botões rápidos de demonstração disponíveis no card de login (ex: `teacher1@test.com` / `password123`).
3. Uma vez autenticado:
   - A barra de navegação exibirá o botão **"Nova Postagem"** e **"Painel Administrativo"**, além do nome e papel do usuário logado.
   - Acesse **"Nova Postagem"** para redigir um novo conteúdo didático. O Formik e Yup validarão os campos em tempo real antes do envio.
   - Acesse **"Painel Administrativo"** para acompanhar métricas de postagens e gerenciar alterações ou exclusões com confirmação.
   - Ao finalizar, clique em **"Sair"** para revogar a sessão de forma segura.

---

## 🧠 Relato de Experiências e Desafios Enfrentados pela Equipe

Durante o desenvolvimento deste projeto de Front-End, a equipe vivenciou momentos de grande evolução técnica e enfrentou desafios relevantes:

### 1. Migração para uma Arquitetura sem Vite (Webpack + Babel)
A decisão de estruturar o projeto utilizando Webpack 5 e Babel puros em vez de utilitários prontos como o Vite exigiu um aprofundamento na configuração de loaders (`babel-loader`, `css-loader`, `style-loader`), resolução de módulos e roteamento SPA via `historyApiFallback`. Essa escolha permitiu um entendimento aprofundado do ciclo de empacotamento de uma aplicação React e eliminou dependências obsoletas de templates legados.

### 2. Validação Declarativa com Formik e Yup
A substituição de formulários manuais por Formik em conjunto com esquemas de validação do Yup trouxe grande robustez ao projeto. O principal desafio foi gerenciar o ciclo de pré-carregamento dos dados na tela de edição (`EditPostPage`), resolvido através da propriedade `enableReinitialize: true`, garantindo que requisições assíncronas ao backend preenchessem os campos de formulário sem conflitos de renderização.

### 3. Controle de Acesso Baseado em Papéis (RBAC) e JWT
Integrar o front-end ao sistema de permissões desenvolvido no back-end (onde perfis de alunos possuem permissões apenas de leitura e professores possuem posse sobre suas postagens) exigiu a criação de componentes de guarda de rotas (`ProtectedRoute`) e renderização contextual de botões de edição/exclusão. Dessa forma, a interface não apenas bloqueia ações não autorizadas visualmente, mas também protege URLs diretas caso um usuário tente digitá-las no navegador.

### 4. Containerização com Nginx e CI/CD
Configurar um container Docker multi-stage com Nginx exigiu entender a diretiva `try_files $uri /index.html;` para que o roteamento baseado no HTML5 History API do React Router funcionasse corretamente ao recarregar a página dentro do container. A integração contínua via GitHub Actions garantiu que qualquer commit no repositório valide a compilação do bundle e disponibilize automaticamente uma imagem pronta para produção.
