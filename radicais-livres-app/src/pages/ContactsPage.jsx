import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail,
  MapPin,
  Clock,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Navigation,
  Church,
  Users,
  Heart
} from 'lucide-react';

const ContactsPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const contacts = {
    church: {
      name: 'Igreja Videira Francisco Morato',
      address: 'Rua das Flores, 123 - Centro, Francisco Morato - SP',
      phone: '(11) 4488-0000',
      email: 'contato@videira-franciscomorato.com.br',
      website: 'www.videira-franciscomorato.com.br',
      cep: '07944-000'
    },
    pastors: [
      {
        id: 1,
        name: 'Pr. Marcelo Sato',
        role: 'Pastor Supervisor da Igreja Videira em Células',
        phone: '(11) 99999-0001',
        email: 'marcelo.sato@videira.com.br',
        whatsapp: '5511999990001',
        description: 'Responsável pela supervisão geral das células da Igreja Videira Francisco Morato'
      },
      {
        id: 2,
        name: 'Pr. Hugo Dias',
        role: 'Pastor de Jovens - Radicais Livres',
        phone: '(11) 99999-0002',
        email: 'hugo.dias@videira.com.br',
        whatsapp: '5511999990002',
        description: 'Pastor responsável pelo ministério de jovens Radicais Livres'
      }
    ],
    socialMedia: {
      instagram: '@radicaislivres_fm',
      facebook: 'Radicais Livres Francisco Morato',
      youtube: 'Igreja Videira Francisco Morato',
      website: 'www.radicaislivres.com.br'
    },
    schedule: {
      cells: 'Terças e Quintas - 19h30',
      youth: 'Sábados - 19h00',
      sunday: 'Domingos - 9h00 e 19h00',
      prayer: 'Quartas - 19h30'
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Contatos
        </h1>
        <p className="text-muted-foreground">
          Entre em contato conosco e faça parte da família Radicais Livres
        </p>
      </div>

      {/* Informações da Igreja */}
      <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Church className="h-5 w-5" />
            <span>{contacts.church.name}</span>
          </CardTitle>
          <CardDescription>
            Nossa casa, sua casa - Venha nos visitar!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Endereço</p>
                  <p className="text-sm text-muted-foreground">
                    {contacts.church.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    CEP: {contacts.church.cep}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Telefone</p>
                  <p className="text-sm text-muted-foreground">
                    {contacts.church.phone}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">E-mail</p>
                  <p className="text-sm text-muted-foreground">
                    {contacts.church.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Website</p>
                  <p className="text-sm text-muted-foreground">
                    {contacts.church.website}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex items-center space-x-2">
                <Navigation className="h-4 w-4" />
                <span>Como Chegar</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Ligar Agora</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Enviar E-mail</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pastores Responsáveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {contacts.pastors.map((pastor) => (
          <Card key={pastor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{pastor.name}</CardTitle>
                  <CardDescription>{pastor.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {pastor.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{pastor.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{pastor.email}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => window.open(`https://wa.me/${pastor.whatsapp}`, '_blank')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(`mailto:${pastor.email}`, '_blank')}
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(`tel:${pastor.phone}`, '_blank')}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Horários e Redes Sociais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Horários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Horários</span>
            </CardTitle>
            <CardDescription>
              Venha participar dos nossos encontros
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Células</p>
                <p className="text-sm text-muted-foreground">Reuniões nas casas</p>
              </div>
              <Badge variant="secondary">{contacts.schedule.cells}</Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Radicais Livres</p>
                <p className="text-sm text-muted-foreground">Ministério de jovens</p>
              </div>
              <Badge variant="secondary">{contacts.schedule.youth}</Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Cultos</p>
                <p className="text-sm text-muted-foreground">Domingos na igreja</p>
              </div>
              <Badge variant="secondary">{contacts.schedule.sunday}</Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Oração</p>
                <p className="text-sm text-muted-foreground">Reunião de oração</p>
              </div>
              <Badge variant="secondary">{contacts.schedule.prayer}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Redes Sociais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Redes Sociais</span>
            </CardTitle>
            <CardDescription>
              Siga-nos e fique por dentro de tudo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open(`https://instagram.com/${contacts.socialMedia.instagram.replace('@', '')}`, '_blank')}
            >
              <Instagram className="mr-3 h-5 w-5 text-pink-500" />
              <div className="text-left">
                <p className="font-medium">Instagram</p>
                <p className="text-sm text-muted-foreground">{contacts.socialMedia.instagram}</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open(`https://facebook.com/${contacts.socialMedia.facebook}`, '_blank')}
            >
              <Facebook className="mr-3 h-5 w-5 text-blue-500" />
              <div className="text-left">
                <p className="font-medium">Facebook</p>
                <p className="text-sm text-muted-foreground">{contacts.socialMedia.facebook}</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open(`https://youtube.com/${contacts.socialMedia.youtube}`, '_blank')}
            >
              <Youtube className="mr-3 h-5 w-5 text-red-500" />
              <div className="text-left">
                <p className="font-medium">YouTube</p>
                <p className="text-sm text-muted-foreground">{contacts.socialMedia.youtube}</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open(`https://${contacts.socialMedia.website}`, '_blank')}
            >
              <Globe className="mr-3 h-5 w-5 text-green-500" />
              <div className="text-left">
                <p className="font-medium">Website</p>
                <p className="text-sm text-muted-foreground">{contacts.socialMedia.website}</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Chamada para ação */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Venha Fazer Parte!</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Os Radicais Livres são mais que um ministério de jovens - somos uma família 
              unida pelo amor de Cristo. Se você tem entre 15 e 30 anos e quer viver uma 
              vida radical para Jesus, este é o seu lugar!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-accent hover:bg-accent/90"
                onClick={() => window.open('https://wa.me/5511999990002', '_blank')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Fale Conosco no WhatsApp
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => window.open('mailto:hugo.dias@videira.com.br', '_blank')}
              >
                <Mail className="mr-2 h-5 w-5" />
                Envie um E-mail
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactsPage;

