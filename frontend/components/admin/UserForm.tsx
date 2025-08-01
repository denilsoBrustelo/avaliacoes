'use client'

import { useState, useEffect } from 'react'
import { Usuario, UserRole, CreateUsuarioDTO } from '@/types'
import { UsuarioService } from '@/lib/services'
import { X, Save, User } from 'lucide-react'

interface UserFormProps {
  user?: Usuario | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function UserForm({ user, isOpen, onClose, onSave }: UserFormProps) {
  const [formData, setFormData] = useState<CreateUsuarioDTO>({
    cpf: '',
    nome: '',
    email: '',
    senha: '',
    roles: []
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      setFormData({
        cpf: user.cpf,
        nome: user.nome,
        email: user.email,
        senha: '', // Não exibir senha existente
        roles: user.roles
      })
    } else {
      setFormData({
        cpf: '',
        nome: '',
        email: '',
        senha: '',
        roles: []
      })
    }
    setErrors({})
  }, [user, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório'
    } else if (!/^\d{11}$/.test(formData.cpf.replace(/\D/g, ''))) {
      newErrors.cpf = 'CPF deve conter 11 dígitos'
    }

    if (!user && !formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória'
    } else if (formData.senha && formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (formData.roles.length === 0) {
      newErrors.roles = 'Selecione pelo menos um perfil'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)
      
      if (user) {
        // Atualizar usuário existente
        const updateData: Partial<Usuario> = { ...formData }
        if (!formData.senha) {
          delete updateData.senha // Não atualizar senha se estiver vazia
        }
        await UsuarioService.update(user.id, updateData)
      } else {
        // Criar novo usuário
        await UsuarioService.create(formData)
      }
      
      onSave()
      onClose()
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
      setErrors({ submit: 'Erro ao salvar usuário. Tente novamente.' })
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = (role: UserRole, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        roles: [...prev.roles.filter(r => r !== role), role]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        roles: prev.roles.filter(r => r !== role)
      }))
    }
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <User className="h-6 w-6 text-primary-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">
              {user ? 'Editar Usuário' : 'Novo Usuário'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              id="nome"
              className={`input-field ${errors.nome ? 'border-red-500' : ''}`}
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Digite o nome completo"
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Digite o email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* CPF */}
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
              CPF *
            </label>
            <input
              type="text"
              id="cpf"
              className={`input-field ${errors.cpf ? 'border-red-500' : ''}`}
              value={formatCPF(formData.cpf)}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                cpf: e.target.value.replace(/\D/g, '') 
              }))}
              placeholder="000.000.000-00"
              maxLength={14}
            />
            {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
              Senha {!user && '*'}
            </label>
            <input
              type="password"
              id="senha"
              className={`input-field ${errors.senha ? 'border-red-500' : ''}`}
              value={formData.senha}
              onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
              placeholder={user ? "Deixe em branco para manter a senha atual" : "Digite a senha"}
            />
            {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha}</p>}
          </div>

          {/* Perfis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Perfis de Acesso *
            </label>
            <div className="space-y-3">
              {Object.values(UserRole).map((role) => {
                const roleLabels = {
                  [UserRole.ADMIN]: 'Administrador',
                  [UserRole.PROFESSOR]: 'Professor',
                  [UserRole.ALUNO]: 'Aluno'
                }
                
                const roleDescriptions = {
                  [UserRole.ADMIN]: 'Acesso total ao sistema',
                  [UserRole.PROFESSOR]: 'Criar e gerenciar questões e avaliações',
                  [UserRole.ALUNO]: 'Realizar avaliações e consultar resultados'
                }

                return (
                  <div key={role} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={role}
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        checked={formData.roles.includes(role)}
                        onChange={(e) => handleRoleChange(role, e.target.checked)}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor={role} className="font-medium text-gray-700">
                        {roleLabels[role]}
                      </label>
                      <p className="text-gray-500">{roleDescriptions[role]}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            {errors.roles && <p className="text-red-500 text-sm mt-1">{errors.roles}</p>}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="text-red-500 text-sm text-center">{errors.submit}</div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
