'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Usuario, UserRole, LoginDTO } from '@/types'
import { apiClient } from '@/lib/api'

interface AuthContextType {
  user: Usuario | null
  login: (credentials: LoginDTO) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  hasRole: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Dados mockados para demonstração
  const mockUsers: Usuario[] = [
    {
      id: 1,
      data_cadastro: new Date(),
      cpf: '12345678901',
      nome: 'Administrador Sistema',
      email: 'admin@sistema.com',
      senha: 'admin123',
      roles: [UserRole.ADMIN],
      status: true
    },
    {
      id: 2,
      data_cadastro: new Date(),
      cpf: '98765432109',
      nome: 'Professor João Silva',
      email: 'professor@sistema.com',
      senha: 'prof123',
      roles: [UserRole.PROFESSOR],
      status: true
    },
    {
      id: 3,
      data_cadastro: new Date(),
      cpf: '11122233344',
      nome: 'Aluno Maria Santos',
      email: 'aluno@sistema.com',
      senha: 'aluno123',
      roles: [UserRole.ALUNO],
      status: true
    }
  ]

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // Auto-login para demonstração - usando usuário aluno
      const alunoUser = mockUsers.find(u => u.roles.includes(UserRole.ALUNO))
      if (alunoUser) {
        const userWithoutPassword = { ...alunoUser, senha: '' }
        setUser(userWithoutPassword)
        localStorage.setItem('user', JSON.stringify(userWithoutPassword))

        // Gerar token fictício
        const fakeToken = `mock-token-${alunoUser.id}-${Date.now()}`
        apiClient.setToken(fakeToken)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginDTO): Promise<boolean> => {
    setIsLoading(true)
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const foundUser = mockUsers.find(u => 
      u.email === credentials.email && u.senha === credentials.senha && u.status
    )
    
    if (foundUser) {
      const userWithoutPassword = { ...foundUser, senha: '' }
      setUser(userWithoutPassword)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))

      // Gerar token fictício para desenvolvimento
      const fakeToken = `mock-token-${foundUser.id}-${Date.now()}`
      apiClient.setToken(fakeToken)

      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    apiClient.removeToken()
  }

  const hasRole = (role: UserRole): boolean => {
    return user?.roles.includes(role) || false
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}
