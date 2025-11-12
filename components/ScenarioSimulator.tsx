'use client'

import { useState, useMemo, useCallback } from 'react'
import { Expense, FinancialSummary } from './FinancialDashboard'
import styles from './ScenarioSimulator.module.css'
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

interface ScenarioSimulatorProps {
  currentIncome: number
  currentExpenses: Expense[]
  currentSummary: FinancialSummary
}

export default function ScenarioSimulator({
  currentIncome,
  currentExpenses,
  currentSummary,
}: ScenarioSimulatorProps) {
  const [simulatedIncome, setSimulatedIncome] = useState<number>(0)
  const [simulatedExpenses, setSimulatedExpenses] = useState<Expense[]>([])
  const [newExpenseName, setNewExpenseName] = useState('')
  const [newExpenseAmount, setNewExpenseAmount] = useState('')

  const simulatedSummary = useMemo<FinancialSummary>(() => {
    const totalExpenses = simulatedExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const balance = simulatedIncome - totalExpenses
    const savingsPercentage = simulatedIncome > 0 ? (balance / simulatedIncome) * 100 : 0

    return {
      totalIncome: simulatedIncome,
      totalExpenses,
      balance,
      savingsPercentage,
    }
  }, [simulatedIncome, simulatedExpenses])

  const handleReset = useCallback(() => {
    setSimulatedIncome(currentIncome)
    setSimulatedExpenses([...currentExpenses])
    setNewExpenseName('')
    setNewExpenseAmount('')
  }, [currentIncome, currentExpenses])

  const handleAddSimulatedExpense = useCallback(() => {
    if (!newExpenseName.trim() || !newExpenseAmount) {
      alert('Preencha todos os campos!')
      return
    }

    const amount = parseFloat(newExpenseAmount)
    if (amount <= 0) {
      alert('O valor deve ser maior que zero!')
      return
    }

    const newExpense: Expense = {
      id: `sim-${Date.now()}`,
      name: newExpenseName.trim(),
      amount,
    }

    setSimulatedExpenses([...simulatedExpenses, newExpense])
    setNewExpenseName('')
    setNewExpenseAmount('')
  }, [newExpenseName, newExpenseAmount, simulatedExpenses])

  const handleRemoveSimulatedExpense = useCallback((id: string) => {
    setSimulatedExpenses(simulatedExpenses.filter(exp => exp.id !== id))
  }, [simulatedExpenses])

  const handleUpdateExpenseAmount = useCallback((id: string, newAmount: number) => {
    setSimulatedExpenses(simulatedExpenses.map(exp => 
      exp.id === id ? { ...exp, amount: newAmount } : exp
    ))
  }, [simulatedExpenses])

  const differences = useMemo(() => {
    const incomeDiff = simulatedSummary.totalIncome - currentSummary.totalIncome
    const expensesDiff = simulatedSummary.totalExpenses - currentSummary.totalExpenses
    const balanceDiff = simulatedSummary.balance - currentSummary.balance
    const savingsDiff = simulatedSummary.savingsPercentage - currentSummary.savingsPercentage

    return { incomeDiff, expensesDiff, balanceDiff, savingsDiff }
  }, [simulatedSummary, currentSummary])

  // Dados para gráfico de comparação
  const comparisonChartData = useMemo(() => ({
    labels: ['Renda', 'Despesas', 'Saldo'],
    datasets: [
      {
        label: 'Atual',
        data: [currentSummary.totalIncome, currentSummary.totalExpenses, currentSummary.balance],
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
      },
      {
        label: 'Simulado',
        data: [simulatedSummary.totalIncome, simulatedSummary.totalExpenses, simulatedSummary.balance],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
      },
    ],
  }), [currentSummary, simulatedSummary])

  const comparisonChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#e5e7eb',
          font: { size: 12, weight: 'bold' },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#e5e7eb',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context) => `${context.dataset.label}: R$ ${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#9ca3af',
          callback: (value) => `R$ ${value}`,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
      x: {
        ticks: { color: '#9ca3af' },
        grid: {
          display: false,
        },
      },
    },
  }

  // Dados para gráfico de impacto
  const impactChartData = useMemo(() => ({
    labels: ['Renda', 'Despesas', 'Saldo', 'Taxa Economia'],
    datasets: [
      {
        label: 'Impacto (%)',
        data: [
          currentSummary.totalIncome > 0 ? (differences.incomeDiff / currentSummary.totalIncome) * 100 : 0,
          currentSummary.totalExpenses > 0 ? (differences.expensesDiff / currentSummary.totalExpenses) * 100 : 0,
          currentSummary.balance !== 0 ? (differences.balanceDiff / Math.abs(currentSummary.balance)) * 100 : 0,
          differences.savingsDiff,
        ],
        backgroundColor: (context: any) => {
          if (!context.parsed || context.parsed.y === undefined) {
            return 'rgba(99, 102, 241, 0.7)'
          }
          const value = context.parsed.y
          return value >= 0 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)'
        },
        borderColor: (context: any) => {
          if (!context.parsed || context.parsed.y === undefined) {
            return 'rgba(99, 102, 241, 1)'
          }
          const value = context.parsed.y
          return value >= 0 ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)'
        },
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  }), [currentSummary, differences])

  const impactChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#e5e7eb',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => `Variação: ${context.parsed.y.toFixed(2)}%`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#9ca3af',
          callback: (value) => `${value}%`,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
      x: {
        ticks: { color: '#9ca3af' },
        grid: { display: false },
      },
    },
  }

  if (currentIncome === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.noDataMessage}>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header com estatísticas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Variação de Renda</div>
            <div className={`${styles.statValue} ${differences.incomeDiff >= 0 ? styles.positive : styles.negative}`}>
              {differences.incomeDiff >= 0 ? '+' : ''}R$ {Math.abs(differences.incomeDiff).toFixed(2)}
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Impacto nas Despesas</div>
            <div className={`${styles.statValue} ${differences.expensesDiff <= 0 ? styles.positive : styles.negative}`}>
              {differences.expensesDiff >= 0 ? '+' : ''}R$ {Math.abs(differences.expensesDiff).toFixed(2)}
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Mudança no Saldo</div>
            <div className={`${styles.statValue} ${differences.balanceDiff >= 0 ? styles.positive : styles.negative}`}>
              {differences.balanceDiff >= 0 ? '+' : ''}R$ {Math.abs(differences.balanceDiff).toFixed(2)}
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Taxa de Economia</div>
            <div className={`${styles.statValue} ${differences.savingsDiff >= 0 ? styles.positive : styles.negative}`}>
              {differences.savingsDiff >= 0 ? '+' : ''}{Math.abs(differences.savingsDiff).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Painel de Simulação */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            <h3>Configurar Simulação</h3>
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Renda Mensal Simulada (R$)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={simulatedIncome || ''}
              onChange={(e) => setSimulatedIncome(parseFloat(e.target.value) || 0)}
              className={styles.input}
              placeholder="Digite sua renda mensal simulada"
            />
          </div>

          <div className={styles.divider} />

          <div className={styles.sectionHeader}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <h4>Adicionar Nova Despesa</h4>
          </div>
          <div className={styles.addExpenseForm}>
            <input
              type="text"
              placeholder="Nome da despesa"
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
              className={styles.input}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Valor"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
              className={styles.input}
            />
            <button onClick={handleAddSimulatedExpense} className={styles.addButton}>
              Adicionar
            </button>
          </div>

          <div className={styles.divider} />

          <div className={styles.sectionHeader}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <h4>Despesas Simuladas</h4>
          </div>
          <div className={styles.expensesList}>
            {simulatedExpenses.length === 0 ? (
              <p className={styles.emptyText}>Adicione despesas para simular cenários financeiros</p>
            ) : (
              simulatedExpenses.map((expense) => (
                <div key={expense.id} className={styles.expenseItem}>
                  <span className={styles.expenseName}>{expense.name}</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={expense.amount}
                    onChange={(e) => handleUpdateExpenseAmount(expense.id, parseFloat(e.target.value) || 0)}
                    className={styles.expenseInput}
                  />
                  <button
                    onClick={() => handleRemoveSimulatedExpense(expense.id)}
                    className={styles.removeButton}
                  >
                    X
                  </button>
                </div>
              ))
            )}
          </div>

          <button onClick={handleReset} className={styles.resetButton}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Resetar para Valores Atuais
          </button>
        </div>

        {/* Painel de Comparação */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            <h3>Comparação de Resultados</h3>
          </div>

          {simulatedIncome === 0 && simulatedExpenses.length === 0 && (
            <div className={styles.infoCard}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <p>Configure sua renda e despesas simuladas no painel ao lado para ver a comparação de resultados.</p>
            </div>
          )}

          <div className={styles.comparison}>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonLabel}>Renda</div>
              <div className={styles.comparisonValues}>
                <div className={styles.currentValue}>
                  <span className={styles.valueLabel}>Atual</span>
                  <span className={styles.value}>R$ {currentSummary.totalIncome.toFixed(2)}</span>
                </div>
                <div className={styles.arrow}>→</div>
                <div className={styles.simulatedValue}>
                  <span className={styles.valueLabel}>Simulado</span>
                  <span className={styles.value}>R$ {simulatedSummary.totalIncome.toFixed(2)}</span>
                </div>
                <div className={`${styles.diff} ${differences.incomeDiff >= 0 ? styles.positive : styles.negative}`}>
                  {differences.incomeDiff >= 0 ? '+' : ''}{differences.incomeDiff.toFixed(2)}
                </div>
              </div>
            </div>

            <div className={styles.comparisonRow}>
              <div className={styles.comparisonLabel}>Despesas</div>
              <div className={styles.comparisonValues}>
                <div className={styles.currentValue}>
                  <span className={styles.valueLabel}>Atual</span>
                  <span className={styles.value}>R$ {currentSummary.totalExpenses.toFixed(2)}</span>
                </div>
                <div className={styles.arrow}>→</div>
                <div className={styles.simulatedValue}>
                  <span className={styles.valueLabel}>Simulado</span>
                  <span className={styles.value}>R$ {simulatedSummary.totalExpenses.toFixed(2)}</span>
                </div>
                <div className={`${styles.diff} ${differences.expensesDiff <= 0 ? styles.positive : styles.negative}`}>
                  {differences.expensesDiff >= 0 ? '+' : ''}{differences.expensesDiff.toFixed(2)}
                </div>
              </div>
            </div>

            <div className={`${styles.comparisonRow} ${styles.highlight}`}>
              <div className={styles.comparisonLabel}>Saldo</div>
              <div className={styles.comparisonValues}>
                <div className={styles.currentValue}>
                  <span className={styles.valueLabel}>Atual</span>
                  <span className={`${styles.value} ${currentSummary.balance >= 0 ? styles.positive : styles.negative}`}>
                    R$ {currentSummary.balance.toFixed(2)}
                  </span>
                </div>
                <div className={styles.arrow}>→</div>
                <div className={styles.simulatedValue}>
                  <span className={styles.valueLabel}>Simulado</span>
                  <span className={`${styles.value} ${simulatedSummary.balance >= 0 ? styles.positive : styles.negative}`}>
                    R$ {simulatedSummary.balance.toFixed(2)}
                  </span>
                </div>
                <div className={`${styles.diff} ${differences.balanceDiff >= 0 ? styles.positive : styles.negative}`}>
                  {differences.balanceDiff >= 0 ? '+' : ''}{differences.balanceDiff.toFixed(2)}
                </div>
              </div>
            </div>

            <div className={`${styles.comparisonRow} ${styles.highlight}`}>
              <div className={styles.comparisonLabel}>Taxa de Economia</div>
              <div className={styles.comparisonValues}>
                <div className={styles.currentValue}>
                  <span className={styles.valueLabel}>Atual</span>
                  <span className={styles.value}>{currentSummary.savingsPercentage.toFixed(1)}%</span>
                </div>
                <div className={styles.arrow}>→</div>
                <div className={styles.simulatedValue}>
                  <span className={styles.valueLabel}>Simulado</span>
                  <span className={styles.value}>{simulatedSummary.savingsPercentage.toFixed(1)}%</span>
                </div>
                <div className={`${styles.diff} ${differences.savingsDiff >= 0 ? styles.positive : styles.negative}`}>
                  {differences.savingsDiff >= 0 ? '+' : ''}{differences.savingsDiff.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className={styles.insights}>
            <div className={styles.insightsHeader}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <h4>Insights da Simulação</h4>
            </div>
            {differences.balanceDiff > 0 && (
              <div className={styles.insightPositive}>
                [+] Seu saldo melhoraria em R$ {Math.abs(differences.balanceDiff).toFixed(2)}
              </div>
            )}
            {differences.balanceDiff < 0 && (
              <div className={styles.insightNegative}>
                [-] Seu saldo pioraria em R$ {Math.abs(differences.balanceDiff).toFixed(2)}
              </div>
            )}
            {differences.savingsDiff > 0 && (
              <div className={styles.insightPositive}>
                [+] Sua taxa de economia aumentaria {Math.abs(differences.savingsDiff).toFixed(1)}%
              </div>
            )}
            {differences.savingsDiff < 0 && (
              <div className={styles.insightNegative}>
                [-] Sua taxa de economia diminuiria {Math.abs(differences.savingsDiff).toFixed(1)}%
              </div>
            )}
            {simulatedSummary.balance < 0 && (
              <div className={styles.insightWarning}>
                ATENÇÃO: O cenário simulado resultaria em déficit orçamentário!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gráficos de Análise */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Comparação Financeira</h3>
            <p>Atual vs Simulado</p>
          </div>
          <div className={styles.chartContainer}>
            <Bar data={comparisonChartData} options={comparisonChartOptions} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Análise de Impacto</h3>
            <p>Variação percentual por categoria</p>
          </div>
          <div className={styles.chartContainer}>
            <Line data={impactChartData} options={impactChartOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}
