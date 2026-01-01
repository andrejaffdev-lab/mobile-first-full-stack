import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Search, User, Building2, Wrench, X, MessageCircle } from 'lucide-react';
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
  const [conversasAbertas, setConversasAbertas] = useState<Contato[]>([]);
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

  const abrirConversa = (contato: Contato) => {
    setContatoSelecionado(contato);
    // Adicionar às conversas abertas se não existir
    if (!conversasAbertas.find(c => c.id === contato.id && c.tipo === contato.tipo)) {
      setConversasAbertas(prev => [...prev, contato]);
    }
  };

  const fecharConversa = (contato: Contato, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setConversasAbertas(prev => prev.filter(c => !(c.id === contato.id && c.tipo === contato.tipo)));
    if (contatoSelecionado?.id === contato.id && contatoSelecionado?.tipo === contato.tipo) {
      // Selecionar próxima conversa ou voltar para lista
      const remaining = conversasAbertas.filter(c => !(c.id === contato.id && c.tipo === contato.tipo));
      setContatoSelecionado(remaining.length > 0 ? remaining[remaining.length - 1] : null);
    }
  };

  const voltarParaLista = () => {
    setContatoSelecionado(null);
  };

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

  // Renderizar Lista de Contatos (tela principal no mobile)
  const renderListaContatos = () => (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/admin')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Chat - Mensagens</h1>
        </div>
      </header>

      {/* Abas de conversas ativas */}
      {conversasAbertas.length > 0 && (
        <div className="bg-muted/50 border-b px-4 py-2">
          <ScrollArea className="w-full">
            <div className="flex gap-2">
              {conversasAbertas.map(contato => (
                <motion.div
                  key={`tab-${contato.tipo}-${contato.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer shrink-0 ${
                    contatoSelecionado?.id === contato.id && contatoSelecionado?.tipo === contato.tipo
                      ? 'bg-primary text-white'
                      : 'bg-white border'
                  }`}
                  onClick={() => setContatoSelecionado(contato)}
                >
                  <span className="max-w-24 truncate">{contato.nome}</span>
                  <button
                    onClick={(e) => fecharConversa(contato, e)}
                    className="hover:bg-black/10 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Busca */}
      <div className="p-4 border-b bg-white">
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

      {/* Lista */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando contatos...</p>
          </div>
        ) : contatosFiltrados.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum contato encontrado</p>
          </div>
        ) : (
          <div className="divide-y">
            {contatosFiltrados.map(contato => (
              <motion.div
                key={`${contato.tipo}-${contato.id}`}
                whileTap={{ scale: 0.98 }}
                className="p-4 cursor-pointer active:bg-muted transition-colors"
                onClick={() => abrirConversa(contato)}
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
                      <Badge variant="secondary" className="text-xs shrink-0">
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
  );

  // Renderizar área de chat (tela cheia no mobile)
  const renderChat = () => (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header do Chat */}
      <header className="sticky top-0 z-50 bg-white border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={voltarParaLista}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <Avatar className={`${getCorTipo(contatoSelecionado!.tipo)} text-white`}>
            <AvatarFallback className="bg-transparent">
              {getIconeTipo(contatoSelecionado!.tipo)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">{contatoSelecionado!.nome}</h2>
            <Badge variant="secondary" className="text-xs capitalize">
              {contatoSelecionado!.tipo}
            </Badge>
          </div>
        </div>
      </header>

      {/* Abas de conversas ativas */}
      {conversasAbertas.length > 1 && (
        <div className="bg-muted/50 border-b px-4 py-2">
          <ScrollArea className="w-full">
            <div className="flex gap-2">
              {conversasAbertas.map(contato => (
                <motion.div
                  key={`tab-${contato.tipo}-${contato.id}`}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer shrink-0 ${
                    contatoSelecionado?.id === contato.id && contatoSelecionado?.tipo === contato.tipo
                      ? 'bg-primary text-white'
                      : 'bg-white border'
                  }`}
                  onClick={() => setContatoSelecionado(contato)}
                >
                  <span className="max-w-20 truncate">{contato.nome}</span>
                  <button
                    onClick={(e) => fecharConversa(contato, e)}
                    className="hover:bg-black/10 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Mensagens */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4 bg-muted/30">
        <AnimatePresence>
          {mensagens.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhuma mensagem ainda</p>
              <p className="text-sm text-muted-foreground/70">Inicie a conversa!</p>
            </div>
          ) : (
            mensagens.map((msg) => {
              const isAdmin = msg.remetente_tipo === 'admin';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex mb-3 ${isAdmin ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      isAdmin
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-white rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <p className="text-sm">{msg.conteudo}</p>
                    <span className={`text-[10px] ${isAdmin ? 'text-primary-foreground/70' : 'text-muted-foreground'} mt-1 block text-right`}>
                      {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </ScrollArea>

      {/* Input */}
      <div className="sticky bottom-0 bg-white border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
            className="flex-1"
          />
          <Button onClick={enviarMensagem} disabled={!novaMensagem.trim()} size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  return contatoSelecionado ? renderChat() : renderListaContatos();
};

export default AdminChat;
