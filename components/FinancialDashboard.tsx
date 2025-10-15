'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import IncomeInput from './IncomeInput'
import ExpenseForm from './ExpenseForm'
import ExpenseList from './ExpenseList'
import Summary from './Summary'
import ExpenseChart from './ExpenseChart'
import ScenarioSimulator from './ScenarioSimulator'
import GoalForm from './GoalForm'
import GoalsList from './GoalsList'
import ReportsSection from './ReportsSection'
import RetirementProjection from './RetirementProjection'
import TransactionsSection from './TransactionsSection'
import styles from './FinancialDashboard.module.css'

export interface Expense {
  id: string
  name: string
  amount: number
  category?: string
  date?: string
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
}

export interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  balance: number
  savingsPercentage: number
}

interface FinancialData {
  income: number
  expenses: Expense[]
  goals: SavingsGoal[]
  lastUpdated: string
}

interface FinancialDashboardProps {
  onBackToHome?: () => void
}

export default function FinancialDashboard({ onBackToHome }: FinancialDashboardProps) {
  const [income, setIncome] = useState<number>(0)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'reports' | 'retirement' | 'transactions'>('overview')

  // Persistência de dados no localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('financialData')
    if (savedData) {
      try {
        const data: FinancialData = JSON.parse(savedData)
        setIncome(data.income || 0)
        setExpenses(data.expenses || [])
        setGoals(data.goals || [])
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error)
      }
    }
  }, [])

  // Salvar dados automaticamente
  useEffect(() => {
    const data: FinancialData = {
      income,
      expenses,
      goals,
      lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem('financialData', JSON.stringify(data))
  }, [income, expenses, goals])

  const summary = useMemo<FinancialSummary>(() => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const balance = income - totalExpenses
    const savingsPercentage = income > 0 ? (balance / income) * 100 : 0

    return {
      totalIncome: income,
      totalExpenses,
      balance,
      savingsPercentage,
    }
  }, [income, expenses])

  const handleAddExpense = useCallback((name: string, amount: number, category?: string) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      name,
      amount,
      category: category || 'Outros',
      date: new Date().toISOString().split('T')[0],
    }
    setExpenses(prev => [...prev, newExpense])
  }, [])

  const handleRemoveExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id))
  }, [])

  const handleAddGoal = useCallback((name: string, targetAmount: number, deadline: string) => {
    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      name,
      targetAmount,
      currentAmount: 0,
      deadline,
    }
    setGoals(prev => [...prev, newGoal])
  }, [])

  const handleUpdateGoal = useCallback((id: string, currentAmount: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, currentAmount } : goal
    ))
  }, [])

  const handleRemoveGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id))
  }, [])

  const exportData = useCallback(() => {
    const data = {
      income,
      expenses,
      goals,
      summary,
      exportDate: new Date().toISOString(),
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `financial-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [income, expenses, goals, summary])

  const clearAllData = useCallback(() => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      setIncome(0)
      setExpenses([])
      setGoals([])
      localStorage.removeItem('financialData')
    }
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Header Profissional */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-700 px-10 py-4 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 text-blue-500">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">SimTechPro</h2>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <button 
            className={`text-sm font-medium transition-colors ${activeTab === 'overview' ? 'text-blue-400' : 'text-slate-400 hover:text-blue-400'}`}
            onClick={() => setActiveTab('overview')}
          >
            Dashboard
          </button>
          <button 
            className={`text-sm font-medium transition-colors ${activeTab === 'retirement' ? 'text-blue-400' : 'text-slate-400 hover:text-blue-400'}`}
            onClick={() => setActiveTab('retirement')}
          >
            Simulador
          </button>
          <button 
            className={`text-sm font-medium transition-colors ${activeTab === 'reports' ? 'text-blue-400' : 'text-slate-400 hover:text-blue-400'}`}
            onClick={() => setActiveTab('reports')}
          >
            Relatórios
          </button>
          <button 
            className={`text-sm font-medium transition-colors ${activeTab === 'goals' ? 'text-blue-400' : 'text-slate-400 hover:text-blue-400'}`}
            onClick={() => setActiveTab('goals')}
          >
            Metas
          </button>
          <button 
            className={`text-sm font-medium transition-colors ${activeTab === 'transactions' ? 'text-blue-400' : 'text-slate-400 hover:text-blue-400'}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transações
          </button>
        </nav>
        <div className="flex items-center gap-4">
          {onBackToHome && (
            <button 
              onClick={onBackToHome}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              title="Voltar ao Início"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m12 19-7-7 7-7"/>
                <path d="M19 12H5"/>
              </svg>
              Voltar ao Início
            </button>
          )}
          <button 
            onClick={exportData}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
            title="Exportar Dados"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">U</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-20 bg-slate-900">
        <div className="mx-auto max-w-7xl">

          {/* Overview Dashboard */}
          {activeTab === 'overview' && (
            <>
              <h1 className="text-3xl font-bold text-white mb-8">Visão Geral do Orçamento</h1>
              
              {/* Cards de Resumo */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                <div className="rounded-lg bg-slate-800/50 backdrop-blur-sm p-6 border border-slate-700">
                  <p className="text-sm font-medium text-slate-400">Receitas</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    R$ {summary.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/50 backdrop-blur-sm p-6 border border-slate-700">
                  <p className="text-sm font-medium text-slate-400">Despesas</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    R$ {summary.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/50 backdrop-blur-sm p-6 border border-slate-700">
                  <p className="text-sm font-medium text-slate-400">Saldo Disponível</p>
                  <p className={`mt-2 text-3xl font-bold ${summary.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    R$ {summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Formulários de entrada */}
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 mb-10">
                <div className="rounded-lg bg-slate-800/50 backdrop-blur-sm p-6 border border-slate-700">
                  <h2 className="text-xl font-bold text-white mb-6">Adicionar Receita</h2>
                  <IncomeInput income={income} onIncomeChange={setIncome} />
                </div>
                <div className="rounded-lg bg-slate-800/50 backdrop-blur-sm p-6 border border-slate-700">
                  <h2 className="text-xl font-bold text-white mb-6">Adicionar Despesa</h2>
                  <ExpenseForm onAddExpense={handleAddExpense} />
                </div>
              </div>

              {/* Grid Principal */}
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 mb-10">
                {/* Gráfico de Despesas */}
                <div className="rounded-lg bg-slate-800/50 backdrop-blur-sm p-6 border border-slate-700">
                  <h2 className="text-xl font-bold text-white mb-6">Distribuição de Gastos</h2>
                  <ExpenseChart expenses={expenses} />
                </div>

                {/* Lista de Despesas */}
                <div className="rounded-lg bg-slate-800/50 backdrop-blur-sm p-6 border border-slate-700">
                  <h2 className="text-xl font-bold text-white mb-6">Histórico de Despesas</h2>
                  <ExpenseList expenses={expenses} onRemoveExpense={handleRemoveExpense} />
                </div>
              </div>

              {/* Simulador - Full Width */}
              <div className="rounded-lg bg-slate-800/50 backdrop-blur-sm p-6 border border-slate-700">
                <h2 className="text-xl font-bold text-white mb-6">Simulador de Cenários</h2>
                <ScenarioSimulator
                  currentIncome={income}
                  currentExpenses={expenses}
                  currentSummary={summary}
                />
              </div>
            </>
          )}

          {/* Metas */}
          {activeTab === 'goals' && (
            <>
              <h1 className="text-3xl font-bold text-white mb-8">Acompanhamento de Metas</h1>
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                <div className="rounded-lg bg-slate-800/50 backdrop-blur-sm p-6 border border-slate-700">
                  <h2 className="text-xl font-bold text-white mb-6">Nova Meta</h2>
                  <GoalForm onAddGoal={handleAddGoal} />
                </div>
                <div className="rounded-lg bg-slate-800/50 backdrop-blur-sm p-6 border border-slate-700">
                  <h2 className="text-xl font-bold text-white mb-6">Suas Metas</h2>
                  <GoalsList 
                    goals={goals} 
                    currentBalance={summary.balance}
                    onUpdateGoal={handleUpdateGoal}
                    onRemoveGoal={handleRemoveGoal}
                  />
                </div>
              </div>
            </>
          )}

          {/* Relatórios */}
          {activeTab === 'reports' && (
            <>
              <h1 className="text-3xl font-bold text-white mb-8">Relatórios Financeiros</h1>
              {summary.totalIncome === 0 && expenses.length === 0 ? (
                <div className="rounded-lg bg-slate-800/50 backdrop-blur-sm p-12 border border-slate-700 text-center">
                  <p className="text-lg text-slate-400 mb-4">📊 Adicione receitas e despesas para ver relatórios detalhados</p>
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors"
                  >
                    Ir para Dashboard
                  </button>
                </div>
              ) : (
                <div className="rounded-lg bg-slate-800/50 backdrop-blur-sm p-6 border border-slate-700">
                  <ReportsSection 
                    income={income}
                    expenses={expenses}
                    summary={summary}
                    goals={goals}
                  />
                </div>
              )}
            </>
          )}

          {/* Simulador de Aposentadoria */}
          {activeTab === 'retirement' && (
            <>
              <h1 className="text-3xl font-bold text-white mb-8">Projeção de Aposentadoria</h1>
              {summary.totalIncome > 0 ? (
                <div className="rounded-lg bg-slate-800/50 backdrop-blur-sm p-6 border border-slate-700">
                  <RetirementProjection
                    income={summary.totalIncome}
                    expenses={summary.totalExpenses}
                    currentAge={30}
                    retirementAge={65}
                    currentSavings={Math.max(0, summary.balance * 12)}
                    monthlyContribution={Math.max(0, summary.balance)}
                    expectedReturn={0.07}
                  />
                </div>
              ) : (
                <div className="rounded-lg bg-slate-800/50 backdrop-blur-sm p-12 border border-slate-700 text-center">
                  <h2 className="text-xl font-bold text-white mb-4">📈 Projeção de Aposentadoria</h2>
                  <p className="text-slate-400 mb-6">Para visualizar sua projeção de aposentadoria, você precisa primeiro:</p>
                  <ul className="text-left text-slate-400 mb-6 inline-block">
                    <li>✅ Inserir sua renda mensal na aba &quot;Visão Geral&quot;</li>
                    <li>✅ Adicionar suas despesas mensais</li>
                    <li>✅ O sistema calculará automaticamente sua capacidade de poupança</li>
                  </ul>
                  <div>
                    <button 
                      onClick={() => setActiveTab('overview')}
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors"
                    >
                      Ir para Visão Geral
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Transações */}
          {activeTab === 'transactions' && (
            <>
              <TransactionsSection 
                income={income}
                expenses={expenses}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
