'use client'

import { useState } from 'react'
import { Questao } from '@/types'
import QuestoesList from './QuestoesList'
import QuestaoForm from './QuestaoForm'
import QuestaoView from './QuestaoView'

export default function QuestoesPage() {
  const [selectedQuestao, setSelectedQuestao] = useState<Questao | null>(null)
  const [viewQuestao, setViewQuestao] = useState<Questao | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleEdit = (questao: Questao) => {
    setSelectedQuestao(questao)
    setIsFormOpen(true)
  }

  const handleView = (questao: Questao) => {
    setViewQuestao(questao)
    setIsViewOpen(true)
  }

  const handleNew = () => {
    setSelectedQuestao(null)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedQuestao(null)
  }

  const handleCloseView = () => {
    setIsViewOpen(false)
    setViewQuestao(null)
  }

  const handleSave = () => {
    setRefreshKey(prev => prev + 1) // Força re-render da lista
  }

  return (
    <>
      <QuestoesList
        key={refreshKey}
        onEdit={handleEdit}
        onView={handleView}
        onNew={handleNew}
      />
      
      <QuestaoForm
        questao={selectedQuestao}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSave}
      />

      <QuestaoView
        questao={viewQuestao}
        isOpen={isViewOpen}
        onClose={handleCloseView}
        onEdit={handleEdit}
      />
    </>
  )
}
