'use client'

import { FinancialSummary } from './FinancialDashboard'
import styles from './Summary.module.css'

interface SummaryProps {
  summary: FinancialSummary
}

export default function Summary({ summary }: SummaryProps) {
  const { totalIncome, totalExpenses, balance, savingsPercentage } = summary

  const balanceClass = balance >= 0 ? styles.positive : styles.negative
  const savingsClass = savingsPercentage >= 20 ? styles.good : savingsPercentage >= 10 ? styles.warning : styles.bad

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardIcon}>💰</div>
        <div className={styles.cardContent}>
          <span className={styles.cardLabel}>Renda Total</span>
          <span className={styles.cardValue}>R$ {totalIncome.toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardIcon}>💸</div>
        <div className={styles.cardContent}>
          <span className={styles.cardLabel}>Despesas Totais</span>
          <span className={`${styles.cardValue} ${styles.expense}`}>
            R$ {totalExpenses.toFixed(2)}
          </span>
        </div>
      </div>

      <div className={`${styles.card} ${styles.highlightCard}`}>
        <div className={styles.cardIcon}>{balance >= 0 ? '✅' : '⚠️'}</div>
        <div className={styles.cardContent}>
          <span className={styles.cardLabel}>Saldo Mensal</span>
          <span className={`${styles.cardValue} ${balanceClass}`}>
            R$ {balance.toFixed(2)}
          </span>
        </div>
      </div>

      <div className={`${styles.card} ${styles.highlightCard}`}>
        <div className={styles.cardIcon}>📊</div>
        <div className={styles.cardContent}>
          <span className={styles.cardLabel}>Taxa de Economia</span>
          <span className={`${styles.cardValue} ${savingsClass}`}>
            {savingsPercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {savingsPercentage < 10 && totalIncome > 0 && (
        <div className={styles.alert}>
          <strong>⚠️ Atenção:</strong> Sua taxa de economia está abaixo de 10%. 
          Considere revisar suas despesas!
        </div>
      )}

      {balance < 0 && (
        <div className={styles.alertDanger}>
          <strong>🚨 Alerta:</strong> Suas despesas excedem sua renda! 
          É necessário ajustar seu orçamento.
        </div>
      )}
    </div>
  )
}
