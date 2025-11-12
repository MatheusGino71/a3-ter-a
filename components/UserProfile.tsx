'use client'

import { useState, useEffect, useCallback } from 'react'
import { User, updateProfile, updateEmail, updatePassword } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import styles from './UserProfile.module.css'

interface UserProfileData {
  displayName: string
  email: string
  phoneNumber: string
  occupation: string
  monthlyIncome: number
  financialGoal: string
  riskProfile: 'conservador' | 'moderado' | 'arrojado'
  createdAt: string
  updatedAt: string
  // Preferências de personalização
  theme?: 'dark' | 'light' | 'auto'
  currency?: string
  language?: string
  notifications?: boolean
  emailNotifications?: boolean
  monthlyReports?: boolean
  defaultView?: 'overview' | 'goals' | 'analytics'
  chartType?: 'bar' | 'line' | 'pie'
  avatar?: 'default' | 'business' | 'casual'
}

interface UserProfileProps {
  user: User
  onClose: () => void
}

export default function UserProfile({ user, onClose }: UserProfileProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [activeTab, setActiveTab] = useState<'personal' | 'financial' | 'security' | 'preferences'>('personal')
  
  const [profileData, setProfileData] = useState<UserProfileData>({
    displayName: user.displayName || '',
    email: user.email || '',
    phoneNumber: '',
    occupation: '',
    monthlyIncome: 0,
    financialGoal: '',
    riskProfile: 'moderado',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Preferências padrão
    theme: 'dark',
    currency: 'BRL',
    language: 'pt-BR',
    notifications: true,
    emailNotifications: false,
    monthlyReports: true,
    defaultView: 'overview',
    chartType: 'bar',
    avatar: 'default',
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const loadUserProfile = useCallback(async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfileData
        setProfileData({
          ...data,
          email: user.email || data.email,
        })
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    }
  }, [user.uid, user.email])

  useEffect(() => {
    loadUserProfile()
  }, [loadUserProfile])

  const handleSaveProfile = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // Atualizar nome de exibição no Firebase Auth
      if (profileData.displayName !== user.displayName) {
        await updateProfile(user, {
          displayName: profileData.displayName,
        })
      }

      // Atualizar email se foi alterado
      if (profileData.email !== user.email && profileData.email) {
        await updateEmail(user, profileData.email)
      }

      // Atualizar perfil no Firestore
      const userRef = doc(db, 'users', user.uid)
      const updatedData = {
        ...profileData,
        updatedAt: new Date().toISOString(),
      }
      
      await setDoc(userRef, updatedData, { merge: true })

      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
      
      // Recarregar a página após 1.5 segundos
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error)
      setMessage({ 
        type: 'error', 
        text: error.message || 'Erro ao atualizar perfil. Tente novamente.' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem!' })
      return
    }

    if (securityData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres!' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      if (user) {
        await updatePassword(user, securityData.newPassword)
        setMessage({ type: 'success', text: 'Senha alterada com sucesso!' })
        setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      }
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error)
      setMessage({ 
        type: 'error', 
        text: 'Erro ao alterar senha. Você pode precisar fazer login novamente.' 
      })
    } finally {
      setLoading(false)
    }
  }

  // Renderizar avatares
  const renderAvatar = (type: string, size: number = 28) => {
    const avatars = {
      default: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      business: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
          <line x1="12" y1="16" x2="12" y2="16.01"/>
        </svg>
      ),
      casual: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
      )
    }
    return avatars[type as keyof typeof avatars] || avatars.default
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {renderAvatar(profileData.avatar || 'default', 28)}
            <h2>Meu Perfil</h2>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'personal' ? styles.active : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Dados Pessoais
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'financial' ? styles.active : ''}`}
            onClick={() => setActiveTab('financial')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Perfil Financeiro
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'security' ? styles.active : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Segurança
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'preferences' ? styles.active : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
            </svg>
            Preferências
          </button>
        </div>

        <div className={styles.content}>
          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          {activeTab === 'personal' && (
            <div className={styles.section}>
              <div className={styles.formGroup}>
                <label>Nome Completo</label>
                <input
                  type="text"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="seu@email.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Telefone</label>
                <input
                  type="tel"
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Ocupação</label>
                <input
                  type="text"
                  value={profileData.occupation}
                  onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                  placeholder="Sua profissão"
                />
              </div>

              <button 
                onClick={handleSaveProfile} 
                className={styles.saveButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className={styles.spinner} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Salvando...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/>
                      <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className={styles.section}>
              <div className={styles.formGroup}>
                <label>Renda Mensal (R$)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={profileData.monthlyIncome || ''}
                  onChange={(e) => setProfileData({ ...profileData, monthlyIncome: parseFloat(e.target.value) || 0 })}
                  placeholder="0,00"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Objetivo Financeiro Principal</label>
                <textarea
                  value={profileData.financialGoal}
                  onChange={(e) => setProfileData({ ...profileData, financialGoal: e.target.value })}
                  placeholder="Ex: Comprar uma casa, aposentadoria, viagem..."
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Perfil de Risco</label>
                <select
                  value={profileData.riskProfile}
                  onChange={(e) => setProfileData({ ...profileData, riskProfile: e.target.value as any })}
                >
                  <option value="conservador">Conservador - Prefiro segurança</option>
                  <option value="moderado">Moderado - Equilibro segurança e retorno</option>
                  <option value="arrojado">Arrojado - Busco maiores retornos</option>
                </select>
              </div>

              <div className={styles.infoCard}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <p>Estas informações nos ajudam a personalizar suas recomendações e análises financeiras.</p>
              </div>

              <button 
                onClick={handleSaveProfile} 
                className={styles.saveButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className={styles.spinner} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Salvando...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/>
                      <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Salvar Perfil Financeiro
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className={styles.section}>
              <div className={styles.formGroup}>
                <label>Nova Senha</label>
                <input
                  type="password"
                  value={securityData.newPassword}
                  onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Confirmar Nova Senha</label>
                <input
                  type="password"
                  value={securityData.confirmPassword}
                  onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                  placeholder="Digite a senha novamente"
                />
              </div>

              <div className={styles.infoCard}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <p>Use uma senha forte com letras, números e símbolos para maior segurança.</p>
              </div>

              <button 
                onClick={handleChangePassword} 
                className={styles.saveButton}
                disabled={loading || !securityData.newPassword}
              >
                {loading ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className={styles.section}>
              <div className={styles.preferenceSection}>
                <h4 className={styles.preferenceTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Ícone de Perfil
                </h4>

                <div className={styles.avatarGrid}>
                  <div 
                    className={`${styles.avatarOption} ${profileData.avatar === 'default' ? styles.selected : ''}`}
                    onClick={() => setProfileData({ ...profileData, avatar: 'default' })}
                  >
                    <div className={styles.avatarIcon}>
                      {renderAvatar('default', 48)}
                    </div>
                    <span className={styles.avatarLabel}>Padrão</span>
                    {profileData.avatar === 'default' && (
                      <div className={styles.checkmark}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div 
                    className={`${styles.avatarOption} ${profileData.avatar === 'business' ? styles.selected : ''}`}
                    onClick={() => setProfileData({ ...profileData, avatar: 'business' })}
                  >
                    <div className={styles.avatarIcon}>
                      {renderAvatar('business', 48)}
                    </div>
                    <span className={styles.avatarLabel}>Profissional</span>
                    {profileData.avatar === 'business' && (
                      <div className={styles.checkmark}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div 
                    className={`${styles.avatarOption} ${profileData.avatar === 'casual' ? styles.selected : ''}`}
                    onClick={() => setProfileData({ ...profileData, avatar: 'casual' })}
                  >
                    <div className={styles.avatarIcon}>
                      {renderAvatar('casual', 48)}
                    </div>
                    <span className={styles.avatarLabel}>Casual</span>
                    {profileData.avatar === 'casual' && (
                      <div className={styles.checkmark}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.preferenceSection}>
                <h4 className={styles.preferenceTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  Aparência
                </h4>

                <div className={styles.formGroup}>
                  <label>Tema</label>
                  <select
                    value={profileData.theme}
                    onChange={(e) => setProfileData({ ...profileData, theme: e.target.value as any })}
                  >
                    <option value="dark">Escuro (Atual)</option>
                    <option value="light">Claro (Em breve)</option>
                    <option value="auto">Automático (Em breve)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Tipo de Gráfico Padrão</label>
                  <select
                    value={profileData.chartType}
                    onChange={(e) => setProfileData({ ...profileData, chartType: e.target.value as any })}
                  >
                    <option value="bar">Barras</option>
                    <option value="line">Linhas</option>
                    <option value="pie">Pizza</option>
                  </select>
                </div>
              </div>

              <div className={styles.preferenceSection}>
                <h4 className={styles.preferenceTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  Regional
                </h4>

                <div className={styles.formGroup}>
                  <label>Moeda</label>
                  <select
                    value={profileData.currency}
                    onChange={(e) => setProfileData({ ...profileData, currency: e.target.value })}
                  >
                    <option value="BRL">Real Brasileiro (R$)</option>
                    <option value="USD">Dólar Americano ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Idioma</label>
                  <select
                    value={profileData.language}
                    onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </select>
                </div>
              </div>

              <div className={styles.preferenceSection}>
                <h4 className={styles.preferenceTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  Notificações
                </h4>

                <div className={styles.toggleGroup}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={profileData.notifications}
                      onChange={(e) => setProfileData({ ...profileData, notifications: e.target.checked })}
                      className={styles.toggleInput}
                    />
                    <span className={styles.toggleSwitch}></span>
                    <span>Notificações no App</span>
                  </label>
                  <p className={styles.toggleDescription}>Receba alertas sobre metas e despesas</p>
                </div>

                <div className={styles.toggleGroup}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={profileData.emailNotifications}
                      onChange={(e) => setProfileData({ ...profileData, emailNotifications: e.target.checked })}
                      className={styles.toggleInput}
                    />
                    <span className={styles.toggleSwitch}></span>
                    <span>Notificações por Email</span>
                  </label>
                  <p className={styles.toggleDescription}>Receba emails sobre atividades importantes</p>
                </div>

                <div className={styles.toggleGroup}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={profileData.monthlyReports}
                      onChange={(e) => setProfileData({ ...profileData, monthlyReports: e.target.checked })}
                      className={styles.toggleInput}
                    />
                    <span className={styles.toggleSwitch}></span>
                    <span>Relatórios Mensais</span>
                  </label>
                  <p className={styles.toggleDescription}>Receba resumo financeiro mensal por email</p>
                </div>
              </div>

              <div className={styles.preferenceSection}>
                <h4 className={styles.preferenceTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                  Experiência
                </h4>

                <div className={styles.formGroup}>
                  <label>Tela Inicial Padrão</label>
                  <select
                    value={profileData.defaultView}
                    onChange={(e) => setProfileData({ ...profileData, defaultView: e.target.value as any })}
                  >
                    <option value="overview">Visão Geral</option>
                    <option value="goals">Metas</option>
                    <option value="analytics">Analytics</option>
                  </select>
                </div>
              </div>

              <div className={styles.infoCard}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <p>Personalize sua experiência no Nexus de acordo com suas preferências. Clique em &quot;Salvar Preferências&quot; para aplicar as mudanças.</p>
              </div>

              <button 
                onClick={handleSaveProfile} 
                className={styles.saveButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className={styles.spinner} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Salvando...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/>
                      <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Salvar Preferências
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
