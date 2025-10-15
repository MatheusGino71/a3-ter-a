'use client'

import { useState, useCallback } from 'react'
import { SavingsGoal } from './FinancialDashboard'
import styles from './GoalsList.module.css'

interface GoalsListProps {
  goals: SavingsGoal[]
  currentBalance: number
  onUpdateGoal: (id: string, currentAmount: number) => void
  onRemoveGoal: (id: string) => void
}

export default function GoalsList({ 
  goals, 
  currentBalance, 
  onUpdateGoal, 
  onRemoveGoal 
}: GoalsListProps) {
  const [editingGoal, setEditingGoal] = useState<string | null>(null)
  const [tempAmount, setTempAmount] = useState<string>('')

  const handleEditStart = useCallback((goal: SavingsGoal) => {
    setEditingGoal(goal.id)
    setTempAmount(goal.currentAmount.toString())
  }, [])

  const handleEditSave = useCallback((goalId: string) => {
    const amount = parseFloat(tempAmount) || 0
    if (amount >= 0) {
      onUpdateGoal(goalId, amount)
      setEditingGoal(null)
      setTempAmount('')
    }
  }, [tempAmount, onUpdateGoal])

  const handleEditCancel = useCallback(() => {
    setEditingGoal(null)
    setTempAmount('')
  }, [])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }, [])

  const calculateDaysRemaining = useCallback((deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }, [])

  const getProgressPercentage = useCallback((current: number, target: number) => {
    return target > 0 ? Math.min((current / target) * 100, 100) : 0
  }, [])

  const suggestContribution = useCallback((goal: SavingsGoal) => {
    const remaining = goal.targetAmount - goal.currentAmount
    const daysRemaining = calculateDaysRemaining(goal.deadline)
    
    if (remaining <= 0 || daysRemaining <= 0) return 0
    
    const monthsRemaining = daysRemaining / 30
    return remaining / Math.max(monthsRemaining, 1)
  }, [calculateDaysRemaining])

  if (goals.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🎯</div>
        <h3 className="text-lg font-semibold text-white mb-2">Nenhuma meta definida</h3>
        <p className="text-slate-400 text-sm">Crie sua primeira meta de economia para começar a organizar seus objetivos financeiros.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {goals.map((goal) => {
        const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount)
        const daysRemaining = calculateDaysRemaining(goal.deadline)
        const isOverdue = daysRemaining < 0
        const isCompleted = progress >= 100
        const monthlyContribution = suggestContribution(goal)

        return (
          <div 
            key={goal.id} 
            className={`p-4 rounded-lg border transition-all ${
              isCompleted 
                ? 'bg-green-900/20 border-green-600' 
                : isOverdue 
                  ? 'bg-red-900/20 border-red-600' 
                  : 'bg-slate-700/30 border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{goal.name}</h3>
              <button
                onClick={() => onRemoveGoal(goal.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded p-1 transition-colors"
                title="Remover meta"
              >
                🗑️
              </button>
            </div>

            <div className="mb-4">
              {editingGoal === goal.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={tempAmount}
                    onChange={(e) => setTempAmount(e.target.value)}
                    className="flex-1 rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditSave(goal.id)}
                    className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div 
                  className="cursor-pointer hover:bg-slate-600/20 p-2 rounded transition-colors"
                  onClick={() => handleEditStart(goal)}
                  title="Clique para editar"
                >
                  <div className="text-2xl font-bold text-white">
                    R$ {goal.currentAmount.toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-400">
                    de R$ {goal.targetAmount.toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">Progresso</span>
                <span className="text-sm font-medium text-white">{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    isCompleted 
                      ? 'bg-green-500' 
                      : isOverdue 
                        ? 'bg-red-500' 
                        : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Data limite:</span>
                <span className={`${isOverdue ? 'text-red-400' : 'text-white'}`}>
                  {formatDate(goal.deadline)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  {isOverdue ? 'Atrasado há:' : 'Tempo restante:'}
                </span>
                <span className={`${isOverdue ? 'text-red-400' : 'text-white'}`}>
                  {Math.abs(daysRemaining)} dias
                </span>
              </div>

              {!isCompleted && !isOverdue && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Sugestão mensal:</span>
                  <span className="text-green-400 font-medium">
                    R$ {monthlyContribution.toFixed(2)}
                  </span>
                </div>
              )}

              {isCompleted && (
                <div className="text-center py-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
                    🎉 Meta Atingida!
                  </span>
                </div>
              )}
            </div>

            {!isCompleted && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onUpdateGoal(goal.id, goal.currentAmount + currentBalance * 0.1)}
                  className="flex-1 px-3 py-2 text-xs bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors"
                  title="Contribuir com 10% do saldo atual"
                >
                  +10% do saldo
                </button>
                <button
                  onClick={() => onUpdateGoal(goal.id, goal.currentAmount + monthlyContribution)}
                  className="flex-1 px-3 py-2 text-xs bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-colors"
                  title="Contribuir com valor sugerido"
                >
                  +Sugestão
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}