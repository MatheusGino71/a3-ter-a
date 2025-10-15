'use client'

import { useMemo } from 'react'
import { Expense, SavingsGoal, FinancialSummary } from './FinancialDashboard'
import styles from './ReportsSection.module.css'

interface ReportsSectionProps {
  income: number
  expenses: Expense[]
  summary: FinancialSummary
  goals: SavingsGoal[]
}

export default function ReportsSection({ 
  income, 
  expenses, 
  summary, 
  goals 
}: ReportsSectionProps) {
  
  const categoryAnalysis = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      const category = expense.category || 'Outros'
      acc[category] = (acc[category] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: summary.totalExpenses > 0 ? (amount / summary.totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [expenses, summary.totalExpenses])

  const goalAnalysis = useMemo(() => {
    const totalGoalValue = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
    const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
    const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length
    
    return {
      totalGoals: goals.length,
      completedGoals,
      totalGoalValue,
      totalSaved,
      completionRate: goals.length > 0 ? (completedGoals / goals.length) * 100 : 0,
      savingsRate: totalGoalValue > 0 ? (totalSaved / totalGoalValue) * 100 : 0
    }
  }, [goals])

  const monthlyProjection = useMemo(() => {
    const monthlySavings = summary.balance
    const monthsToReachGoals = goalAnalysis.totalGoalValue > 0 && monthlySavings > 0 
      ? (goalAnalysis.totalGoalValue - goalAnalysis.totalSaved) / monthlySavings 
      : 0

    return {
      monthlySavings,
      monthsToReachGoals: monthsToReachGoals > 0 ? monthsToReachGoals : 0,
      yearlyProjection: monthlySavings * 12
    }
  }, [summary.balance, goalAnalysis])

  const financialHealth = useMemo(() => {
    let score = 0
    let maxScore = 100
    
    // Critério 1: Saldo positivo (25 pontos)
    if (summary.balance > 0) score += 25
    
    // Critério 2: Taxa de economia (25 pontos)
    if (summary.savingsPercentage >= 20) score += 25
    else if (summary.savingsPercentage >= 10) score += 15
    else if (summary.savingsPercentage >= 5) score += 10
    
    // Critério 3: Diversificação de despesas (25 pontos)
    const categories = categoryAnalysis.length
    if (categories >= 5) score += 25
    else if (categories >= 3) score += 15
    else if (categories >= 1) score += 10
    
    // Critério 4: Progresso nas metas (25 pontos)
    if (goalAnalysis.completionRate >= 50) score += 25
    else if (goalAnalysis.completionRate >= 25) score += 15
    else if (goalAnalysis.completionRate > 0) score += 10
    
    let status = 'Crítico'
    let color = '#ef4444'
    
    if (score >= 80) {
      status = 'Excelente'
      color = '#10b981'
    } else if (score >= 60) {
      status = 'Bom'
      color = '#f59e0b'
    } else if (score >= 40) {
      status = 'Regular'
      color = '#f97316'
    }
    
    return { score, maxScore, status, color }
  }, [summary, categoryAnalysis, goalAnalysis])

  const recommendations = useMemo(() => {
    const recs = []
    
    if (summary.balance < 0) {
      recs.push({
        type: 'critical',
        title: 'Déficit Orçamentário',
        message: 'Suas despesas excedem sua renda. Revise seus gastos urgentemente.',
        action: 'Reduza despesas desnecessárias'
      })
    }
    
    if (summary.savingsPercentage < 10) {
      recs.push({
        type: 'warning',
        title: 'Taxa de Economia Baixa',
        message: 'Recomenda-se economizar pelo menos 10-20% da renda.',
        action: 'Aumente sua renda ou reduza despesas'
      })
    }
    
    if (categoryAnalysis.length > 0) {
      const topExpense = categoryAnalysis[0]
      if (topExpense.percentage > 50) {
        recs.push({
          type: 'warning',
          title: 'Concentração de Gastos',
          message: `${topExpense.percentage.toFixed(1)}% dos gastos estão em "${topExpense.category}".`,
          action: 'Diversifique seus gastos para melhor controle'
        })
      }
    }
    
    if (goals.length === 0) {
      recs.push({
        type: 'info',
        title: 'Sem Metas Definidas',
        message: 'Definir metas financeiras ajuda no planejamento.',
        action: 'Crie metas de curto e longo prazo'
      })
    }
    
    if (monthlyProjection.monthlySavings > 0 && goals.length > 0) {
      recs.push({
        type: 'success',
        title: 'Progresso Positivo',
        message: `Com economia de R$ ${monthlyProjection.monthlySavings.toFixed(2)}/mês, você pode atingir suas metas.`,
        action: 'Continue mantendo esse ritmo de economia'
      })
    }
    
    return recs
  }, [summary, categoryAnalysis, goals, monthlyProjection])

  if (income === 0 && expenses.length === 0) {
    return (
      <div className={styles.reportsContainer}>
        <div className={styles.reportsHeader}>
          <h2>📈 Relatórios e Análises</h2>
          <div className={styles.noDataMessage}>
            <p>Para gerar relatórios e análises, você precisa primeiro:</p>
            <ul>
              <li>✅ Inserir sua renda mensal</li>
              <li>✅ Adicionar suas despesas</li>
              <li>✅ Criar metas financeiras (opcional)</li>
            </ul>
            <p>Os relatórios serão gerados automaticamente com base nos seus dados.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.reportsContainer}>
      <div className={styles.reportsHeader}>
        <h2>📈 Relatórios e Análises</h2>
        <p>Análise detalhada da sua situação financeira atual</p>
      </div>

      <div className={styles.reportsGrid}>
        {/* Financial Health Score */}
        <div className={styles.healthCard}>
          <h3>💪 Saúde Financeira</h3>
          <div className={styles.healthScore}>
            <div 
              className={styles.scoreCircle}
              style={{ 
                background: `conic-gradient(${financialHealth.color} 0deg ${(financialHealth.score / financialHealth.maxScore) * 360}deg, #e2e8f0 ${(financialHealth.score / financialHealth.maxScore) * 360}deg 360deg)` 
              }}
            >
              <div className={styles.scoreValue}>
                {financialHealth.score}
              </div>
            </div>
            <div className={styles.scoreInfo}>
              <div className={styles.scoreStatus} style={{ color: financialHealth.color }}>
                {financialHealth.status}
              </div>
              <div className={styles.scoreDescription}>
                {financialHealth.score}/100 pontos
              </div>
            </div>
          </div>
        </div>

        {/* Category Analysis */}
        <div className={styles.categoryCard}>
          <h3>🏷️ Análise por Categoria</h3>
          {categoryAnalysis.length > 0 ? (
            <div className={styles.categoryList}>
              {categoryAnalysis.map((item, index) => (
                <div key={item.category} className={styles.categoryItem}>
                  <div className={styles.categoryInfo}>
                    <span className={styles.categoryName}>{item.category}</span>
                    <span className={styles.categoryAmount}>R$ {item.amount.toFixed(2)}</span>
                  </div>
                  <div className={styles.categoryBar}>
                    <div 
                      className={styles.categoryProgress}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className={styles.categoryPercentage}>{item.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>Nenhuma despesa registrada</p>
          )}
        </div>

        {/* Goals Analysis */}
        <div className={styles.goalsCard}>
          <h3>🎯 Análise de Metas</h3>
          <div className={styles.goalsStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total de Metas</span>
              <span className={styles.statValue}>{goalAnalysis.totalGoals}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Concluídas</span>
              <span className={styles.statValue}>{goalAnalysis.completedGoals}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Taxa de Conclusão</span>
              <span className={styles.statValue}>{goalAnalysis.completionRate.toFixed(1)}%</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Progresso Geral</span>
              <span className={styles.statValue}>{goalAnalysis.savingsRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Monthly Projection */}
        <div className={styles.projectionCard}>
          <h3>📊 Projeções</h3>
          <div className={styles.projectionStats}>
            <div className={styles.projectionItem}>
              <span className={styles.projectionLabel}>Economia Mensal</span>
              <span className={`${styles.projectionValue} ${monthlyProjection.monthlySavings >= 0 ? styles.positive : styles.negative}`}>
                R$ {monthlyProjection.monthlySavings.toFixed(2)}
              </span>
            </div>
            <div className={styles.projectionItem}>
              <span className={styles.projectionLabel}>Projeção Anual</span>
              <span className={`${styles.projectionValue} ${monthlyProjection.yearlyProjection >= 0 ? styles.positive : styles.negative}`}>
                R$ {monthlyProjection.yearlyProjection.toFixed(2)}
              </span>
            </div>
            {monthlyProjection.monthsToReachGoals > 0 && (
              <div className={styles.projectionItem}>
                <span className={styles.projectionLabel}>Tempo para Metas</span>
                <span className={styles.projectionValue}>
                  {monthlyProjection.monthsToReachGoals.toFixed(1)} meses
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className={styles.recommendationsSection}>
        <h3>💡 Recomendações Personalizadas</h3>
        <div className={styles.recommendationsList}>
          {recommendations.map((rec, index) => (
            <div key={index} className={`${styles.recommendationCard} ${styles[rec.type]}`}>
              <div className={styles.recHeader}>
                <h4>{rec.title}</h4>
                <span className={styles.recType}>
                  {rec.type === 'critical' && '🚨'}
                  {rec.type === 'warning' && '⚠️'}
                  {rec.type === 'info' && 'ℹ️'}
                  {rec.type === 'success' && '✅'}
                </span>
              </div>
              <p className={styles.recMessage}>{rec.message}</p>
              <p className={styles.recAction}><strong>Ação:</strong> {rec.action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}