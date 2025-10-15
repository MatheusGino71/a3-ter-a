# SimTechPro - Simulador Financeiro Pessoal

Uma aplicação web interativa desenvolvida com Next.js 14+, React e TypeScript para ajudar usuários a compreender o impacto de suas decisões financeiras no equilíbrio orçamentário.

## 🎯 Objetivo

Responder à questão: **"Como a simulação de cenários financeiros pode influenciar a tomada de decisão e o comportamento de planejamento pessoal dos usuários?"**

## ✨ Funcionalidades

- **Gerenciamento de Renda**: Insira e acompanhe sua renda mensal
- **Controle de Despesas**: Adicione, edite e remova despesas com facilidade
- **Resumo Financeiro em Tempo Real**: Visualize saldo mensal e taxa de economia instantaneamente
- **Gráfico Interativo**: Veja a distribuição de suas despesas em um gráfico de pizza
- **Simulação de Cenários**: Experimente diferentes cenários financeiros e compare resultados
- **Insights Automáticos**: Receba alertas e recomendações baseadas em sua situação financeira

## 🛠️ Tecnologias Utilizadas

- **Framework**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript
- **Biblioteca de Gráficos**: Chart.js + react-chartjs-2
- **Estilização**: CSS Modules
- **Gerenciamento de Estado**: React Hooks (useState, useMemo, useCallback)

## 📁 Estrutura do Projeto

```
/
├── app/
│   ├── layout.tsx          # Layout principal da aplicação
│   ├── page.tsx             # Página inicial
│   └── page.module.css      # Estilos da página
├── components/
│   ├── FinancialDashboard.tsx         # Componente principal
│   ├── FinancialDashboard.module.css
│   ├── IncomeInput.tsx                # Input de renda
│   ├── IncomeInput.module.css
│   ├── ExpenseForm.tsx                # Formulário de despesas
│   ├── ExpenseForm.module.css
│   ├── ExpenseList.tsx                # Lista de despesas
│   ├── ExpenseList.module.css
│   ├── Summary.tsx                    # Resumo financeiro
│   ├── Summary.module.css
│   ├── ExpenseChart.tsx               # Gráfico de despesas
│   ├── ExpenseChart.module.css
│   ├── ScenarioSimulator.tsx          # Simulador de cenários
│   └── ScenarioSimulator.module.css
├── styles/
│   └── globals.css          # Estilos globais
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js 18.17 ou superior
- NPM ou Yarn

### Instalação

1. **Clone o repositório** (ou extraia os arquivos)

2. **Instale as dependências**:
   ```bash
   npm install
   ```

   As principais dependências incluem:
   - `next@^15.0.0`
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

## 📊 Como Usar

1. **Insira sua Renda**: Digite o valor da sua renda mensal no campo "Renda Mensal"

2. **Adicione Despesas**: Use o formulário para adicionar suas despesas com nome e valor

3. **Visualize o Resumo**: Acompanhe em tempo real:
   - Renda Total
   - Despesas Totais
   - Saldo Mensal
   - Taxa de Economia

4. **Analise o Gráfico**: Veja a distribuição percentual de suas despesas

5. **Simule Cenários**: 
   - Ajuste a renda simulada
   - Adicione ou modifique despesas no simulador
   - Compare resultados atual vs. simulado
   - Receba insights sobre o impacto das mudanças

## 🎨 Características da Interface

- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Interface Intuitiva**: Componentes organizados e fáceis de usar
- **Feedback Visual**: Cores indicativas para saldo positivo/negativo
- **Animações Suaves**: Transições e efeitos hover para melhor UX
- **Alertas Inteligentes**: Notificações quando taxa de economia está baixa ou há déficit

## 🧩 Componentização

A aplicação segue princípios de componentização do React:

- **FinancialDashboard**: Gerencia o estado global e orquestra os componentes
- **IncomeInput**: Componente controlado para entrada de renda
- **ExpenseForm**: Formulário com validação para novas despesas
- **ExpenseList**: Lista renderizada com botões de remoção
- **Summary**: Cards informativos com cálculos em tempo real
- **ExpenseChart**: Integração com Chart.js para visualização de dados
- **ScenarioSimulator**: Simulador independente com estado próprio

## 🔧 Configuração TypeScript

O projeto utiliza TypeScript com configurações estritas para garantir type safety:

- Interfaces bem definidas (`Expense`, `FinancialSummary`)
- Props tipadas em todos os componentes
- Uso correto de hooks com generics

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm start` - Executa a aplicação em modo produção
- `npm run lint` - Executa o linter ESLint

## 🌟 Destaques Técnicos

- **Performance Otimizada**: Uso de `useMemo` e `useCallback` para evitar re-renderizações desnecessárias
- **Código Limpo**: Seguindo best practices do React e TypeScript
- **CSS Modular**: Estilos escopados evitando conflitos
- **Acessibilidade**: Labels apropriados e estrutura semântica HTML

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.

## 👨‍💻 Desenvolvimento

Desenvolvido com ❤️ usando as melhores práticas de desenvolvimento web moderno.
