import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Network, 
  User,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

const NetworksPage = () => {
  const { user } = useAuth();
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dados mockados das redes para demonstração
  const mockNetworks = [
    {
      id: 1,
      name: 'Reset',
      description: 'Rede Reset - Renovação e recomeço',
      supervisor_name: 'João Discipulador',
      cells_count: 3,
      is_active: true,
      created_at: '2024-01-15T10:00:00'
    },
    {
      id: 2,
      name: 'Revayah',
      description: 'Rede Revayah - Satisfação em Deus',
      supervisor_name: 'João Discipulador',
      cells_count: 2,
      is_active: true,
      created_at: '2024-01-20T10:00:00'
    },
    {
      id: 3,
      name: 'Tetelestai',
      description: 'Rede Tetelestai - Está consumado',
      supervisor_name: 'Maria Discipuladora',
      cells_count: 1,
      is_active: true,
      created_at: '2024-02-01T10:00:00'
    },
    {
      id: 4,
      name: 'Kadosh',
      description: 'Rede Kadosh - Santo',
      supervisor_name: 'Maria Discipuladora',
      cells_count: 0,
      is_active: true,
      created_at: '2024-02-10T10:00:00'
    },
    {
      id: 5,
      name: 'Ekbalo',
      description: 'Rede Ekbalo - Enviar',
      supervisor_name: 'João Discipulador',
      cells_count: 0,
      is_active: true,
      created_at: '2024-02-15T10:00:00'
    },
    {
      id: 6,
      name: 'Nazireus',
      description: 'Rede Nazireus - Separado para Deus',
      supervisor_name: 'Maria Discipuladora',
      cells_count: 0,
      is_active: true,
      created_at: '2024-02-20T10:00:00'
    },
    {
      id: 7,
      name: 'Nexteens',
      description: 'Rede Nexteens - Próxima geração',
      supervisor_name: 'João Discipulador',
      cells_count: 0,
      is_active: true,
      created_at: '2024-03-01T10:00:00'
    }
  ];

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setNetworks(mockNetworks);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getNetworkColor = (networkName) => {
    const colors = {
      'Reset': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Revayah': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Tetelestai': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Kadosh': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Ekbalo': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Nazireus': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Nexteens': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    };
    return colors[networkName] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Redes de Discipulado
          </h1>
          <p className="text-muted-foreground">
            Gerencie as redes do ministério Radicais Livres
          </p>
        </div>
        
        {(user?.role === 'pastor') && (
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nova Rede</span>
          </Button>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Redes</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networks.length}</div>
            <p className="text-xs text-muted-foreground">
              Redes ativas no ministério
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Células Totais</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {networks.reduce((total, network) => total + network.cells_count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Células em todas as redes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Discipuladores</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(networks.map(n => n.supervisor_name)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Líderes supervisionando redes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid das Redes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {networks.map((network) => (
          <Card key={network.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className={getNetworkColor(network.name)}>
                  {network.name}
                </Badge>
                <div className="flex items-center space-x-1">
                  {(user?.role === 'pastor' || user?.role === 'discipulador') && (
                    <>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user?.role === 'pastor' && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
              <CardTitle className="text-lg">{network.name}</CardTitle>
              <CardDescription>{network.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Supervisor:</span>
                <span>{network.supervisor_name}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Células:</span>
                <span>{network.cells_count}</span>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Criada em {formatDate(network.created_at)}
              </div>

              <div className="pt-4 border-t border-border">
                <Button variant="outline" className="w-full" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Ver Células
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Informações sobre as Redes */}
      <Card className="mt-8 bg-muted/50">
        <CardHeader>
          <CardTitle>Sobre as Redes de Discipulado</CardTitle>
          <CardDescription>
            Entenda o significado de cada rede do ministério Radicais Livres
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Reset:</span> Renovação e recomeço em Cristo
              </div>
              <div>
                <span className="font-semibold">Revayah:</span> Satisfação plena em Deus
              </div>
              <div>
                <span className="font-semibold">Tetelestai:</span> "Está consumado" - obra completa de Jesus
              </div>
              <div>
                <span className="font-semibold">Kadosh:</span> Santo, separado para Deus
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Ekbalo:</span> Enviar, missão evangelística
              </div>
              <div>
                <span className="font-semibold">Nazireus:</span> Separado e consagrado ao Senhor
              </div>
              <div>
                <span className="font-semibold">Nexteens:</span> Próxima geração de jovens
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworksPage;

