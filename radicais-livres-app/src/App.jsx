import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import LoginForm from '@/components/Auth/LoginForm';
import Header from '@/components/Layout/Header';
import HomePage from '@/pages/HomePage';
import PastorsPage from '@/pages/PastorsPage';
import NetworksPage from '@/pages/NetworksPage';
import ReportsPage from '@/pages/ReportsPage';
import GalleryPage from '@/pages/GalleryPage';
import ContactsPage from '@/pages/ContactsPage';
import './App.css';

// Componente principal da aplicação
function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Renderizar página atual
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'pastors':
        return <PastorsPage />;
      case 'networks':
        return <NetworksPage />;
      case 'reports':
        return <ReportsPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'contacts':
        return <ContactsPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
}

// App principal com provedores de contexto
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

