'use client'

import styles from './IncomeInput.module.css'

interface IncomeInputProps {
  income: number
  onIncomeChange: (income: number) => void
}

export default function IncomeInput({ income, onIncomeChange }: IncomeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    onIncomeChange(value)
  }

  return (
    <div>
      <label htmlFor="income" className="block text-sm font-medium text-slate-300 mb-2">
        Renda Mensal (R$)
      </label>
      <input
        id="income"
        type="number"
        min="0"
        step="0.01"
        value={income || ''}
        onChange={handleChange}
        placeholder="Digite sua renda mensal"
        className="block w-full rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-slate-400"
      />
    </div>
  )
}
