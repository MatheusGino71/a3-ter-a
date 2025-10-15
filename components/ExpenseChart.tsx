'use client'

import { useMemo } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { Expense } from './FinancialDashboard'
import styles from './ExpenseChart.module.css'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

interface ExpenseChartProps {
  expenses: Expense[]
}

export default function ExpenseChart({ expenses }: ExpenseChartProps) {
  const chartData = useMemo(() => {
    if (expenses.length === 0) {
      return null
    }

    const colors = [
      '#00A3FF',
      '#3B82F6',
      '#8B5CF6',
      '#F59E0B',
      '#10B981',
      '#EF4444',
      '#F97316',
      '#84CC16',
      '#06B6D4',
      '#EC4899',
    ]

    return {
      labels: expenses.map(exp => exp.name),
      datasets: [
        {
          label: 'Valor (R$)',
          data: expenses.map(exp => exp.amount),
          backgroundColor: expenses.map((_, index) => colors[index % colors.length]),
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    }
  }, [expenses])

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
          color: '#C9D1D9', // texto claro para o tema escuro
        },
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#C9D1D9',
        borderColor: '#475569',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: R$ ${value.toFixed(2)} (${percentage}%)`
          },
        },
      },
    },
  }), [])

  if (!chartData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-4xl mb-4">📊</div>
        <p className="text-white text-lg mb-2">Nenhum dado para exibir</p>
        <p className="text-slate-400 text-sm">
          Adicione despesas para visualizar o gráfico de distribuição
        </p>
      </div>
    )
  }

  return (
    <div className="w-full h-64">
      <Pie data={chartData} options={chartOptions} />
    </div>
  )
}
