import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Send, 
  Phone, 
  CheckCheck,
  Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

interface UserInfo {
  id: string;
  tipo: 'cliente' | 'prestador' | 'vidracaria';
  nome: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Identificar o tipo de usuário logado
  useEffect(() => {
    const identificarUsuario = async () => {
      setLoading(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error('Você precisa estar logado');
        navigate('/login');
        return;
      }

      const userId = userData.user.id;

      // Verificar se é cliente
      const { data: cliente } = await supabase
        .from('clientes')
        .select('id, nome')
        .eq('user_id', userId)
        .single();

      if (cliente) {
        setUserInfo({ id: cliente.id, tipo: 'cliente', nome: cliente.nome });
        setLoading(false);
        return;
      }

      // Verificar se é prestador
      const { data: prestador } = await supabase
        .from('prestadores_servico')
        .select('id, nome')
        .eq('user_id', userId)
        .single();

      if (prestador) {
        setUserInfo({ id: prestador.id, tipo: 'prestador', nome: prestador.nome });
        setLoading(false);
        return;
      }

      // Verificar se é vidraçaria
      const { data: vidracaria } = await supabase
        .from('vidracarias')
        .select('id, razao_social')
        .eq('user_id', userId)
        .single();

      if (vidracaria) {
        setUserInfo({ id: vidracaria.id, tipo: 'vidracaria', nome: vidracaria.razao_social });
        setLoading(false);
        return;
      }

      toast.error('Perfil não encontrado');
      navigate('/login');
    };

    identificarUsuario();
  }, [navigate]);

  // Carregar mensagens do usuário
  useEffect(() => {
    if (!userInfo) return;

    const carregarMensagens = async () => {
      const { data, error } = await supabase
        .from('mensagens')
        .select('*')
        .or(`and(remetente_id.eq.${userInfo.id},remetente_tipo.eq.${userInfo.tipo}),and(destinatario_id.eq.${userInfo.id},destinatario_tipo.eq.${userInfo.tipo})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar mensagens:', error);
        return;
      }

      setMensagens(data || []);

      // Marcar mensagens recebidas como lidas
      const mensagensNaoLidas = (data || []).filter(
        m => m.destinatario_id === userInfo.id && m.destinatario_tipo === userInfo.tipo && !m.lida
      );

      if (mensagensNaoLidas.length > 0) {
        await supabase
          .from('mensagens')
          .update({ lida: true })
          .in('id', mensagensNaoLidas.map(m => m.id));
      }
    };

    carregarMensagens();

    // Realtime subscription
    const channel = supabase
      .channel(`chat-${userInfo.id}`)
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
            (novaMensagem.remetente_id === userInfo.id && novaMensagem.remetente_tipo === userInfo.tipo) ||
            (novaMensagem.destinatario_id === userInfo.id && novaMensagem.destinatario_tipo === userInfo.tipo)
          ) {
            setMensagens(prev => [...prev, novaMensagem]);
            
            // Marcar como lida se for destinatário
            if (novaMensagem.destinatario_id === userInfo.id && novaMensagem.destinatario_tipo === userInfo.tipo) {
              supabase
                .from('mensagens')
                .update({ lida: true })
                .eq('id', novaMensagem.id);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userInfo]);

  // Scroll automático
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens]);

  const handleSend = async () => {
    if (!newMessage.trim() || !userInfo) return;

    const { error } = await supabase.from('mensagens').insert({
      remetente_id: userInfo.id,
      remetente_tipo: userInfo.tipo,
      destinatario_id: null, // Será tratado pelo admin
      destinatario_tipo: 'admin',
      conteudo: newMessage.trim()
    });

    if (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
      return;
    }

    setNewMessage("");
  };

  if (loading) {
    return (
      <div className="mobile-container min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-foreground truncate">
                Suporte BoxManutenção
              </h1>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="w-2 h-2 bg-success rounded-full" />
                Atendimento ativo
              </p>
            </div>
          </div>

          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Phone className="w-5 h-5 text-primary" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4 bg-muted/30">
        {/* Data */}
        <div className="flex justify-center mb-4">
          <span className="text-xs text-muted-foreground bg-white px-3 py-1 rounded-full shadow-sm">
            Hoje
          </span>
        </div>

        {mensagens.length === 0 ? (
          <div className="text-center py-12">
            <Headphones className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhuma mensagem ainda.</p>
            <p className="text-sm text-muted-foreground/70">Envie uma mensagem para iniciar a conversa!</p>
          </div>
        ) : (
          <AnimatePresence>
            {mensagens.map((message, index) => {
              const isUser = message.remetente_id === userInfo?.id && message.remetente_tipo === userInfo?.tipo;
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`flex mb-3 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      isUser
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-white text-foreground rounded-bl-md shadow-sm"
                    }`}
                  >
                    <p className="text-sm">{message.conteudo}</p>
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 ${
                        isUser ? "text-white/70" : "text-muted-foreground"
                      }`}
                    >
                      <span className="text-[10px]">
                        {new Date(message.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isUser && (
                        <CheckCheck className={`w-3.5 h-3.5 ${message.lida ? '' : 'opacity-50'}`} />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="sticky bottom-0 bg-white border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            onClick={handleSend}
            size="icon"
            disabled={!newMessage.trim()}
            className="shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
