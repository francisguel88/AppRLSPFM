import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  User, 
  Heart,
  Target,
  Users,
  BookOpen,
  Church
} from 'lucide-react';

const PastorsPage = () => {
  const [pastorsData, setPastorsData] = useState(null);
  const [visionData, setVisionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pastorsResponse, visionResponse] = await Promise.all([
        fetch('/api/pastors/', { credentials: 'include' }),
        fetch('/api/pastors/vision', { credentials: 'include' })
      ]);
      
      if (pastorsResponse.ok) {
        const pastorsData = await pastorsResponse.json();
        setPastorsData(pastorsData);
      }
      
      if (visionResponse.ok) {
        const visionData = await visionResponse.json();
        setVisionData(visionData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Pastores Responsáveis
        </h1>
        <p className="text-muted-foreground">
          Conheça os pastores que lideram o ministério Radicais Livres
        </p>
      </div>

      {/* Cards dos Pastores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {pastorsData?.pastors?.map((pastor) => (
          <Card key={pastor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-xl">{pastor.name}</CardTitle>
              <CardDescription>
                <Badge variant="secondary" className="mb-2">
                  {pastor.role}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                {pastor.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{pastor.contact.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{pastor.contact.phone}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(`mailto:${pastor.contact.email}`, '_blank')}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar E-mail
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visão da Igreja */}
      {visionData && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Church className="h-5 w-5" />
                <span>{visionData.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Nossa Visão</span>
                </h4>
                <blockquote className="text-lg italic border-l-4 border-primary pl-4">
                  {visionData.vision}
                </blockquote>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Nossa Missão</span>
                </h4>
                <p className="text-muted-foreground">
                  {visionData.mission}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Valores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Nossos Valores</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {visionData.values?.map((value, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Ministério Radicais Livres */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>{visionData.ministry_focus?.title}</span>
                </CardTitle>
                <CardDescription>
                  {visionData.ministry_focus?.target}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {visionData.ministry_focus?.description}
                </p>
                
                <div>
                  <h5 className="font-medium mb-2">Nossas Atividades:</h5>
                  <ul className="space-y-1 text-sm">
                    {visionData.ministry_focus?.activities?.map((activity, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Chamada para ação */}
      <Card className="mt-8 bg-accent/5 border-accent/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Faça Parte da Nossa Família!</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Se você é jovem e tem o coração ardente por Jesus, venha fazer parte 
              dos Radicais Livres. Juntos, vamos impactar vidas e transformar nossa cidade!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-accent hover:bg-accent/90"
                onClick={() => window.open('mailto:hugo.dias@videira.com.br', '_blank')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Entre em Contato
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('tel:+5511999990002', '_blank')}
              >
                <Phone className="mr-2 h-4 w-4" />
                Ligue Agora
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PastorsPage;

