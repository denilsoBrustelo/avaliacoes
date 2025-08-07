'use client'

import { useAuth } from '@/contexts/AuthContext'
import MinhasProvas from '@/components/aluno/MinhasProvas'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MinhasProvasPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not authenticated or not a student
    if (user && user.role !== 'ALUNO') {
      router.push('/dashboard')
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (user.role !== 'ALUNO') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Acesso negado. Esta página é apenas para alunos.</p>
        </div>
      </div>
    )
  }

  return <MinhasProvas />
}
