# Nexus - Conectando Suas Finanças ao Futuro

Uma aplicação web interativa desenvolvida com Next.js 14+, React e TypeScript para ajudar usuários a compreender o impacto de suas decisões financeiras no equilíbrio orçamentário.

> **Nexus** significa "conexão" ou "ponto de ligação". Nossa plataforma conecta suas decisões financeiras de hoje com seus objetivos futuros, criando uma ponte inteligente entre o presente e o amanhã que você deseja construir.

## � Demonstração Online

**🔗 [Acesse a Aplicação](https://matheusgino71.github.io/a3-ter-a/)**

> 📱 **Totalmente responsivo** - Funciona perfeitamente em desktop, tablet e mobile
> 
> **Deploy automático** - Atualizado automaticamente via GitHub Actions

## Objetivo

Responder à questão: **"Como a simulação de cenários financeiros pode influenciar a tomada de decisão e o comportamento de planejamento pessoal dos usuários?"**

## Funcionalidades

- **🔐 Sistema de Autenticação**: Login/cadastro com e-mail ou Google
- **👤 Perfil de Usuário Completo**: 
  - Dados pessoais (nome, email, telefone, ocupação)
  - Perfil financeiro (renda mensal, objetivo, perfil de risco)
  - Segurança (alteração de senha)
- **☁️ Sincronização na Nuvem**: Todos os dados salvos automaticamente no Firebase Firestore
- **💰 Gerenciamento de Renda**: Insira e acompanhe sua renda mensal
- **📊 Controle de Despesas**: Adicione, edite e remova despesas com categorias
- **💹 Resumo Financeiro em Tempo Real**: Visualize saldo mensal e taxa de economia instantaneamente
- **📈 Gráficos Interativos**: Visualize a distribuição de suas despesas em gráficos profissionais
- **📊 Analytics Dashboard**: Painel estilo Power BI com 7+ tipos de gráficos interativos
- **🎯 Simulação de Cenários**: Experimente diferentes cenários financeiros e compare resultados com gráficos
- **🎯 Metas de Economia**: Defina e acompanhe metas financeiras com progresso visual
- **🏖️ Projeção de Aposentadoria**: Calcule sua aposentadoria com base nos dados atuais
- **📜 Histórico de Transações**: Visualize e filtre todas as suas transações
- **📤 Exportação de Dados**: Exporte seus dados em formato CSV
- **🎨 Design Profissional**: Interface moderna com glassmorphism e tema escuro

## Tecnologias Utilizadas

- **Framework**: Next.js 15+ (App Router)
- **Linguagem**: TypeScript
- **Autenticação**: Firebase Authentication (Email/Password + Google)
- **Banco de Dados**: Firebase Firestore (NoSQL em tempo real)
- **Analytics**: Firebase Analytics
- **Biblioteca de Gráficos**: 
  - Chart.js 4.4+ + react-chartjs-2
  - Recharts 2.x (Analytics Dashboard)
- **Estilização**: Tailwind CSS + CSS Modules
- **Gerenciamento de Estado**: React Hooks (useState, useMemo, useCallback, useEffect)
- **Persistência**: Firebase Firestore com sincronização automática
- **Deployment**: Firebase Hosting

## 📁 Estrutura do Projeto

```
/
├── app/
│   ├── layout.tsx          # Layout principal com configuração de fontes
│   ├── page.tsx            # Página inicial com vídeo background
│   └── page.module.css     # Estilos da página
├── components/
│   ├── AuthForm.tsx                   # Autenticação (login/cadastro)
│   ├── UserProfile.tsx                # Perfil do usuário (NOVO)
│   ├── FinancialDashboard.tsx         # Dashboard principal
│   ├── AnalyticsDashboard.tsx         # Analytics estilo Power BI (NOVO)
│   ├── IncomeInput.tsx                # Input de renda
│   ├── ExpenseForm.tsx                # Formulário de despesas
│   ├── ExpenseList.tsx                # Lista de despesas
│   ├── ExpenseChart.tsx               # Gráfico de despesas
│   ├── Summary.tsx                    # Resumo financeiro
│   ├── ScenarioSimulator.tsx          # Simulador de cenários com gráficos
│   ├── GoalForm.tsx                   # Formulário de metas
│   ├── GoalsList.tsx                  # Lista de metas
│   ├── ReportsSection.tsx             # Seção de relatórios
│   ├── RetirementProjection.tsx       # Projeção de aposentadoria
│   ├── TransactionsSection.tsx        # Histórico de transações
│   └── VideoBackground.tsx            # Componente de vídeo background
├── lib/
│   └── firebase.ts                    # Configuração do Firebase
├── styles/
│   └── globals.css          # Estilos globais
├── public/
│   └── Design sem nome.mp4  # Vídeo de background
├── package.json
├── tsconfig.json
└── next.config.js
```

## Como Executar o Projeto

### Pré-requisitos

- Node.js 18.17 ou superior
- NPM ou Yarn

### Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/MatheusGino71/a3-ter-a.git
   cd a3-ter-a
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

   As principais dependências incluem:
   - `next@^15.5.4`
   - `react@^18.3.0`
   - `react-dom@^18.3.0`
   - `chart.js@^4.4.0`
   - `react-chartjs-2@^5.2.0`
   - `typescript@^5.0.0`

### Modo Desenvolvimento

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:3000**

### Build de Produção

Para criar uma build otimizada:

```bash
npm run build
```

Para executar a build de produção:

```bash
npm start
```

## 🔥 Deploy no Firebase

### Configuração Inicial do Firebase

1. **Instale o Firebase CLI globalmente**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Faça login no Firebase**:
   ```bash
   firebase login
   ```

3. **O projeto já está configurado**, mas se precisar inicializar novamente:
   ```bash
   firebase init
   ```
   - Selecione "Hosting"
   - Escolha o projeto "a3-terca"
   - Use "out" como diretório público
   - Configure como single-page app: Yes

### Deploy da Aplicação

Para fazer deploy da aplicação no Firebase Hosting:

```bash
npm run deploy
```

Ou manualmente:

```bash
npm run build
firebase deploy
```

A aplicação será hospedada em: `https://a3-terca.web.app`

### Configuração do Firebase no Projeto

O Firebase já está configurado em `lib/firebase.ts` com:
- **Authentication**: Login com e-mail/senha e Google
- **Firestore**: Banco de dados para armazenar dados financeiros dos usuários
- **Analytics**: Rastreamento de uso (opcional)

## Como Usar

1. **Acesse a Plataforma**: Clique em "Acessar Plataforma" na tela inicial

2. **Faça Login ou Cadastre-se**: Use e-mail/senha ou login rápido com Google

3. **Configure seu Perfil**: 
   - Clique no botão "Perfil" no header
   - Preencha dados pessoais (nome, email, telefone, ocupação)
   - Configure perfil financeiro (renda mensal, objetivo, perfil de risco)
   - Todos os dados são salvos automaticamente no Firebase

4. **Adicione sua Renda**: Na aba "Dashboard", insira sua renda mensal

5. **Registre Despesas**: Use o formulário para adicionar despesas com categorias

6. **Defina Metas**: Na aba "Metas", crie objetivos de economia

7. **Visualize Analytics**: Acesse a aba "Analytics" para ver gráficos avançados estilo Power BI

8. **Simule Cenários**: Na aba "Simulador", experimente diferentes situações financeiras

9. **Projete sua Aposentadoria**: Use o "Simulador" para planejar o futuro

10. **Acompanhe Transações**: Na aba "Transações", veja todo o histórico

11. **Exporte Dados**: Use o botão de exportar para baixar seus dados em CSV

## 🎨 Características da Interface

- **Design Moderno**: Interface profissional com glassmorphism
- **Tema Escuro**: Palette de cores otimizada para conforto visual
- **Responsivo**: Funciona perfeitamente em todos os dispositivos
- **Navegação Intuitiva**: Abas organizadas no header principal
- **Feedback Visual**: Cores semânticas para diferentes estados
- **Animações Suaves**: Transições e hover effects profissionais

## 🧩 Arquitetura dos Componentes

### Dashboard Principal
- **FinancialDashboard**: Orquestra todas as seções com navegação por abas
- **Header Profissional**: Logo, navegação e ações do usuário
- **Layout Responsivo**: Grid system com Tailwind CSS

### Seções Funcionais
- **Overview**: Resumo geral com cards e gráficos
- **Metas**: Gerenciamento de objetivos financeiros
- **Relatórios**: Análises e insights detalhados
- **Simulador**: Projeção de aposentadoria
- **Transações**: Histórico completo com filtros

### Componentes Reutilizáveis
- **Formulários**: Validação e feedback em tempo real
- **Gráficos**: Integração com Chart.js customizada
- **Cards**: Componentes modulares para dados
- **Tabelas**: Listagem responsiva com ações

## 🔧 Configuração TypeScript

Interfaces bem estruturadas:

```typescript
interface Expense {
  id: string
  name: string
  amount: number
  category?: string
  date?: string
}

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  createdAt: string
}

interface UserProfileData {
  displayName: string
  email: string
  phoneNumber: string
  occupation: string
  monthlyIncome: number
  financialGoal: string
  riskProfile: 'conservador' | 'moderado' | 'arrojado'
  createdAt: string
  updatedAt: string
}
```

## 🔥 Sistema de Perfil de Usuário

### Funcionalidades do Perfil

O sistema de perfil permite que cada usuário:

1. **Dados Pessoais**:
   - Nome completo
   - Email (sincronizado com Firebase Auth)
   - Telefone
   - Ocupação

2. **Perfil Financeiro**:
   - Renda mensal
   - Objetivo financeiro principal
   - Perfil de risco (Conservador, Moderado, Arrojado)

3. **Segurança**:
   - Alteração de senha
   - Validação de senha forte

### Armazenamento de Dados

Todos os dados do usuário são armazenados no Firebase Firestore com a seguinte estrutura:

```
users/
  └── {userId}/
      ├── displayName: string
      ├── email: string
      ├── phoneNumber: string
      ├── occupation: string
      ├── monthlyIncome: number
      ├── financialGoal: string
      ├── riskProfile: string
      ├── createdAt: timestamp
      ├── updatedAt: timestamp
      ├── income: number
      ├── expenses: array
      └── goals: array
```

### Sincronização Automática

- ✅ Dados salvos em tempo real no Firebase
- ✅ Sincronização entre dispositivos
- ✅ Backup automático na nuvem
- ✅ Isolamento de dados por usuário (cada usuário vê apenas seus dados)

## 📝 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm start` - Execução em produção
- `npm run lint` - Verificação de código

## 🌟 Destaques Técnicos

- **Performance**: Otimizada com `useMemo` e `useCallback`
- **Persistência**: Dados salvos em localStorage
- **Validação**: Verificações em tempo real
- **Acessibilidade**: Estrutura semântica e ARIA labels
- **SEO**: Metadata otimizada com Next.js
- **Fontes**: Otimização automática com `next/font/google`

## 🎥 Demonstração

A aplicação inclui:
- Tela inicial com vídeo background profissional
- Dashboard completo com múltiplas funcionalidades
- Interface responsiva e moderna
- Dados persistentes entre sessões

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.

## 👨‍💻 Desenvolvimento

Desenvolvido usando as melhores práticas de desenvolvimento web moderno, incluindo Next.js 15, TypeScript, Tailwind CSS e design system profissional.
