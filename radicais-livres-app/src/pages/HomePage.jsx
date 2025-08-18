import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Network, 
  FileText, 
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  ChevronRight
} from 'lucide-react';

const HomePage = ({ onNavigate }) => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/reports/dashboard', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'pastor': return 'Pastor/Administrador';
      case 'discipulador': return 'Discipulador';
      case 'lider': return 'Líder de Célula';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Boas-vindas */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bem-vindo, {user?.full_name}!
        </h1>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="capitalize">
            {getRoleDescription(user?.role)}
          </Badge>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Visão da Igreja */}
      <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Visão da Igreja Videira</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <blockquote className="text-lg italic text-foreground mb-4">
            "Ser uma igreja que transforma vidas através do amor de Cristo, 
            formando discípulos que fazem discípulos."
          </blockquote>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Ministério Radicais Livres</h4>
              <p className="text-muted-foreground">
                Formar jovens apaixonados por Jesus, comprometidos com o Reino de Deus 
                e engajados na transformação da sociedade.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Nossos Valores</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Amor incondicional</li>
                <li>• Relacionamentos autênticos</li>
                <li>• Crescimento espiritual</li>
                <li>• Serviço ao próximo</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Células</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.total_cells || 0}</div>
            <p className="text-xs text-muted-foreground">
              Células ativas no ministério
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.total_members || 0}</div>
            <p className="text-xs text-muted-foreground">
              Membros cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redes Ativas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.total_networks || 0}</div>
            <p className="text-xs text-muted-foreground">
              Redes de discipulado
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relatórios</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.recent_reports?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Relatórios recentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Relatórios recentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Relatórios Recentes</CardTitle>
            <CardDescription>
              Últimos relatórios de frequência das células
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onNavigate('reports')}
          >
            Ver todos
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {dashboardData?.recent_reports?.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recent_reports.slice(0, 5).map((report) => (
                <div 
                  key={report.id} 
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{report.cell_name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(report.meeting_date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{report.total_present} presentes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{report.network_name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {report.leader_name}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum relatório encontrado</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => onNavigate('reports')}
              >
                Criar primeiro relatório
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações rápidas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="h-20 flex flex-col items-center justify-center space-y-2"
          onClick={() => onNavigate('reports')}
        >
          <FileText className="h-6 w-6" />
          <span>Novo Relatório</span>
        </Button>
        
        <Button
          variant="outline"
          className="h-20 flex flex-col items-center justify-center space-y-2"
          onClick={() => onNavigate('networks')}
        >
          <Network className="h-6 w-6" />
          <span>Ver Redes</span>
        </Button>
        
        <Button
          variant="outline"
          className="h-20 flex flex-col items-center justify-center space-y-2"
          onClick={() => onNavigate('gallery')}
        >
          <Calendar className="h-6 w-6" />
          <span>Galeria</span>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;

