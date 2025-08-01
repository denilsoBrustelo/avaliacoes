'use client'

import { useState, useEffect } from 'react'
import { Usuario, UserRole } from '@/types'
import { UsuarioService } from '@/lib/services'
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react'

interface UserListProps {
  onEdit?: (user: Usuario) => void
  onDelete?: (userId: number) => void
  onNew?: () => void
}

export default function UserList({ onEdit, onDelete, onNew }: UserListProps) {
  const [users, setUsers] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<UserRole | 'ALL'>('ALL')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await UsuarioService.getAll()
      setUsers(data)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await UsuarioService.delete(userId)
        await loadUsers()
        onDelete?.(userId)
      } catch (error) {
        console.error('Erro ao excluir usuário:', error)
      }
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.cpf.includes(searchTerm)
    
    const matchesRole = filterRole === 'ALL' || user.roles.includes(filterRole)
    
    return matchesSearch && matchesRole
  })

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      [UserRole.ADMIN]: 'Administrador',
      [UserRole.PROFESSOR]: 'Professor',
      [UserRole.ALUNO]: 'Aluno'
    }
    return labels[role]
  }

  const getRoleColor = (role: UserRole) => {
    const colors = {
      [UserRole.ADMIN]: 'bg-red-100 text-red-800',
      [UserRole.PROFESSOR]: 'bg-blue-100 text-blue-800',
      [UserRole.ALUNO]: 'bg-green-100 text-green-800'
    }
    return colors[role]
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Usuários</h2>
          <p className="text-gray-600">Gerencie todos os usuários do sistema</p>
        </div>
        <button
          onClick={onNew}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou CPF..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            className="input-field pl-10"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as UserRole | 'ALL')}
          >
            <option value="ALL">Todos os perfis</option>
            <option value={UserRole.ADMIN}>Administrador</option>
            <option value={UserRole.PROFESSOR}>Professor</option>
            <option value={UserRole.ALUNO}>Aluno</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cadastro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.nome}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.cpf}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role)}`}
                        >
                          {getRoleLabel(role)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.status ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.data_cadastro).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEdit?.(user)}
                        className="text-primary-600 hover:text-primary-900 p-1"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum usuário encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card">
          <div className="card-content">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.roles.includes(UserRole.ADMIN)).length}
              </div>
              <div className="text-sm text-gray-500">Administradores</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.roles.includes(UserRole.PROFESSOR)).length}
              </div>
              <div className="text-sm text-gray-500">Professores</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.roles.includes(UserRole.ALUNO)).length}
              </div>
              <div className="text-sm text-gray-500">Alunos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
