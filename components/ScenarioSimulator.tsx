'use client'

import { useState, useMemo, useCallback } from 'react'
import { Expense, FinancialSummary } from './FinancialDashboard'
import styles from './ScenarioSimulator.module.css'

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
  const [simulatedIncome, setSimulatedIncome] = useState<number>(currentIncome)
  const [simulatedExpenses, setSimulatedExpenses] = useState<Expense[]>([...currentExpenses])
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

  if (currentIncome === 0) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>🔮 Simulação de Cenários</h2>
        <div className={styles.noDataMessage}>
          <p>Para usar o simulador de cenários, você precisa primeiro inserir sua renda e despesas.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🔮 Simulação de Cenários</h2>
      <p className={styles.subtitle}>
        Experimente diferentes cenários financeiros e veja o impacto no seu orçamento
      </p>

      <div className={styles.grid}>
        {/* Painel de Simulação */}
        <div className={styles.panel}>
          <h3>Configurar Simulação</h3>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Renda Mensal Simulada (R$)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={simulatedIncome || ''}
              onChange={(e) => setSimulatedIncome(parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
          </div>

          <div className={styles.divider} />

          <h4>Adicionar Nova Despesa</h4>
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

          <h4>Despesas Simuladas</h4>
          <div className={styles.expensesList}>
            {simulatedExpenses.length === 0 ? (
              <p className={styles.emptyText}>Nenhuma despesa</p>
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
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          <button onClick={handleReset} className={styles.resetButton}>
            🔄 Resetar para Valores Atuais
          </button>
        </div>

        {/* Painel de Comparação */}
        <div className={styles.panel}>
          <h3>Comparação de Resultados</h3>

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
            <h4>💡 Insights da Simulação</h4>
            {differences.balanceDiff > 0 && (
              <div className={styles.insightPositive}>
                ✅ Seu saldo melhoraria em R$ {Math.abs(differences.balanceDiff).toFixed(2)}
              </div>
            )}
            {differences.balanceDiff < 0 && (
              <div className={styles.insightNegative}>
                ⚠️ Seu saldo pioraria em R$ {Math.abs(differences.balanceDiff).toFixed(2)}
              </div>
            )}
            {differences.savingsDiff > 0 && (
              <div className={styles.insightPositive}>
                📈 Sua taxa de economia aumentaria {Math.abs(differences.savingsDiff).toFixed(1)}%
              </div>
            )}
            {differences.savingsDiff < 0 && (
              <div className={styles.insightNegative}>
                📉 Sua taxa de economia diminuiria {Math.abs(differences.savingsDiff).toFixed(1)}%
              </div>
            )}
            {simulatedSummary.balance < 0 && (
              <div className={styles.insightWarning}>
                🚨 Atenção: O cenário simulado resultaria em déficit orçamentário!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
