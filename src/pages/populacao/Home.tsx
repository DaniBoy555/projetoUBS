import { Calendar, MapPin, Phone, MessageCircle, Heart, Users, Clock, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function PopulacaoHome() {
  const eventosPublicos = [
    { 
      id: 1, 
      titulo: 'Vacinação COVID-19', 
      data: '2025-11-15', 
      horario: '08:00-16:00',
      local: 'UBS Centro',
      vagas: '50 vagas disponíveis',
      tipo: 'vacinacao'
    },
    { 
      id: 2, 
      titulo: 'Consulta Preventiva Mulher', 
      data: '2025-11-18', 
      horario: '14:00-17:00',
      local: 'UBS Vila Nova',
      vagas: '15 vagas disponíveis',
      tipo: 'consulta'
    },
    { 
      id: 3, 
      titulo: 'Palestra: Prevenção Diabetes', 
      data: '2025-11-20', 
      horario: '19:00-20:30',
      local: 'Centro Comunitário',
      vagas: 'Entrada livre',
      tipo: 'palestra'
    },
  ];

  const medicosDisponiveis = [
    { nome: 'Dr. João Silva', especialidade: 'Clínico Geral', local: 'UBS Centro', disponivel: true },
    { nome: 'Dra. Maria Santos', especialidade: 'Ginecologista', local: 'UBS Vila Nova', disponivel: true },
    { nome: 'Dr. Pedro Costa', especialidade: 'Pediatra', local: 'UBS Centro', disponivel: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center mr-3">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Portal da Saúde</h1>
                <p className="text-sm text-gray-600">São Paulo - Centro</p>
              </div>
            </div>
            <Button>
              <MessageCircle className="w-4 h-4 mr-2" />
              Enviar Dúvida
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Cuidando da Sua Saúde
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Encontre eventos, médicos disponíveis e tire suas dúvidas sobre saúde
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex">
                <Input 
                  placeholder="Buscar eventos, médicos ou especialidades..."
                  className="bg-white text-gray-900"
                />
                <Button className="ml-2 bg-blue-800 hover:bg-blue-900">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="text-center p-6">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">45</div>
              <div className="text-gray-600">Eventos este mês</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-6">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">8.5K</div>
              <div className="text-gray-600">Pessoas atendidas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-6">
              <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-gray-600">Suporte disponível</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Próximos Eventos */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Próximos Eventos de Saúde
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventosPublicos.map((evento) => (
                  <div key={evento.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg">{evento.titulo}</h3>
                      <Badge 
                        variant="outline"
                        className={
                          evento.tipo === 'vacinacao' ? 'border-green-500 text-green-700' :
                          evento.tipo === 'consulta' ? 'border-blue-500 text-blue-700' :
                          'border-purple-500 text-purple-700'
                        }
                      >
                        {evento.tipo}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {evento.data}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {evento.horario}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {evento.local}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {evento.vagas}
                      </div>
                    </div>
                    
                    <Button size="sm" className="w-full">
                      Agendar Participação
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Médicos Disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Médicos Disponíveis Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicosDisponiveis.map((medico, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{medico.nome}</h4>
                      <Badge 
                        variant={medico.disponivel ? "default" : "secondary"}
                        className={medico.disponivel ? "bg-green-100 text-green-800" : ""}
                      >
                        {medico.disponivel ? "Disponível" : "Ocupado"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{medico.especialidade}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {medico.local}
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" size="sm" className="w-full">
                  Ver Todos os Médicos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-center">Precisa de Ajuda?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium">Telefone de Emergência</h3>
                <p className="text-gray-600">(11) 99999-9999</p>
              </div>
              <div>
                <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium">Tire suas Dúvidas</h3>
                <Button variant="outline" size="sm" className="mt-2">
                  Enviar Pergunta
                </Button>
              </div>
              <div>
                <MapPin className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <h3 className="font-medium">Localização</h3>
                <p className="text-gray-600">Rua da Saúde, 123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}