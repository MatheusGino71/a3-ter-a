'use client'

import { useState, FormEvent } from 'react'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import styles from './AuthForm.module.css'

interface AuthFormProps {
  onSuccess: (userId: string) => void
  onBackToHome: () => void
}

export default function AuthForm({ onSuccess, onBackToHome }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        setSuccess('Login realizado com sucesso!')
        setTimeout(() => onSuccess(userCredential.user.uid), 1000)
      } else {
        // Cadastro
        if (password !== confirmPassword) {
          setError('As senhas não coincidem')
          setLoading(false)
          return
        }

        if (password.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres')
          setLoading(false)
          return
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        
        // Atualizar perfil com nome
        await updateProfile(userCredential.user, {
          displayName: name
        })

        // Criar documento do usuário no Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email,
          displayName: name,
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
          // Dados financeiros
          income: 0,
          expenses: [],
          goals: []
        })

        setSuccess('Conta criada com sucesso!')
        setTimeout(() => onSuccess(userCredential.user.uid), 1000)
      }
    } catch (err: any) {
      console.error('Erro de autenticação:', err)
      
      // Mensagens de erro amigáveis
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Este e-mail já está cadastrado')
          break
        case 'auth/invalid-email':
          setError('E-mail inválido')
          break
        case 'auth/user-not-found':
          setError('Usuário não encontrado')
          break
        case 'auth/wrong-password':
          setError('Senha incorreta')
          break
        case 'auth/weak-password':
          setError('A senha deve ter pelo menos 6 caracteres')
          break
        case 'auth/invalid-credential':
          setError('E-mail ou senha incorretos')
          break
        default:
          setError('Erro ao processar requisição. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      
      // Criar ou atualizar documento do usuário no Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: userCredential.user.displayName || 'Usuário',
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || 'Usuário',
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
        // Dados financeiros
        income: 0,
        expenses: [],
        goals: []
      }, { merge: true })

      setSuccess('Login com Google realizado com sucesso!')
      setTimeout(() => onSuccess(userCredential.user.uid), 1000)
    } catch (err: any) {
      console.error('Erro no login com Google:', err)
      setError('Erro ao fazer login com Google. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles['auth-container']}>
      <button 
        className={styles['back-button']}
        onClick={onBackToHome}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Voltar
      </button>

      <div className={styles['auth-card']}>
        <div className={styles['auth-header']}>
          <h1 className={styles['auth-logo']}>Nexus</h1>
          <p className={styles['auth-subtitle']}>Conectando Suas Finanças ao Futuro</p>
        </div>

        <div className={styles['auth-tabs']}>
          <button
            className={`${styles['auth-tab']} ${isLogin ? styles.active : ''}`}
            onClick={() => {
              setIsLogin(true)
              setError('')
              setSuccess('')
            }}
          >
            Login
          </button>
          <button
            className={`${styles['auth-tab']} ${!isLogin ? styles.active : ''}`}
            onClick={() => {
              setIsLogin(false)
              setError('')
              setSuccess('')
            }}
          >
            Cadastro
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles['auth-form']}>
          {!isLogin && (
            <div className={styles['form-group']}>
              <label className={styles['form-label']}>Nome Completo</label>
              <input
                type="text"
                className={styles['form-input']}
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                disabled={loading}
              />
            </div>
          )}

          <div className={styles['form-group']}>
            <label className={styles['form-label']}>E-mail</label>
            <input
              type="email"
              className={styles['form-input']}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Senha</label>
            <input
              type="password"
              className={styles['form-input']}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div className={styles['form-group']}>
              <label className={styles['form-label']}>Confirmar Senha</label>
              <input
                type="password"
                className={styles['form-input']}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isLogin}
                disabled={loading}
                minLength={6}
              />
            </div>
          )}

          {error && (
            <div className={styles['error-message']}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1.5a6.5 6.5 0 110 13 6.5 6.5 0 010-13zM7.25 8V5h1.5v3h-1.5zm0 3v-1.5h1.5V11h-1.5z"/>
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className={styles['success-message']}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1.5a6.5 6.5 0 110 13 6.5 6.5 0 010-13zm2.354 4.646L7 9.5 5.646 8.146l-1.061 1.061L7 11.621l4.415-4.414-1.061-1.061z"/>
              </svg>
              {success}
            </div>
          )}

          <button
            type="submit"
            className={styles['submit-button']}
            disabled={loading}
          >
            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
          </button>
        </form>

        <div className={styles.divider}>
          <span>ou</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className={styles['google-button']}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M19.8 10.2273C19.8 9.51818 19.7364 8.83636 19.6182 8.18182H10.2V12.05H15.5818C15.3455 13.3 14.6182 14.3591 13.5273 15.0682V17.5773H16.8182C18.7091 15.8364 19.8 13.2727 19.8 10.2273Z" fill="#4285F4"/>
            <path d="M10.2 20C12.9 20 15.1727 19.1045 16.8182 17.5773L13.5273 15.0682C12.6182 15.6682 11.4909 16.0227 10.2 16.0227C7.59545 16.0227 5.38182 14.2636 4.58182 11.9H1.18182V14.4909C2.81818 17.7591 6.29091 20 10.2 20Z" fill="#34A853"/>
            <path d="M4.58182 11.9C4.38182 11.3 4.26364 10.6591 4.26364 10C4.26364 9.34091 4.38182 8.7 4.58182 8.1V5.50909H1.18182C0.509091 6.85909 0.136364 8.38636 0.136364 10C0.136364 11.6136 0.509091 13.1409 1.18182 14.4909L4.58182 11.9Z" fill="#FBBC05"/>
            <path d="M10.2 3.97727C11.6091 3.97727 12.8636 4.48182 13.8545 5.42727L16.7636 2.51818C15.1682 0.977273 12.8955 0 10.2 0C6.29091 0 2.81818 2.24091 1.18182 5.50909L4.58182 8.1C5.38182 5.73636 7.59545 3.97727 10.2 3.97727Z" fill="#EA4335"/>
          </svg>
          Continuar com Google
        </button>
      </div>
    </div>
  )
}
