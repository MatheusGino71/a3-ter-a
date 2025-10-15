'use client'

import { useState, useCallback } from 'react'
import styles from './ExpenseForm.module.css'

interface ExpenseFormProps {
  onAddExpense: (name: string, amount: number, category?: string) => void
}

export default function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !amount) {
      alert('Por favor, preencha todos os campos!')
      return
    }

    const numAmount = parseFloat(amount)
    if (numAmount <= 0) {
      alert('O valor deve ser maior que zero!')
      return
    }

    onAddExpense(name.trim(), numAmount, category || 'Outros')
    setName('')
    setAmount('')
    setCategory('')
  }, [name, amount, category, onAddExpense])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="expenseName" className="block text-sm font-medium text-slate-300 mb-2">
          Nome da Despesa
        </label>
        <input
          id="expenseName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Aluguel, Alimentação..."
          className="block w-full rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-slate-400"
        />
      </div>

      <div>
        <label htmlFor="expenseAmount" className="block text-sm font-medium text-slate-300 mb-2">
          Valor (R$)
        </label>
        <input
          id="expenseAmount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="block w-full rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-slate-400"
        />
      </div>

      <div>
        <label htmlFor="expenseCategory" className="block text-sm font-medium text-slate-300 mb-2">
          Categoria
        </label>
        <select
          id="expenseCategory"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Selecione uma categoria</option>
          <option value="Alimentação">Alimentação</option>
          <option value="Transporte">Transporte</option>
          <option value="Moradia">Moradia</option>
          <option value="Saúde">Saúde</option>
          <option value="Educação">Educação</option>
          <option value="Lazer">Lazer</option>
          <option value="Vestuário">Vestuário</option>
          <option value="Serviços">Serviços</option>
          <option value="Outros">Outros</option>
        </select>
      </div>

      <button 
        type="submit" 
        className="w-full inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors"
      >
        Adicionar Despesa
      </button>
    </form>
  )
}
