'use client'

import { useMemo, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import { Expense, SavingsGoal } from './FinancialDashboard'
import styles from './AnalyticsDashboard.module.css'

interface AnalyticsDashboardProps {
  income: number
  expenses: Expense[]
  goals: SavingsGoal[]
}

const COLORS = {
  Alimentação: '#ef4444',
  Transporte: '#3b82f6',
  Moradia: '#8b5cf6',
  Lazer: '#fb923c',
  Saúde: '#22c55e',
  Educação: '#ec4899',
  Outros: '#94a3b8'
}

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']

// Estilo personalizado para tooltips
const customTooltipStyle = {
  backgroundColor: 'rgba(15, 23, 42, 0.95)',
  border: '1px solid rgba(96, 165, 250, 0.3)',
  borderRadius: '0.75rem',
  padding: '1rem',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(12px)'
}

const customTooltipContentStyle = {
  color: '#e2e8f0',
  fontSize: '0.9rem',
  fontWeight: '600'
}

export default function AnalyticsDashboard({ income, expenses, goals }: AnalyticsDashboardProps) {
  const [timeFilter, setTimeFilter] = useState<'7days' | '30days' | '90days' | 'all'>('30days')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const balance = income - totalExpenses
    const savingsRate = income > 0 ? (balance / income) * 100 : 0
    const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0

    // Calcular tendência (comparar com período anterior)
    const currentMonthExpenses = totalExpenses
    const previousMonthExpenses = totalExpenses * 0.9 // Simulado
    const trend = previousMonthExpenses > 0 
      ? ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100 
      : 0

    return {
      totalExpenses,
      balance,
      savingsRate,
      avgExpense,
      trend,
      totalGoals: goals.length,
      goalsProgress: goals.length > 0 
        ? (goals.filter(g => g.currentAmount >= g.targetAmount).length / goals.length) * 100 
        : 0
    }
  }, [income, expenses, goals])

  // Dados para gráfico de despesas por categoria
  const expensesByCategory = useMemo(() => {
    const categories: { [key: string]: number } = {}
    
    expenses.forEach(expense => {
      const category = expense.category || 'Outros'
      categories[category] = (categories[category] || 0) + expense.amount
    })

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
      percentage: income > 0 ? (value / income) * 100 : 0
    }))
  }, [expenses, income])

  // Dados para gráfico de evolução temporal
  const expensesOverTime = useMemo(() => {
    const grouped: { [key: string]: { date: string; total: number; count: number } } = {}
    
    expenses.forEach(expense => {
      const date = expense.date || new Date().toISOString().split('T')[0]
      const dateKey = date.split('T')[0]
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = { date: dateKey, total: 0, count: 0 }
      }
      
      grouped[dateKey].total += expense.amount
      grouped[dateKey].count += 1
    })

    return Object.values(grouped)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30)
  }, [expenses])

  // Dados para comparação de receita vs despesas
  const incomeVsExpenses = useMemo(() => {
    const monthlyData = expensesOverTime.slice(-12).map(day => ({
      name: new Date(day.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
      Receita: income / 30,
      Despesas: day.total,
      Economia: (income / 30) - day.total
    }))

    return monthlyData
  }, [income, expensesOverTime])

  // Dados para análise de metas
  const goalsData = useMemo(() => {
    return goals.map(goal => ({
      name: goal.name.length > 15 ? goal.name.substring(0, 15) + '...' : goal.name,
      progresso: (goal.currentAmount / goal.targetAmount) * 100,
      faltam: goal.targetAmount - goal.currentAmount,
      atual: goal.currentAmount,
      meta: goal.targetAmount
    }))
  }, [goals])

  // Dados para radar de distribuição de gastos
  const categoryDistribution = useMemo(() => {
    const total = expensesByCategory.reduce((sum, cat) => sum + cat.value, 0)
    return expensesByCategory.map(cat => ({
      category: cat.name,
      value: total > 0 ? (cat.value / total) * 100 : 0,
      amount: cat.value
    }))
  }, [expensesByCategory])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const exportToCSV = () => {
    const headers = ['Data', 'Descrição', 'Categoria', 'Valor']
    const rows = expenses.map(exp => [
      exp.date || new Date().toISOString().split('T')[0],
      exp.name,
      exp.category || 'Outros',
      exp.amount.toString()
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className={styles['analytics-dashboard']}>
      {/* Header */}
      <div className={styles['dashboard-header']}>
        <h1 className={styles['dashboard-title']}>Painel de Análise Financeira</h1>
        <p className={styles['dashboard-subtitle']}>
          Visualize seus dados financeiros de forma inteligente e interativa
        </p>
      </div>

      {/* Filtros */}
      <div className={styles['filters-bar']}>
        <button
          className={`${styles['filter-button']} ${timeFilter === '7days' ? styles.active : ''}`}
          onClick={() => setTimeFilter('7days')}
        >
          7 dias
        </button>
        <button
          className={`${styles['filter-button']} ${timeFilter === '30days' ? styles.active : ''}`}
          onClick={() => setTimeFilter('30days')}
        >
          30 dias
        </button>
        <button
          className={`${styles['filter-button']} ${timeFilter === '90days' ? styles.active : ''}`}
          onClick={() => setTimeFilter('90days')}
        >
          90 dias
        </button>
        <button
          className={`${styles['filter-button']} ${timeFilter === 'all' ? styles.active : ''}`}
          onClick={() => setTimeFilter('all')}
        >
          Tudo
        </button>
        <button className={styles['export-button']} onClick={exportToCSV}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Exportar CSV
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className={styles['stats-grid']}>
        <div className={styles['stat-card']}>
          <div className={styles['stat-header']}>
            <div className={`${styles['stat-icon']} ${styles.blue}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className={`${styles['stat-trend']} ${stats.balance >= 0 ? styles.positive : styles.negative}`}>
              {stats.balance >= 0 ? '↗' : '↘'} {Math.abs(stats.trend).toFixed(1)}%
            </div>
          </div>
          <div className={styles['stat-label']}>Saldo Atual</div>
          <div className={styles['stat-value']}>{formatCurrency(stats.balance)}</div>
          <div className={styles['stat-description']}>
            {stats.balance >= 0 ? 'Positivo este mês' : 'Negativo este mês'}
          </div>
        </div>

        <div className={styles['stat-card']}>
          <div className={styles['stat-header']}>
            <div className={`${styles['stat-icon']} ${styles.purple}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <div className={`${styles['stat-trend']} ${styles.positive}`}>
              ↗ {stats.savingsRate.toFixed(1)}%
            </div>
          </div>
          <div className={styles['stat-label']}>Taxa de Economia</div>
          <div className={styles['stat-value']}>{stats.savingsRate.toFixed(1)}%</div>
          <div className={styles['stat-description']}>
            Da sua renda mensal
          </div>
        </div>

        <div className={styles['stat-card']}>
          <div className={styles['stat-header']}>
            <div className={`${styles['stat-icon']} ${styles.orange}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div className={`${styles['stat-trend']} ${styles.positive}`}>
              {goals.length} {goals.length === 1 ? 'meta' : 'metas'}
            </div>
          </div>
          <div className={styles['stat-label']}>Progresso de Metas</div>
          <div className={styles['stat-value']}>{stats.goalsProgress.toFixed(0)}%</div>
          <div className={styles['stat-description']}>
            Metas concluídas
          </div>
        </div>

        <div className={styles['stat-card']}>
          <div className={styles['stat-header']}>
            <div className={`${styles['stat-icon']} ${styles.green}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
            </div>
            <div className={`${styles['stat-trend']} ${styles.positive}`}>
              {expenses.length} lançamentos
            </div>
          </div>
          <div className={styles['stat-label']}>Gasto Médio</div>
          <div className={styles['stat-value']}>{formatCurrency(stats.avgExpense)}</div>
          <div className={styles['stat-description']}>
            Por transação
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className={styles['charts-grid']}>
        {/* Gráfico de Pizza - Despesas por Categoria */}
        <div className={styles['chart-card']}>
          <div className={styles['chart-header']}>
            <h3 className={styles['chart-title']}>Distribuição por Categoria</h3>
            <p className={styles['chart-subtitle']}>Análise de gastos por categoria</p>
          </div>
          <div className={styles['chart-container']}>
            {expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name}: ${entry.percentage.toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Outros}
                        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={customTooltipStyle}
                    labelStyle={customTooltipContentStyle}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles['empty-state']}>
                <div className={styles['empty-state-icon']}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </div>
                <div className={styles['empty-state-title']}>Nenhuma despesa registrada</div>
                <div className={styles['empty-state-text']}>Adicione despesas para ver os gráficos</div>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico de Barras - Despesas por Categoria */}
        <div className={styles['chart-card']}>
          <div className={styles['chart-header']}>
            <h3 className={styles['chart-title']}>Ranking de Categorias</h3>
            <p className={styles['chart-subtitle']}>Categorias com maiores gastos</p>
          </div>
          <div className={styles['chart-container']}>
            {expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expensesByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(96,165,250,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8"
                    style={{ fontSize: '0.85rem', fontWeight: '600' }}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    tickFormatter={(value) => formatCurrency(value)}
                    style={{ fontSize: '0.85rem', fontWeight: '600' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={customTooltipStyle}
                    labelStyle={customTooltipContentStyle}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#3b82f6" 
                    radius={[8, 8, 0, 0]}
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Outros}
                        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles['empty-state']}>
                <div className={styles['empty-state-icon']}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </div>
                <div className={styles['empty-state-title']}>Nenhuma despesa registrada</div>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico de Área - Evolução Temporal */}
        <div className={`${styles['chart-card']} ${styles['full-width']}`}>
          <div className={styles['chart-header']}>
            <h3 className={styles['chart-title']}>Evolução de Despesas ao Longo do Tempo</h3>
            <p className={styles['chart-subtitle']}>Últimos 30 dias de movimentações</p>
          </div>
          <div className={styles['chart-container']}>
            {expensesOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={expensesOverTime}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(96,165,250,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
                    style={{ fontSize: '0.85rem', fontWeight: '600' }}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    tickFormatter={(value) => formatCurrency(value)}
                    style={{ fontSize: '0.85rem', fontWeight: '600' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR')}
                    contentStyle={customTooltipStyle}
                    labelStyle={customTooltipContentStyle}
                    cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorTotal)"
                    animationBegin={0}
                    animationDuration={1000}
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#1e3a8a' }}
                    activeDot={{ r: 6, fill: '#60a5fa', strokeWidth: 2, stroke: '#1e3a8a' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles['empty-state']}>
                <div className={styles['empty-state-icon']}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                </div>
                <div className={styles['empty-state-title']}>Nenhum dado temporal</div>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico de Linhas - Receita vs Despesas */}
        <div className={`${styles['chart-card']} ${styles['full-width']}`}>
          <div className={styles['chart-header']}>
            <h3 className={styles['chart-title']}>Receita vs Despesas</h3>
            <p className={styles['chart-subtitle']}>Comparativo diário de entrada e saída</p>
          </div>
          <div className={styles['chart-container']}>
            {incomeVsExpenses.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incomeVsExpenses}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(96,165,250,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8"
                    style={{ fontSize: '0.85rem', fontWeight: '600' }}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    tickFormatter={(value) => formatCurrency(value)}
                    style={{ fontSize: '0.85rem', fontWeight: '600' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={customTooltipStyle}
                    labelStyle={customTooltipContentStyle}
                    cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px', fontSize: '0.9rem', fontWeight: '600' }}
                    iconType="circle"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Receita" 
                    stroke="#22c55e" 
                    strokeWidth={3} 
                    dot={{ r: 5, fill: '#22c55e', strokeWidth: 2, stroke: '#15803d' }}
                    activeDot={{ r: 7, fill: '#4ade80', strokeWidth: 2, stroke: '#15803d' }}
                    animationBegin={0}
                    animationDuration={1000}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Despesas" 
                    stroke="#ef4444" 
                    strokeWidth={3} 
                    dot={{ r: 5, fill: '#ef4444', strokeWidth: 2, stroke: '#991b1b' }}
                    activeDot={{ r: 7, fill: '#f87171', strokeWidth: 2, stroke: '#991b1b' }}
                    animationBegin={200}
                    animationDuration={1000}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Economia" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#1e3a8a' }}
                    activeDot={{ r: 7, fill: '#60a5fa', strokeWidth: 2, stroke: '#1e3a8a' }}
                    animationBegin={400}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles['empty-state']}>
                <div className={styles['empty-state-icon']}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <polyline points="5 12 12 5 19 12"/>
                  </svg>
                </div>
                <div className={styles['empty-state-title']}>Sem dados para comparação</div>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico de Barras Horizontais - Progresso de Metas */}
        {goals.length > 0 && (
          <div className={styles['chart-card']}>
            <div className={styles['chart-header']}>
              <h3 className={styles['chart-title']}>Progresso das Metas</h3>
              <p className={styles['chart-subtitle']}>Acompanhamento de objetivos financeiros</p>
            </div>
            <div className={styles['chart-container']}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={goalsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(96,165,250,0.1)" />
                  <XAxis 
                    type="number" 
                    stroke="#94a3b8"
                    style={{ fontSize: '0.85rem', fontWeight: '600' }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    width={120}
                    style={{ fontSize: '0.85rem', fontWeight: '600' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                    contentStyle={customTooltipStyle}
                    labelStyle={customTooltipContentStyle}
                    cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                  />
                  <Bar 
                    dataKey="progresso" 
                    fill="#8b5cf6" 
                    radius={[0, 8, 8, 0]}
                    animationBegin={0}
                    animationDuration={1000}
                    style={{ filter: 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3))' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Gráfico Radar - Distribuição de Gastos */}
        {categoryDistribution.length > 0 && (
          <div className={styles['chart-card']}>
            <div className={styles['chart-header']}>
              <h3 className={styles['chart-title']}>Radar de Distribuição</h3>
              <p className={styles['chart-subtitle']}>Visão 360° dos seus gastos</p>
            </div>
            <div className={styles['chart-container']}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={categoryDistribution}>
                  <PolarGrid 
                    stroke="rgba(96,165,250,0.2)" 
                    strokeWidth={1.5}
                  />
                  <PolarAngleAxis 
                    dataKey="category" 
                    stroke="#94a3b8"
                    style={{ fontSize: '0.85rem', fontWeight: '600' }}
                  />
                  <PolarRadiusAxis 
                    stroke="#94a3b8"
                    style={{ fontSize: '0.75rem', fontWeight: '600' }}
                  />
                  <Radar 
                    name="Distribuição %" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                    animationBegin={0}
                    animationDuration={1000}
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#1e3a8a' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                    contentStyle={customTooltipStyle}
                    labelStyle={customTooltipContentStyle}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Tabela de Transações Detalhadas */}
      <div className={`${styles['chart-card']} ${styles['full-width']}`}>
        <div className={styles['chart-header']}>
          <h3 className={styles['chart-title']}>Transações Recentes</h3>
          <p className={styles['chart-subtitle']}>Histórico detalhado de movimentações</p>
        </div>
        <div className={styles['table-container']}>
          {expenses.length > 0 ? (
            <table className={styles['data-table']}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>% da Renda</th>
                </tr>
              </thead>
              <tbody>
                {expenses.slice(0, 10).map(expense => (
                  <tr key={expense.id}>
                    <td>{expense.date ? new Date(expense.date).toLocaleDateString('pt-BR') : '-'}</td>
                    <td>{expense.name}</td>
                    <td>
                      <span className={`${styles['category-badge']} ${styles[expense.category?.toLowerCase() || 'outros']}`}>
                        {expense.category || 'Outros'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#f87171' }}>{formatCurrency(expense.amount)}</td>
                    <td>{income > 0 ? ((expense.amount / income) * 100).toFixed(1) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles['empty-state']}>
              <div className={styles['empty-state-icon']}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <div className={styles['empty-state-title']}>Nenhuma transação registrada</div>
              <div className={styles['empty-state-text']}>Comece adicionando suas despesas para análise detalhada</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
