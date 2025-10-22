# SimTechPro - Simulador Financeiro Pessoal

Uma aplicação web interativa desenvolvida com Next.js 14+, React e TypeScript para ajudar usuários a compreender o impacto de suas decisões financeiras no equilíbrio orçamentário.

## � Demonstração Online

**🔗 [Acesse a Aplicação](https://matheusgino71.github.io/a3-ter-a/)**

> 📱 **Totalmente responsivo** - Funciona perfeitamente em desktop, tablet e mobile
> 
> **Deploy automático** - Atualizado automaticamente via GitHub Actions

## Objetivo

Responder à questão: **"Como a simulação de cenários financeiros pode influenciar a tomada de decisão e o comportamento de planejamento pessoal dos usuários?"**

## Funcionalidades

- **Gerenciamento de Renda**: Insira e acompanhe sua renda mensal
- **Controle de Despesas**: Adicione, edite e remova despesas com facilidade
- **Resumo Financeiro em Tempo Real**: Visualize saldo mensal e taxa de economia instantaneamente
- **Gráfico Interativo**: Veja a distribuição de suas despesas em um gráfico de pizza
- **Simulação de Cenários**: Experimente diferentes cenários financeiros e compare resultados
- **Metas de Economia**: Defina e acompanhe metas financeiras
- **Projeção de Aposentadoria**: Calcule sua aposentadoria com base nos dados atuais
- **Histórico de Transações**: Visualize e filtre todas as suas transações
- **Design Profissional**: Interface moderna com glassmorphism e tema escuro

## Tecnologias Utilizadas

- **Framework**: Next.js 15+ (App Router)
- **Linguagem**: TypeScript
- **Biblioteca de Gráficos**: Chart.js + react-chartjs-2
- **Estilização**: Tailwind CSS + CSS Modules
- **Gerenciamento de Estado**: React Hooks (useState, useMemo, useCallback)
- **Persistência**: localStorage

## 📁 Estrutura do Projeto

```
/
├── app/
│   ├── layout.tsx          # Layout principal com configuração de fontes
│   ├── page.tsx            # Página inicial com vídeo background
│   └── page.module.css     # Estilos da página
├── components/
│   ├── FinancialDashboard.tsx         # Dashboard principal
│   ├── IncomeInput.tsx                # Input de renda
│   ├── ExpenseForm.tsx                # Formulário de despesas
│   ├── ExpenseList.tsx                # Lista de despesas
│   ├── ExpenseChart.tsx               # Gráfico de despesas
│   ├── Summary.tsx                    # Resumo financeiro
│   ├── ScenarioSimulator.tsx          # Simulador de cenários
│   ├── GoalForm.tsx                   # Formulário de metas
│   ├── GoalsList.tsx                  # Lista de metas
│   ├── ReportsSection.tsx             # Seção de relatórios
│   ├── RetirementProjection.tsx       # Projeção de aposentadoria
│   └── TransactionsSection.tsx        # Histórico de transações
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

## Como Usar

1. **Acesse a Plataforma**: Clique em "Acessar Plataforma" na tela inicial

2. **Adicione sua Renda**: Na aba "Dashboard", insira sua renda mensal

3. **Registre Despesas**: Use o formulário para adicionar despesas com categoria

4. **Defina Metas**: Na aba "Metas", crie objetivos de economia

5. **Visualize Relatórios**: Acesse a aba "Relatórios" para análises detalhadas

6. **Projete sua Aposentadoria**: Use o "Simulador" para planejar o futuro

7. **Acompanhe Transações**: Na aba "Transações", veja todo o histórico

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
```

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
