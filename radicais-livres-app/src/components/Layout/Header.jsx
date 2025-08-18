import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  LogOut, 
  User,
  Home,
  Users,
  FileText,
  Camera,
  Phone,
  UserCheck
} from 'lucide-react';
import logo from '@/assets/TU39rr6nobsi.jpg';

const Header = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'pastors', label: 'Pastores', icon: UserCheck },
    { id: 'networks', label: 'Redes', icon: Users },
    { id: 'reports', label: 'Relatórios', icon: FileText },
    { id: 'gallery', label: 'Galeria', icon: Camera },
    { id: 'contacts', label: 'Contatos', icon: Phone },
  ];

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const handleNavigate = (page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e título */}
          <div className="flex items-center space-x-3">
            <img 
              src={logo} 
              alt="Radicais Livres" 
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">Radicais Livres</h1>
              <p className="text-sm text-muted-foreground">Igreja Videira Francisco Morato</p>
            </div>
          </div>

          {/* Menu desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleNavigate(item.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Controles do usuário */}
          <div className="flex items-center space-x-2">
            {/* Toggle tema */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>

            {/* Informações do usuário - desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1 bg-muted rounded-md">
                <User size={16} />
                <div className="text-sm">
                  <p className="font-medium">{user?.full_name}</p>
                  <p className="text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="p-2"
              >
                <LogOut size={18} />
              </Button>
            </div>

            {/* Menu mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </div>
        </div>

        {/* Menu mobile expandido */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Informações do usuário - mobile */}
              <div className="flex items-center space-x-3 px-3 py-2 bg-muted rounded-md mb-3">
                <User size={20} />
                <div>
                  <p className="font-medium text-sm">{user?.full_name}</p>
                  <p className="text-muted-foreground text-xs capitalize">{user?.role}</p>
                </div>
              </div>

              {/* Menu items */}
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleNavigate(item.id)}
                  >
                    <Icon size={18} className="mr-3" />
                    {item.label}
                  </Button>
                );
              })}

              {/* Logout */}
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-3" />
                Sair
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

