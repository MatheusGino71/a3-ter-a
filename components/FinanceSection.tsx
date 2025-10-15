'use client';

import { useState, useEffect } from 'react';
import styles from './FinanceSection.module.css';

interface ExpenseCategory {
  id: number;
  name: string;
  limit: number;
}

interface IncomeSource {
  id: number;
  name: string;
  amount: number;
  frequency: string;
}

export default function FinanceSection() {
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', limit: 0 });
  const [newIncome, setNewIncome] = useState({ name: '', amount: 0, frequency: 'Mensal' });
  
  // Estados para configurações
  const [currency, setCurrency] = useState('Real Brasileiro (BRL)');
  const [budgetCycle, setBudgetCycle] = useState(1);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showBudgetCycleModal, setShowBudgetCycleModal] = useState(false);
  const [tempCurrency, setTempCurrency] = useState('Real Brasileiro (BRL)');
  const [tempBudgetCycle, setTempBudgetCycle] = useState(1);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem('expenseCategories');
    const savedIncome = localStorage.getItem('incomeSources');
    const savedCurrency = localStorage.getItem('currency');
    const savedBudgetCycle = localStorage.getItem('budgetCycle');
    
    if (savedCategories) {
      try {
        setExpenseCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    }
    
    if (savedIncome) {
      try {
        setIncomeSources(JSON.parse(savedIncome));
      } catch (error) {
        console.error('Erro ao carregar receitas:', error);
      }
    }
    
    if (savedCurrency) {
      setCurrency(savedCurrency);
      setTempCurrency(savedCurrency);
    }
    
    if (savedBudgetCycle) {
      const cycle = parseInt(savedBudgetCycle);
      setBudgetCycle(cycle);
      setTempBudgetCycle(cycle);
    }
  }, []);

  // Salvar categorias no localStorage
  useEffect(() => {
    localStorage.setItem('expenseCategories', JSON.stringify(expenseCategories));
  }, [expenseCategories]);

  // Salvar receitas no localStorage
  useEffect(() => {
    localStorage.setItem('incomeSources', JSON.stringify(incomeSources));
  }, [incomeSources]);
  
  // Salvar configurações no localStorage
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);
  
  useEffect(() => {
    localStorage.setItem('budgetCycle', budgetCycle.toString());
  }, [budgetCycle]);

  const handleAddCategory = () => {
    if (newCategory.name.trim() && newCategory.limit > 0) {
      // Verificar se já existe uma categoria com o mesmo nome
      const existingCategory = expenseCategories.find(
        cat => cat.name.toLowerCase() === newCategory.name.toLowerCase().trim()
      );
      
      if (existingCategory) {
        alert('Já existe uma categoria com este nome!');
        return;
      }
      
      setExpenseCategories([
        ...expenseCategories,
        { id: Date.now(), name: newCategory.name.trim(), limit: newCategory.limit }
      ]);
      setNewCategory({ name: '', limit: 0 });
      setShowAddCategory(false);
    } else {
      alert('Por favor, preencha todos os campos corretamente!');
    }
  };

  const handleAddIncome = () => {
    if (newIncome.name.trim() && newIncome.amount > 0) {
      // Verificar se já existe uma receita com o mesmo nome
      const existingIncome = incomeSources.find(
        income => income.name.toLowerCase() === newIncome.name.toLowerCase().trim()
      );
      
      if (existingIncome) {
        alert('Já existe uma receita com este nome!');
        return;
      }
      
      setIncomeSources([
        ...incomeSources,
        { id: Date.now(), name: newIncome.name.trim(), amount: newIncome.amount, frequency: newIncome.frequency }
      ]);
      setNewIncome({ name: '', amount: 0, frequency: 'Mensal' });
      setShowAddIncome(false);
    } else {
      alert('Por favor, preencha todos os campos corretamente!');
    }
  };

  const deleteCategory = (id: number) => {
    const category = expenseCategories.find(cat => cat.id === id);
    if (category && confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
      setExpenseCategories(expenseCategories.filter(cat => cat.id !== id));
    }
  };

  const deleteIncome = (id: number) => {
    const income = incomeSources.find(inc => inc.id === id);
    if (income && confirm(`Tem certeza que deseja excluir a receita "${income.name}"?`)) {
      setIncomeSources(incomeSources.filter(income => income.id !== id));
    }
  };

  // Funções para configurações
  const handleSaveCurrency = () => {
    setCurrency(tempCurrency);
    setShowCurrencyModal(false);
  };

  const handleSaveBudgetCycle = () => {
    setBudgetCycle(tempBudgetCycle);
    setShowBudgetCycleModal(false);
  };

  const currencyOptions = [
    'Real Brasileiro (BRL)',
    'Dólar Americano (USD)',
    'Euro (EUR)',
    'Libra Esterlina (GBP)',
    'Peso Argentino (ARS)',
    'Peso Chileno (CLP)',
    'Peso Uruguaio (UYU)'
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="p-8">
        <header className="mb-8">
          <h2 className="text-4xl font-bold text-gray-100">Configurações do Orçamento</h2>
          <p className="text-gray-400 mt-1">Gerencie suas categorias, receitas e outras configurações.</p>
        </header>

        <div className="space-y-12">
          {/* Categorias de Despesas */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-gray-100">Categorias de Despesas</h3>
              <button 
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-gray-900 rounded-lg hover:bg-blue-400 transition-colors text-sm font-medium"
              >
                <span className="text-xl">+</span>
                Adicionar Categoria
              </button>
            </div>

            {showAddCategory && (
              <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nome da Categoria</label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Alimentação"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Limite de Gasto</label>
                    <input
                      type="number"
                      value={newCategory.limit}
                      onChange={(e) => setNewCategory({...newCategory, limit: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCategory}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => {
                        setShowAddCategory(false);
                        setNewCategory({ name: '', limit: 0 });
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-900/50 border-b border-gray-700">
                  <tr>
                    <th className="p-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Nome da Categoria</th>
                    <th className="p-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Limite de Gasto</th>
                    <th className="p-4 text-sm font-semibold uppercase tracking-wider text-right text-gray-400">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {expenseCategories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-gray-400">
                        Nenhuma categoria de despesa cadastrada. Clique em &quot;Adicionar Categoria&quot; para começar.
                      </td>
                    </tr>
                  ) : (
                    expenseCategories.map((category) => (
                      <tr key={category.id}>
                        <td className="p-4 text-gray-100">{category.name}</td>
                        <td className="p-4 text-gray-300">R$ {category.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-4">
                            <button className="text-blue-400 hover:text-blue-300 transition-colors">Editar</button>
                            <button 
                              onClick={() => deleteCategory(category.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Receitas Fixas */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-gray-100">Receitas Fixas</h3>
              <button 
                onClick={() => setShowAddIncome(!showAddIncome)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-gray-900 rounded-lg hover:bg-blue-400 transition-colors text-sm font-medium"
              >
                <span className="text-xl">+</span>
                Adicionar Receita
              </button>
            </div>

            {showAddIncome && (
              <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Fonte de Receita</label>
                    <input
                      type="text"
                      value={newIncome.name}
                      onChange={(e) => setNewIncome({...newIncome, name: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Salário"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Valor</label>
                    <input
                      type="number"
                      value={newIncome.amount}
                      onChange={(e) => setNewIncome({...newIncome, amount: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Frequência</label>
                    <select
                      value={newIncome.frequency}
                      onChange={(e) => setNewIncome({...newIncome, frequency: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Mensal">Mensal</option>
                      <option value="Semanal">Semanal</option>
                      <option value="Anual">Anual</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddIncome}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => {
                        setShowAddIncome(false);
                        setNewIncome({ name: '', amount: 0, frequency: 'Mensal' });
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-900/50 border-b border-gray-700">
                  <tr>
                    <th className="p-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Fonte de Receita</th>
                    <th className="p-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Valor</th>
                    <th className="p-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Frequência</th>
                    <th className="p-4 text-sm font-semibold uppercase tracking-wider text-right text-gray-400">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {incomeSources.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-400">
                        Nenhuma receita fixa cadastrada. Clique em &quot;Adicionar Receita&quot; para começar.
                      </td>
                    </tr>
                  ) : (
                    incomeSources.map((income) => (
                      <tr key={income.id}>
                        <td className="p-4 text-gray-100">{income.name}</td>
                        <td className="p-4 text-gray-300">R$ {income.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td className="p-4 text-gray-300">{income.frequency}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-4">
                            <button className="text-blue-400 hover:text-blue-300 transition-colors">Editar</button>
                            <button 
                              onClick={() => deleteIncome(income.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Outras Configurações */}
          <section>
            <h3 className="text-2xl font-semibold text-gray-100 mb-4">Outras Configurações</h3>
            <div className="bg-gray-800 rounded-lg border border-gray-700 divide-y divide-gray-700">
              <div className="p-6 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-100">Moeda</p>
                  <p className="text-sm text-gray-400">Escolha a moeda para suas transações e relatórios.</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-200">{currency}</span>
                  <button 
                    onClick={() => {
                      setTempCurrency(currency);
                      setShowCurrencyModal(true);
                    }}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Alterar
                  </button>
                </div>
              </div>
              <div className="p-6 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-100">Ciclo de Orçamento</p>
                  <p className="text-sm text-gray-400">Defina o dia do mês em que seu ciclo de orçamento começa.</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-200">Dia {budgetCycle}</span>
                  <button 
                    onClick={() => {
                      setTempBudgetCycle(budgetCycle);
                      setShowBudgetCycleModal(true);
                    }}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Alterar
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal para alterar moeda */}
      {showCurrencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 border border-gray-700">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Alterar Moeda</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Selecione a moeda:</label>
              <select
                value={tempCurrency}
                onChange={(e) => setTempCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currencyOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveCurrency}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setShowCurrencyModal(false);
                  setTempCurrency(currency);
                }}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para alterar ciclo de orçamento */}
      {showBudgetCycleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 border border-gray-700">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Alterar Ciclo de Orçamento</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Dia do mês (1-31):</label>
              <input
                type="number"
                min="1"
                max="31"
                value={tempBudgetCycle}
                onChange={(e) => setTempBudgetCycle(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite um dia entre 1 e 31"
              />
              <p className="text-xs text-gray-400 mt-1">
                O orçamento será reiniciado no dia {tempBudgetCycle} de cada mês.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveBudgetCycle}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setShowBudgetCycleModal(false);
                  setTempBudgetCycle(budgetCycle);
                }}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}