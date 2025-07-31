'use client'

import { useState } from 'react'
import { Usuario } from '@/types'
import UserList from './UserList'
import UserForm from './UserForm'

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleEdit = (user: Usuario) => {
    setSelectedUser(user)
    setIsFormOpen(true)
  }

  const handleNew = () => {
    setSelectedUser(null)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedUser(null)
  }

  const handleSave = () => {
    setRefreshKey(prev => prev + 1) // Força re-render da lista
  }

  const handleDelete = (userId: number) => {
    setRefreshKey(prev => prev + 1) // Força re-render da lista
  }

  return (
    <>
      <UserList
        key={refreshKey}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onNew={handleNew}
      />
      
      <UserForm
        user={selectedUser}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSave}
      />
    </>
  )
}
