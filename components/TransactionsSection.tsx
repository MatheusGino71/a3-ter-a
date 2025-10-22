'use client'

import { useState, useMemo } from 'react'
import { Expense } from './FinancialDashboard'

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: 'income' | 'expense'
}

interface TransactionsSectionProps {
  income: number
  expenses: Expense[]
}

export default function TransactionsSection({ income, expenses }: TransactionsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showNewTransaction, setShowNewTransaction] = useState(false)

  // Converter dados existentes para o formato de transações
  const transactions = useMemo(() => {
    const transactionList: Transaction[] = []
    
    // Adicionar renda como transação
    if (income > 0) {
      transactionList.push({
        id: 'income-main',
        date: new Date().toLocaleDateString('pt-BR'),
        description: 'Renda Mensal',
        category: 'Renda',
        amount: income,
        type: 'income'
      })
    }

    // Adicionar despesas como transações
    expenses.forEach(expense => {
      transactionList.push({
        id: expense.id,
        date: expense.date || new Date().toLocaleDateString('pt-BR'),
        description: expense.name,
        category: expense.category || 'Outros',
        amount: expense.amount,
        type: 'expense'
      })
    })

    return transactionList.sort((a, b) => new Date(b.date.split('/').reverse().join('-')).getTime() - new Date(a.date.split('/').reverse().join('-')).getTime())
  }, [income, expenses])

  // Filtrar transações
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === '' || transaction.category === selectedCategory
      const matchesType = selectedType === '' || transaction.type === selectedType

      return matchesSearch && matchesCategory && matchesType
    })
  }, [transactions, searchTerm, selectedCategory, selectedType])

  // Obter categorias únicas
  const categories = useMemo(() => {
    const categorySet = new Set(transactions.map(t => t.category))
    return Array.from(categorySet)
  }, [transactions])

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Renda': 'bg-green-900/50 text-green-300',
      'Alimentação': 'bg-blue-900/50 text-blue-300',
      'Transporte': 'bg-indigo-900/50 text-indigo-300',
      'Moradia': 'bg-yellow-900/50 text-yellow-300',
      'Lazer': 'bg-purple-900/50 text-purple-300',
      'Saúde': 'bg-red-900/50 text-red-300',
      'Educação': 'bg-cyan-900/50 text-cyan-300',
      'Vestuário': 'bg-pink-900/50 text-pink-300',
      'Serviços': 'bg-orange-900/50 text-orange-300',
      'Outros': 'bg-gray-900/50 text-gray-300'
    }
    return colors[category] || colors['Outros']
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-white mb-2">Nenhuma transação encontrada</h3>
        <p className="text-slate-400">Adicione receitas e despesas para ver seu histórico de transações.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-white">Transações</h2>
        <button 
          onClick={() => setShowNewTransaction(true)}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>Nova Transação</span>
        </button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="mb-6">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Pesquisar transações..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select 
          className="py-2 px-4 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Todas as Categorias</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select 
          className="py-2 px-4 rounded-lg bg-slate-800/50 border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 focus:ring-2 focus:ring-blue-500"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Todos os Tipos</option>
          <option value="income">Receitas</option>
          <option value="expense">Despesas</option>
        </select>
      </div>

      {/* Tabela de Transações */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider text-right">Valor</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(transaction.category)}`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                    transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-slate-400 hover:text-blue-400 transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="12" cy="5" r="1"/>
                        <circle cx="12" cy="19" r="1"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            Nenhuma transação encontrada com os filtros aplicados.
          </div>
        )}
      </div>

      {/* Resumo */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Total de Receitas</div>
          <div className="text-2xl font-bold text-green-400">
            +R$ {transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Total de Despesas</div>
          <div className="text-2xl font-bold text-red-400">
            -R$ {transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Saldo Líquido</div>
          <div className={`text-2xl font-bold ${
            transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - 
            transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) >= 0 
              ? 'text-green-400' 
              : 'text-red-400'
          }`}>
            {transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - 
             transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) >= 0 ? '+' : ''}
            R$ {Math.abs(
              transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - 
              transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
            ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  )
}