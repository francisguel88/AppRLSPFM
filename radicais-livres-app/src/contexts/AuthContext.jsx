import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Usuários mockados para demonstração
  const mockUsers = {
    'pastor_admin': {
      id: 1,
      username: 'pastor_admin',
      full_name: 'Pastor Administrador',
      email: 'admin@videira.com.br',
      role: 'pastor',
      is_active: true
    },
    'discipulador1': {
      id: 2,
      username: 'discipulador1',
      full_name: 'João Discipulador',
      email: 'joao@videira.com.br',
      role: 'discipulador',
      is_active: true
    },
    'lider1': {
      id: 3,
      username: 'lider1',
      full_name: 'Pedro Líder',
      email: 'pedro@videira.com.br',
      role: 'lider',
      is_active: true
    }
  };

  const mockPasswords = {
    'pastor_admin': 'admin123',
    'discipulador1': 'disc123',
    'lider1': 'lider123'
  };

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('radicalLivres_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao carregar usuário salvo:', error);
        localStorage.removeItem('radicalLivres_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificar credenciais mockadas
      const user = mockUsers[username];
      const correctPassword = mockPasswords[username];

      if (!user || password !== correctPassword) {
        return {
          success: false,
          error: 'Usuário ou senha incorretos'
        };
      }

      if (!user.is_active) {
        return {
          success: false,
          error: 'Usuário inativo. Entre em contato com o administrador.'
        };
      }

      // Login bem-sucedido
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('radicalLivres_user', JSON.stringify(user));

      return {
        success: true,
        user: user
      };

    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        error: 'Erro interno. Tente novamente.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('radicalLivres_user');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    isAdmin: user?.role === 'pastor',
    isDiscipulador: user?.role === 'discipulador',
    isLider: user?.role === 'lider'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

