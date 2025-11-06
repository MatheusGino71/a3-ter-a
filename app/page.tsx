'use client'

import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import FinancialDashboard from '@/components/FinancialDashboard'
import AuthForm from '@/components/AuthForm'
import VideoBackground from '@/components/VideoBackground'
import styles from './page.module.css'

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Verificar se o usuário já está logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid)
        setShowDashboard(true)
      } else {
        setUserId(null)
        setShowDashboard(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleAuthSuccess = (uid: string) => {
    setUserId(uid)
    setShowAuth(false)
    setShowDashboard(true)
  }

  const handleBackToHome = () => {
    setShowAuth(false)
    setShowDashboard(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  if (showAuth) {
    return <AuthForm onSuccess={handleAuthSuccess} onBackToHome={handleBackToHome} />
  }

  if (showDashboard && userId) {
    return <FinancialDashboard onBackToHome={handleBackToHome} userId={userId} />
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Video Background */}
      <VideoBackground className="absolute top-0 left-0 w-full h-full object-cover z-0" />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center text-white text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
            Nexus
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            Conectando Suas Finanças ao Futuro
          </p>
          
          <button
            onClick={() => setShowAuth(true)}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm hover:bg-white/20 hover:border-white/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            <span className="relative z-10">Acessar Plataforma</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </div>
  )
}
