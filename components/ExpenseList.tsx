'use client'

import { Expense } from './FinancialDashboard'
import styles from './ExpenseList.module.css'

interface ExpenseListProps {
  expenses: Expense[]
  onRemoveExpense: (id: string) => void
}

export default function ExpenseList({ expenses, onRemoveExpense }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p className="text-lg mb-2">Nenhuma despesa cadastrada ainda.</p>
        <p className="text-sm">Adicione despesas usando o formulário ao lado.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="max-h-64 overflow-y-auto">
        <ul className="space-y-2">
          {expenses.map((expense) => (
            <li key={expense.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
              <div className="flex-1">
                <span className="text-white font-medium">{expense.name}</span>
                <div className="text-sm text-slate-400">{expense.category}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-semibold">
                  R$ {expense.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => onRemoveExpense(expense.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full p-1 transition-colors"
                  title="Remover despesa"
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-slate-600 pt-4 flex justify-between items-center">
        <span className="text-slate-300 font-medium">Total de Despesas:</span>
        <span className="text-white font-bold text-lg">
          R$ {expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
        </span>
      </div>
    </div>
  )
}
