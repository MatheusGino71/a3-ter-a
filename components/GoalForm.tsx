'use client'

import { useState, useCallback } from 'react'
import styles from './GoalForm.module.css'

interface GoalFormProps {
  onAddGoal: (name: string, targetAmount: number, deadline: string) => void
}

export default function GoalForm({ onAddGoal }: GoalFormProps) {
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [isFormVisible, setIsFormVisible] = useState(false)

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !targetAmount || !deadline) {
      alert('Por favor, preencha todos os campos!')
      return
    }

    const amount = parseFloat(targetAmount)
    if (amount <= 0) {
      alert('O valor da meta deve ser maior que zero!')
      return
    }

    const deadlineDate = new Date(deadline)
    const today = new Date()
    if (deadlineDate <= today) {
      alert('A data limite deve ser no futuro!')
      return
    }

    onAddGoal(name.trim(), amount, deadline)
    setName('')
    setTargetAmount('')
    setDeadline('')
    setIsFormVisible(false)
  }, [name, targetAmount, deadline, onAddGoal])

  if (!isFormVisible) {
    return (
      <button 
        onClick={() => setIsFormVisible(true)}
        className="w-full inline-flex items-center justify-center rounded-md border border-dashed border-slate-600 px-4 py-8 text-sm font-medium text-slate-400 hover:border-blue-500 hover:text-blue-400 transition-colors"
      >
        + Nova Meta
      </button>
    )
  }

  return (
    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Adicionar Nova Meta</h3>
        <button 
          onClick={() => setIsFormVisible(false)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          X
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="goalName" className="block text-sm font-medium text-slate-300 mb-2">
            Nome da Meta
          </label>
          <input
            id="goalName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Viagem, Casa própria, Emergência..."
            className="block w-full rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-slate-400"
            maxLength={50}
          />
        </div>

        <div>
          <label htmlFor="goalAmount" className="block text-sm font-medium text-slate-300 mb-2">
            Valor Alvo (R$)
          </label>
          <input
            id="goalAmount"
            type="number"
            min="0.01"
            step="0.01"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="0.00"
            className="block w-full rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-slate-400"
          />
        </div>

        <div>
          <label htmlFor="goalDeadline" className="block text-sm font-medium text-slate-300 mb-2">
            Data Limite
          </label>
          <input
            id="goalDeadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="block w-full rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            type="submit" 
            className="flex-1 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors"
          >
            💾 Salvar Meta
          </button>
          <button 
            type="button" 
            onClick={() => setIsFormVisible(false)}
            className="flex-1 inline-flex items-center justify-center rounded-md border border-slate-600 bg-transparent px-3 py-2 text-sm font-medium text-slate-400 shadow-sm hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}