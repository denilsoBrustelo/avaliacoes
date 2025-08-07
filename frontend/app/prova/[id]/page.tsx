'use client'

import { useAuth } from '@/contexts/AuthContext'
import AplicacaoProva from '@/components/aluno/AplicacaoProva'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { UserRole } from '@/types'

interface ExamPageProps {
  params: {
    id: string
  }
}

export default function ExamPage({ params }: ExamPageProps) {
  const { user, hasRole, isLoading } = useAuth()
  const router = useRouter()
  const participanteId = parseInt(params.id)

  useEffect(() => {
    // Redirect if not authenticated or not a student
    if (user && !hasRole(UserRole.ALUNO)) {
      router.push('/dashboard')
    }
  }, [user, hasRole, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Faça login para acessar esta página.</p>
        </div>
      </div>
    )
  }

  if (!hasRole(UserRole.ALUNO)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Acesso negado. Esta página é apenas para alunos.</p>
        </div>
      </div>
    )
  }

  if (isNaN(participanteId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">ID da avaliação inválido.</p>
        </div>
      </div>
    )
  }

  return <AplicacaoProva participanteId={participanteId} />
}
