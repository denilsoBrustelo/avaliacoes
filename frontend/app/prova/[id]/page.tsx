'use client'

import { useAuth } from '@/contexts/AuthContext'
import AplicacaoProva from '@/components/aluno/AplicacaoProva'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ExamPageProps {
  params: {
    id: string
  }
}

export default function ExamPage({ params }: ExamPageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const participanteId = parseInt(params.id)

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
