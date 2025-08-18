import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Camera, 
  Upload,
  Calendar,
  MapPin,
  User,
  Search,
  Filter,
  Grid3X3,
  List,
  Heart,
  Share2,
  Download
} from 'lucide-react';

const GalleryPage = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [searchTerm, setSearchTerm] = useState('');

  // Dados mockados das fotos para demonstração
  const mockPhotos = [
    {
      id: 1,
      filename: 'celula_esperanca_agosto.jpg',
      original_filename: 'Reunião Célula Esperança - Agosto 2024.jpg',
      description: 'Reunião especial da Célula Esperança com estudo sobre fé',
      uploader_name: 'Pedro Líder',
      event_date: '2024-08-15',
      cell_name: 'Célula Esperança',
      created_at: '2024-08-15T21:00:00',
      url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      filename: 'retiro_jovens_2024.jpg',
      original_filename: 'Retiro de Jovens Radicais Livres 2024.jpg',
      description: 'Momento de louvor no retiro de jovens dos Radicais Livres',
      uploader_name: 'Ana Líder',
      event_date: '2024-07-20',
      cell_name: null,
      created_at: '2024-07-21T10:00:00',
      url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      filename: 'batismo_agosto.jpg',
      original_filename: 'Batismo Igreja Videira - Agosto 2024.jpg',
      description: 'Batismo de novos convertidos da igreja',
      uploader_name: 'Carlos Líder',
      event_date: '2024-08-10',
      cell_name: null,
      created_at: '2024-08-10T16:30:00',
      url: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      filename: 'celula_vitoria_julho.jpg',
      original_filename: 'Célula Vitória - Estudo Bíblico Julho.jpg',
      description: 'Estudo bíblico na casa da Ana sobre o amor de Deus',
      uploader_name: 'Ana Líder',
      event_date: '2024-07-25',
      cell_name: 'Célula Vitória',
      created_at: '2024-07-25T20:15:00',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      filename: 'evento_evangelistico.jpg',
      original_filename: 'Evento Evangelístico na Praça.jpg',
      description: 'Evangelismo na praça central de Francisco Morato',
      uploader_name: 'Pastor Administrador',
      event_date: '2024-08-05',
      cell_name: null,
      created_at: '2024-08-05T18:00:00',
      url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      filename: 'celula_fe_oracao.jpg',
      original_filename: 'Célula Fé - Momento de Oração.jpg',
      description: 'Momento especial de oração pelos enfermos',
      uploader_name: 'Carlos Líder',
      event_date: '2024-08-13',
      cell_name: 'Célula Fé',
      created_at: '2024-08-13T21:30:00',
      url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=300&fit=crop'
    }
  ];

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setPhotos(mockPhotos);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const filteredPhotos = photos.filter(photo =>
    photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (photo.cell_name && photo.cell_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    photo.uploader_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PhotoCard = ({ photo }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={photo.url}
          alt={photo.description}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-1">
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">
          {photo.description}
        </h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span>{photo.uploader_name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(photo.event_date)}</span>
          </div>
          {photo.cell_name && (
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{photo.cell_name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const PhotoListItem = ({ photo }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={photo.url}
            alt={photo.description}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{photo.description}</h3>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{photo.uploader_name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(photo.event_date)}</span>
              </div>
              {photo.cell_name && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{photo.cell_name}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
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
            Galeria de Fotos
          </h1>
          <p className="text-muted-foreground">
            Momentos especiais do ministério Radicais Livres
          </p>
        </div>
        
        <Button className="flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Enviar Foto</span>
        </Button>
      </div>

      {/* Controles */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar fotos por descrição, célula ou pessoa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
              </Button>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Fotos</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{photos.length}</div>
            <p className="text-xs text-muted-foreground">
              Momentos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {photos.filter(p => new Date(p.event_date).getMonth() === new Date().getMonth()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Fotos adicionadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Células</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(photos.filter(p => p.cell_name).map(p => p.cell_name)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Com fotos registradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Galeria */}
      {filteredPhotos.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {filteredPhotos.map((photo) => (
            viewMode === 'grid' 
              ? <PhotoCard key={photo.id} photo={photo} />
              : <PhotoListItem key={photo.id} photo={photo} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma foto encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece enviando a primeira foto da galeria.'}
            </p>
            {!searchTerm && (
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Enviar Primeira Foto
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Informações sobre upload */}
      <Card className="mt-8 bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Dicas para Fotos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">📸 Qualidade das Fotos:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Use boa iluminação natural quando possível</li>
                <li>• Mantenha a câmera estável para evitar fotos tremidas</li>
                <li>• Capture momentos espontâneos e genuínos</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">🏷️ Organização:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Adicione descrições detalhadas às fotos</li>
                <li>• Associe fotos às células quando aplicável</li>
                <li>• Use datas corretas dos eventos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryPage;

