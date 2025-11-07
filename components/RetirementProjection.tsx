'use client'

import { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import styles from './RetirementProjection.module.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface RetirementProjectionProps {
  income: number
  expenses: number
  currentAge: number
  retirementAge: number
  currentSavings: number
  monthlyContribution: number
  expectedReturn: number
}

interface ScenarioData {
  year: number
  balance: number
  contributions: number
  compoundReturns: number
  expenses: number
  netWorth: number
}

const SCENARIO_RETURNS = {
  conservative: 0.05,
  moderate: 0.07,
  aggressive: 0.10
} as const

export default function RetirementProjection({
  income,
  expenses,
  currentAge: initialAge = 30,
  retirementAge: initialRetirementAge = 65,
  currentSavings: initialSavings = 0,
  monthlyContribution: initialContribution,
  expectedReturn = 0.07
}: RetirementProjectionProps) {
  const [selectedScenario, setSelectedScenario] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate')
  const [currentAge, setCurrentAge] = useState(initialAge)
  const [retirementAge, setRetirementAge] = useState(initialRetirementAge)
  const [currentSavings, setCurrentSavings] = useState(initialSavings)
  const [monthlyContribution, setMonthlyContribution] = useState(initialContribution)

  const projectionData = useMemo(() => {
    const years = retirementAge - currentAge
    const monthlyReturn = SCENARIO_RETURNS[selectedScenario] / 12
    const data: ScenarioData[] = []
    
    let balance = currentSavings
    const annualContribution = monthlyContribution * 12

    for (let year = 0; year <= years; year++) {
      const currentYear = new Date().getFullYear() + year
      
      if (year > 0) {
        // Add annual contribution
        balance += annualContribution
        // Apply compound interest
        balance *= (1 + SCENARIO_RETURNS[selectedScenario])
      }

      data.push({
        year: currentYear,
        balance: Math.round(balance),
        contributions: Math.round(annualContribution * year + currentSavings),
        compoundReturns: Math.round(balance - (annualContribution * year + currentSavings)),
        expenses: Math.round(expenses * 12),
        netWorth: Math.round(balance)
      })
    }

    return data
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, selectedScenario, expenses])

  const chartData = {
    labels: projectionData.map(d => d.year.toString()),
    datasets: [
      {
        label: 'Projeção de Poupança',
        data: projectionData.map(d => d.balance),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `Valor: R$ ${context.raw.toLocaleString()}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#9ca3af',
          callback: function(value: any) {
            return 'R$ ' + (value / 1000) + 'K'
          }
        }
      }
    }
  }

  const finalBalance = projectionData[projectionData.length - 1]?.balance || 0
  const yearsToRetirement = retirementAge - currentAge
  const savingsOverTime = finalBalance

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Resultado do Cenário: Projeção de Poupança para Aposentadoria</h1>
          <p className={styles.subtitle}>Métricas Principais</p>
        </div>
        <div className={styles.scenarioSelector}>
          {Object.keys(SCENARIO_RETURNS).map((scenario) => (
            <button
              key={scenario}
              className={`${styles.scenarioButton} ${selectedScenario === scenario ? styles.active : ''}`}
              onClick={() => setSelectedScenario(scenario as any)}
            >
              {scenario === 'conservative' ? 'Conservador' : scenario === 'moderate' ? 'Moderado' : 'Arrojado'}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.configSection}>
        <h3 className={styles.configTitle}>Configurações de Projeção</h3>
        <div className={styles.configGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Idade Atual</label>
            <input
              type="number"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className={styles.input}
              min="18"
              max="70"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Idade de Aposentadoria</label>
            <input
              type="number"
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className={styles.input}
              min="50"
              max="80"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Poupança Atual ($)</label>
            <input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
              className={styles.input}
              min="0"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Contribuição Mensal ($)</label>
            <input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className={styles.input}
              min="0"
            />
          </div>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Meta de Poupança</div>
          <div className={styles.metricValue}>R$ {finalBalance.toLocaleString()}</div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Anos até Aposentadoria</div>
          <div className={styles.metricValue}>{yearsToRetirement}</div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Patrimônio Atual</div>
          <div className={styles.metricValue}>R$ {currentSavings.toLocaleString()}</div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Poupança ao Longo do Tempo</div>
          <div className={styles.metricValue}>R$ {savingsOverTime.toLocaleString()}</div>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Poupança ao Longo do Tempo</h3>
        <div className={styles.chartWrapper}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.incomeExpenses}>
          <div className={styles.incomeExpensesGrid}>
              <div className={styles.incomeExpenseCard}>
              <div className={styles.cardLabel}>Renda e Despesas</div>
              <div className={styles.cardValueGrid}>
                <div>
                  <div className={styles.cardValue}>R$ {(income * 12).toLocaleString()}</div>
                  <div className={styles.cardSubLabel}>Renda Anual</div>
                </div>
                <div>
                  <div className={styles.cardValue}>R$ {(expenses * 12).toLocaleString()}</div>
                  <div className={styles.cardSubLabel}>Despesas Anuais</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.scenarioTable}>
          <h3 className={styles.tableTitle}>Detalhamento do Cenário</h3>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ano</th>
                  <th>Saldo</th>
                  <th>Poupança Mensal</th>
                  <th>Retorno Anual</th>
                  <th>Retornos Acumulados</th>
                  <th>Patrimônio Líquido</th>
                </tr>
              </thead>
              <tbody>
                {projectionData.slice(0, 10).map((data, index) => (
                  <tr key={data.year}>
                    <td>{data.year}</td>
                    <td>R$ {data.balance.toLocaleString()}</td>
                    <td>R$ {monthlyContribution.toLocaleString()}</td>
                    <td>{(SCENARIO_RETURNS[selectedScenario] * 100).toFixed(1)}%</td>
                    <td>R$ {data.compoundReturns.toLocaleString()}</td>
                    <td>R$ {data.netWorth.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}