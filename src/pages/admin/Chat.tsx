import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Search, User, Building2, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Contato {
  id: string;
  nome: string;
  tipo: 'cliente' | 'prestador' | 'vidracaria';
  ultimaMensagem?: string;
  naoLidas: number;
}

interface Mensagem {
  id: string;
  remetente_id: string;
  remetente_tipo: string;
  destinatario_id: string | null;
  destinatario_tipo: string | null;
  conteudo: string;
  lida: boolean;
  created_at: string;
}

const AdminChat = () => {
  const navigate = useNavigate();
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [contatoSelecionado, setContatoSelecionado] = useState<Contato | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Carregar contatos (clientes, prestadores, vidraçarias)
  useEffect(() => {
    const carregarContatos = async () => {
      setLoading(true);
      try {
        const [clientesRes, prestadoresRes, vidracariasRes] = await Promise.all([
          supabase.from('clientes').select('id, nome').eq('status', 'ativo'),
          supabase.from('prestadores_servico').select('id, nome').eq('status', 'aprovado'),
          supabase.from('vidracarias').select('id, razao_social').eq('status', 'aprovado')
        ]);

        const todosContatos: Contato[] = [];

        if (clientesRes.data) {
          clientesRes.data.forEach(c => {
            todosContatos.push({
              id: c.id,
              nome: c.nome,
              tipo: 'cliente',
              naoLidas: 0
            });
          });
        }

        if (prestadoresRes.data) {
          prestadoresRes.data.forEach(p => {
            todosContatos.push({
              id: p.id,
              nome: p.nome,
              tipo: 'prestador',
              naoLidas: 0
            });
          });
        }

        if (vidracariasRes.data) {
          vidracariasRes.data.forEach(v => {
            todosContatos.push({
              id: v.id,
              nome: v.razao_social,
              tipo: 'vidracaria',
              naoLidas: 0
            });
          });
        }

        setContatos(todosContatos);
      } catch (error) {
        console.error('Erro ao carregar contatos:', error);
        toast.error('Erro ao carregar contatos');
      } finally {
        setLoading(false);
      }
    };

    carregarContatos();
  }, []);

  // Carregar mensagens do contato selecionado
  useEffect(() => {
    if (!contatoSelecionado) return;

    const carregarMensagens = async () => {
      const { data, error } = await supabase
        .from('mensagens')
        .select('*')
        .or(`and(remetente_id.eq.${contatoSelecionado.id},remetente_tipo.eq.${contatoSelecionado.tipo}),and(destinatario_id.eq.${contatoSelecionado.id},destinatario_tipo.eq.${contatoSelecionado.tipo})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar mensagens:', error);
        toast.error('Erro ao carregar mensagens');
        return;
      }

      setMensagens(data || []);
    };

    carregarMensagens();

    // Realtime subscription
    const channel = supabase
      .channel(`mensagens-${contatoSelecionado.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensagens'
        },
        (payload) => {
          const novaMensagem = payload.new as Mensagem;
          if (
            (novaMensagem.remetente_id === contatoSelecionado.id && novaMensagem.remetente_tipo === contatoSelecionado.tipo) ||
            (novaMensagem.destinatario_id === contatoSelecionado.id && novaMensagem.destinatario_tipo === contatoSelecionado.tipo)
          ) {
            setMensagens(prev => [...prev, novaMensagem]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contatoSelecionado]);

  // Scroll automático para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens]);

  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !contatoSelecionado) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.error('Você precisa estar logado');
      return;
    }

    const { error } = await supabase.from('mensagens').insert({
      remetente_id: userData.user.id,
      remetente_tipo: 'admin',
      destinatario_id: contatoSelecionado.id,
      destinatario_tipo: contatoSelecionado.tipo,
      conteudo: novaMensagem.trim()
    });

    if (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
      return;
    }

    setNovaMensagem('');
  };

  const contatosFiltrados = contatos.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const getIconeTipo = (tipo: string) => {
    switch (tipo) {
      case 'cliente': return <User className="h-4 w-4" />;
      case 'prestador': return <Wrench className="h-4 w-4" />;
      case 'vidracaria': return <Building2 className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getCorTipo = (tipo: string) => {
    switch (tipo) {
      case 'cliente': return 'bg-blue-500';
      case 'prestador': return 'bg-green-500';
      case 'vidracaria': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/admin')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Chat - Central de Mensagens</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Lista de Contatos */}
        <div className="w-80 border-r bg-card flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar contato..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                Carregando contatos...
              </div>
            ) : contatosFiltrados.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Nenhum contato encontrado
              </div>
            ) : (
              <div className="divide-y">
                {contatosFiltrados.map(contato => (
                  <motion.div
                    key={`${contato.tipo}-${contato.id}`}
                    whileHover={{ backgroundColor: 'hsl(var(--accent))' }}
                    className={`p-3 cursor-pointer transition-colors ${
                      contatoSelecionado?.id === contato.id && contatoSelecionado?.tipo === contato.tipo
                        ? 'bg-accent'
                        : ''
                    }`}
                    onClick={() => setContatoSelecionado(contato)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className={`${getCorTipo(contato.tipo)} text-white`}>
                        <AvatarFallback className="bg-transparent">
                          {getIconeTipo(contato.tipo)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{contato.nome}</span>
                          <Badge variant="secondary" className="text-xs">
                            {contato.tipo}
                          </Badge>
                        </div>
                        {contato.ultimaMensagem && (
                          <p className="text-sm text-muted-foreground truncate">
                            {contato.ultimaMensagem}
                          </p>
                        )}
                      </div>
                      {contato.naoLidas > 0 && (
                        <Badge variant="default" className="rounded-full">
                          {contato.naoLidas}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Área de Chat */}
        <div className="flex-1 flex flex-col bg-background">
          {contatoSelecionado ? (
            <>
              {/* Header do Chat */}
              <div className="p-4 border-b bg-card flex items-center gap-3">
                <Avatar className={`${getCorTipo(contatoSelecionado.tipo)} text-white`}>
                  <AvatarFallback className="bg-transparent">
                    {getIconeTipo(contatoSelecionado.tipo)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{contatoSelecionado.nome}</h2>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {contatoSelecionado.tipo}
                  </Badge>
                </div>
              </div>

              {/* Mensagens */}
              <ScrollArea ref={scrollRef} className="flex-1 p-4">
                <AnimatePresence>
                  {mensagens.map((msg) => {
                    const isAdmin = msg.remetente_tipo === 'admin';
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex mb-3 ${isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            isAdmin
                              ? 'bg-primary text-primary-foreground rounded-br-sm'
                              : 'bg-muted rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm">{msg.conteudo}</p>
                          <span className={`text-xs ${isAdmin ? 'text-primary-foreground/70' : 'text-muted-foreground'} mt-1 block`}>
                            {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t bg-card">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
                    className="flex-1"
                  />
                  <Button onClick={enviarMensagem} disabled={!novaMensagem.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Selecione um contato para iniciar uma conversa</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
