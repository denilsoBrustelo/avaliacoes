'use client'

import { useState } from 'react'
import AvaliacoesList from './AvaliacoesList'
import AvaliacaoForm from './AvaliacaoForm'
import AvaliacaoView from './AvaliacaoView'
import BackendStatus from '../debug/BackendStatus'

export default function AvaliacoesPage() {
  const [selectedAvaliacao, setSelectedAvaliacao] = useState<any | null>(null)
  const [viewAvaliacao, setViewAvaliacao] = useState<any | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleEdit = (avaliacao: any) => {
    setSelectedAvaliacao(avaliacao)
    setIsFormOpen(true)
  }

  const handleView = (avaliacao: any) => {
    setViewAvaliacao(avaliacao)
    setIsViewOpen(true)
  }

  const handleNew = () => {
    setSelectedAvaliacao(null)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedAvaliacao(null)
  }

  const handleCloseView = () => {
    setIsViewOpen(false)
    setViewAvaliacao(null)
  }

  const handleSave = () => {
    setRefreshKey(prev => prev + 1) // Força re-render da lista
  }

  return (
    <>
      <AvaliacoesList
        key={refreshKey}
        onEdit={handleEdit}
        onView={handleView}
        onNew={handleNew}
      />
      
      <AvaliacaoForm
        avaliacao={selectedAvaliacao}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSave}
      />

      <AvaliacaoView
        avaliacao={viewAvaliacao}
        isOpen={isViewOpen}
        onClose={handleCloseView}
        onEdit={handleEdit}
      />
    </>
  )
}
