import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Eye, EyeOff, Sun, Moon, AlertCircle } from 'lucide-react';
import logo from '@/assets/TU39rr6nobsi.jpg';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(username, password);
    
    if (!result.success) {
      setError(result.error || 'Erro ao fazer login');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* Toggle tema - canto superior direito */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </Button>

      <div className="w-full max-w-md">
        {/* Logo e título */}
        <div className="text-center mb-8">
          <img 
            src={logo} 
            alt="Radicais Livres" 
            className="h-20 w-20 mx-auto rounded-full object-cover mb-4"
          />
          <h1 className="text-3xl font-bold text-foreground mb-2">Radicais Livres</h1>
          <p className="text-muted-foreground">Igreja Videira Francisco Morato</p>
        </div>

        {/* Visão da igreja */}
        <Card className="mb-6 bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-center text-muted-foreground italic">
              "Ser uma igreja que transforma vidas através do amor de Cristo, 
              formando discípulos que fazem discípulos."
            </p>
          </CardContent>
        </Card>

        {/* Formulário de login */}
        <Card>
          <CardHeader>
            <CardTitle>Entrar no Sistema</CardTitle>
            <CardDescription>
              Acesse sua conta para gerenciar os relatórios das células
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu usuário"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    required
                    disabled={loading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {/* Credenciais de teste */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-2">Credenciais de Teste:</h4>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p><strong>Pastor:</strong> pastor_admin / admin123</p>
                <p><strong>Discipulador:</strong> discipulador1 / disc123</p>
                <p><strong>Líder:</strong> lider1 / lider123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações dos pastores */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Pr. Marcelo Sato - Pastor Supervisor</p>
          <p>Pr. Hugo Dias - Pastor de Jovens</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

