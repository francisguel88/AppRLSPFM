import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  Plus,
  Calendar,
  Users,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter
} from 'lucide-react';

const ReportsPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Dados mockados dos relatórios para demonstração
  const mockReports = [
    {
      id: 1,
      cell_name: 'Célula Esperança',
      network_name: 'Reset',
      leader_name: 'Pedro Líder',
      meeting_date: '2024-08-15',
      members_present: 8,
      fas_present: 3,
      visitors_present: 2,
      total_present: 13,
      observations: 'Reunião muito abençoada com palavra sobre fé.',
      testimony: 'João testificou sobre cura de sua mãe.',
      created_at: '2024-08-15T20:30:00'
    },
    {
      id: 2,
      cell_name: 'Célula Vitória',
      network_name: 'Revayah',
      leader_name: 'Ana Líder',
      meeting_date: '2024-08-14',
      members_present: 6,
      fas_present: 2,
      visitors_present: 1,
      total_present: 9,
      observations: 'Estudo sobre o amor de Deus.',
      testimony: 'Maria compartilhou sobre nova oportunidade de emprego.',
      created_at: '2024-08-14T21:00:00'
    },
    {
      id: 3,
      cell_name: 'Célula Fé',
      network_name: 'Tetelestai',
      leader_name: 'Carlos Líder',
      meeting_date: '2024-08-13',
      members_present: 5,
      fas_present: 1,
      visitors_present: 0,
      total_present: 6,
      observations: 'Oração pelos enfermos da célula.',
      testimony: 'Paulo testemunhou sobre restauração familiar.',
      created_at: '2024-08-13T19:45:00'
    }
  ];

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const filteredReports = reports.filter(report =>
    report.cell_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.network_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.leader_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CreateReportForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Novo Relatório de Frequência</CardTitle>
        <CardDescription>
          Registre a frequência da reunião de célula
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="meeting_date">Data da Reunião</Label>
            <Input
              id="meeting_date"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cell_name">Célula</Label>
            <Input
              id="cell_name"
              placeholder="Nome da célula"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="members_present">Membros Presentes</Label>
            <Input
              id="members_present"
              type="number"
              min="0"
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fas_present">FAs Presentes</Label>
            <Input
              id="fas_present"
              type="number"
              min="0"
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="visitors_present">Visitantes</Label>
            <Input
              id="visitors_present"
              type="number"
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="observations">Observações</Label>
          <Textarea
            id="observations"
            placeholder="Descreva como foi a reunião, tema abordado, etc."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="testimony">Testemunho</Label>
          <Textarea
            id="testimony"
            placeholder="Compartilhe algum testemunho ou palavra especial da reunião"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowCreateForm(false)}
          >
            Cancelar
          </Button>
          <Button onClick={() => setShowCreateForm(false)}>
            Salvar Relatório
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
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
            Relatórios de Frequência
          </h1>
          <p className="text-muted-foreground">
            Gerencie os relatórios das reuniões de células
          </p>
        </div>
        
        <Button 
          className="flex items-center space-x-2"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus className="h-4 w-4" />
          <span>Novo Relatório</span>
        </Button>
      </div>

      {/* Formulário de criação */}
      {showCreateForm && <CreateReportForm />}

      {/* Filtros e busca */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por célula, rede ou líder..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de relatórios */}
      <div className="space-y-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{report.cell_name}</CardTitle>
                      <CardDescription className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(report.meeting_date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{report.network_name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{report.leader_name}</span>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-lg font-semibold">
                      {report.total_present}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {(user?.role === 'pastor' || user?.role === 'discipulador') && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {user?.role === 'pastor' && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {report.members_present}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">Membros</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {report.fas_present}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">FAs</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {report.visitors_present}
                    </div>
                    <div className="text-sm text-purple-600 dark:text-purple-400">Visitantes</div>
                  </div>
                </div>

                {report.observations && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-sm mb-1">Observações:</h4>
                    <p className="text-sm text-muted-foreground">{report.observations}</p>
                  </div>
                )}

                {report.testimony && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-sm mb-1">Testemunho:</h4>
                    <p className="text-sm text-muted-foreground italic">"{report.testimony}"</p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Criado em {formatDateTime(report.created_at)}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Nenhum relatório encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando seu primeiro relatório de frequência.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Relatório
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;

