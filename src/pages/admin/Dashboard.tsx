import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Wrench, Building2, Map, DollarSign, ClipboardList, Clock, ChevronRight, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RecentUser {
  id: string;
  name: string;
  type: "Cliente" | "Prestador" | "Vidraçaria";
  date: string;
  status: string;
}

interface PendingApproval {
  id: string;
  name: string;
  type: "Prestador" | "Vidraçaria";
  location: string;
}

const AdminDashboard = () => {
  const [mensagensNaoLidas, setMensagensNaoLidas] = useState(0);
  const [stats, setStats] = useState([
    { label: "Clientes", value: "0", icon: Users, color: "bg-primary/10 text-primary", link: "/admin/clientes" },
    { label: "Prestadores", value: "0", icon: Wrench, color: "bg-success/10 text-success", link: "/admin/prestadores" },
    { label: "Vidraçarias", value: "0", icon: Building2, color: "bg-warning/10 text-warning", link: "/admin/vidracarias" },
    { label: "Ordem de Serviços", value: "0", icon: ClipboardList, color: "bg-accent/10 text-accent", link: "/admin/ordens" },
  ]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const monthlyData = [
    { month: "Jan", receita: 0, despesas: 0 },
    { month: "Fev", receita: 0, despesas: 0 },
    { month: "Mar", receita: 0, despesas: 0 },
    { month: "Abr", receita: 0, despesas: 0 },
    { month: "Mai", receita: 0, despesas: 0 },
    { month: "Jun", receita: 0, despesas: 0 },
    { month: "Jul", receita: 0, despesas: 0 },
    { month: "Ago", receita: 0, despesas: 0 },
    { month: "Set", receita: 0, despesas: 0 },
    { month: "Out", receita: 0, despesas: 0 },
    { month: "Nov", receita: 0, despesas: 0 },
    { month: "Dez", receita: 0, despesas: 0 },
  ];

  const yearlyData = [
    { year: "2019", receita: 0, lucro: 0 },
    { year: "2020", receita: 0, lucro: 0 },
    { year: "2021", receita: 0, lucro: 0 },
    { year: "2022", receita: 0, lucro: 0 },
    { year: "2023", receita: 0, lucro: 0 },
    { year: "2024", receita: 0, lucro: 0 },
  ];

  useEffect(() => {
    const carregarDados = async () => {
      setIsLoading(true);
      try {
        // Carregar contagens
        const [clientesRes, prestadoresRes, vidracariasRes, ordensRes] = await Promise.all([
          supabase.from('clientes').select('*', { count: 'exact', head: true }),
          supabase.from('prestadores_servico').select('*', { count: 'exact', head: true }),
          supabase.from('vidracarias').select('*', { count: 'exact', head: true }),
          supabase.from('ordens_servico').select('*', { count: 'exact', head: true }),
        ]);

        setStats([
          { label: "Clientes", value: String(clientesRes.count || 0), icon: Users, color: "bg-primary/10 text-primary", link: "/admin/clientes" },
          { label: "Prestadores", value: String(prestadoresRes.count || 0), icon: Wrench, color: "bg-success/10 text-success", link: "/admin/prestadores" },
          { label: "Vidraçarias", value: String(vidracariasRes.count || 0), icon: Building2, color: "bg-warning/10 text-warning", link: "/admin/vidracarias" },
          { label: "Ordem de Serviços", value: String(ordensRes.count || 0), icon: ClipboardList, color: "bg-accent/10 text-accent", link: "/admin/ordens" },
        ]);

        // Carregar usuários recentes
        const [recentClientes, recentPrestadores, recentVidracarias] = await Promise.all([
          supabase.from('clientes').select('id, nome, status, created_at').order('created_at', { ascending: false }).limit(2),
          supabase.from('prestadores_servico').select('id, nome, status, created_at').order('created_at', { ascending: false }).limit(2),
          supabase.from('vidracarias').select('id, razao_social, nome_fantasia, status, created_at').order('created_at', { ascending: false }).limit(2),
        ]);

        const formatDate = (dateStr: string) => {
          const date = new Date(dateStr);
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (date.toDateString() === today.toDateString()) {
            return `Hoje, ${format(date, 'HH:mm')}`;
          } else if (date.toDateString() === yesterday.toDateString()) {
            return `Ontem, ${format(date, 'HH:mm')}`;
          }
          return format(date, "dd/MM/yyyy, HH:mm");
        };

        const recent: RecentUser[] = [
          ...(recentClientes.data || []).map(c => ({
            id: c.id,
            name: c.nome,
            type: "Cliente" as const,
            date: formatDate(c.created_at),
            status: c.status === 'ativo' ? 'Ativo' : 'Pendente'
          })),
          ...(recentPrestadores.data || []).map(p => ({
            id: p.id,
            name: p.nome,
            type: "Prestador" as const,
            date: formatDate(p.created_at),
            status: p.status === 'aprovado' || p.status === 'ativo' ? 'Ativo' : 'Pendente'
          })),
          ...(recentVidracarias.data || []).map(v => ({
            id: v.id,
            name: v.nome_fantasia || v.razao_social,
            type: "Vidraçaria" as const,
            date: formatDate(v.created_at),
            status: v.status === 'aprovado' || v.status === 'ativo' ? 'Ativo' : 'Pendente'
          })),
        ].sort((a, b) => {
          // Simple sort by date string for now
          return 0;
        }).slice(0, 4);

        setRecentUsers(recent);

        // Carregar aprovações pendentes
        const [pendingPrestadores, pendingVidracarias] = await Promise.all([
          supabase.from('prestadores_servico').select('id, nome, cidade, estado').eq('status', 'pendente').limit(3),
          supabase.from('vidracarias').select('id, razao_social, nome_fantasia, cidade, estado').eq('status', 'pendente').limit(3),
        ]);

        const pending: PendingApproval[] = [
          ...(pendingPrestadores.data || []).map(p => ({
            id: p.id,
            name: p.nome,
            type: "Prestador" as const,
            location: `${p.cidade || ''}, ${p.estado || ''}`
          })),
          ...(pendingVidracarias.data || []).map(v => ({
            id: v.id,
            name: v.nome_fantasia || v.razao_social,
            type: "Vidraçaria" as const,
            location: `${v.cidade || ''}, ${v.estado || ''}`
          })),
        ].slice(0, 3);

        setPendingApprovals(pending);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Carregar contador de mensagens não lidas
  useEffect(() => {
    const carregarMensagensNaoLidas = async () => {
      const { count, error } = await supabase
        .from('mensagens')
        .select('*', { count: 'exact', head: true })
        .eq('lida', false)
        .neq('remetente_tipo', 'admin');

      if (!error && count !== null) {
        setMensagensNaoLidas(count);
      }
    };

    carregarMensagensNaoLidas();

    // Realtime para novas mensagens
    const channel = supabase
      .channel('mensagens-admin-count')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensagens'
        },
        (payload) => {
          const novaMensagem = payload.new as { remetente_tipo: string };
          if (novaMensagem.remetente_tipo !== 'admin') {
            setMensagensNaoLidas(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="mobile-container min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-hero-gradient px-6 pt-12 pb-8 rounded-b-[2rem]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-white font-display">
            Painel Administrativo
          </h1>
          <p className="text-white/70 mt-1">Gestão completa do sistema</p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          {stats.map((stat, index) => (
            <button
              key={index}
              onClick={() => navigate(stat.link)}
              className="bg-white rounded-xl p-4 shadow-card text-left hover:shadow-lg transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-2`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-foreground font-display">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </button>
          ))}
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-2 gap-4"
        >
          <button 
            onClick={() => navigate('/admin/financeiro')}
            className="premium-card flex items-center gap-3 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Financeiro</p>
              <p className="text-xs text-muted-foreground">Dashboard completo</p>
            </div>
          </button>
          <button 
            onClick={() => navigate('/admin/mapa')}
            className="premium-card flex items-center gap-3 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Map className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Mapa</p>
              <p className="text-xs text-muted-foreground">Ver cobertura</p>
            </div>
          </button>
          <button 
            onClick={() => navigate('/admin/chat')}
            className="premium-card flex items-center gap-3 text-left relative col-span-2"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center relative">
              <MessageCircle className="w-6 h-6 text-accent" />
              {mensagensNaoLidas > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
                >
                  {mensagensNaoLidas > 99 ? '99+' : mensagensNaoLidas}
                </Badge>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Chat</p>
              <p className="text-xs text-muted-foreground">Central de mensagens</p>
            </div>
          </button>
        </motion.div>

        {/* Pending Approvals */}
        {pendingApprovals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground font-display">
                Aguardando Aprovação
              </h2>
              <span className="bg-warning/10 text-warning px-2 py-1 rounded-full text-xs font-medium">
                {pendingApprovals.length} pendentes
              </span>
            </div>
            <div className="space-y-3">
              {pendingApprovals.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
                >
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.type} • {item.location}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Balance Chart - Last 12 Months */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <h2 className="text-lg font-semibold text-foreground font-display mb-4">
            Balanço - Últimos 12 Meses
          </h2>
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(213, 90%, 35%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(213, 90%, 35%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(215, 20%, 50%)" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(215, 20%, 50%)" tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toLocaleString()}`, '']}
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid hsl(214, 32%, 91%)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="receita" stroke="hsl(213, 90%, 35%)" fill="url(#colorReceita)" name="Receita" />
                <Area type="monotone" dataKey="despesas" stroke="hsl(0, 84%, 60%)" fill="url(#colorDespesas)" name="Despesas" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs text-muted-foreground">Receita</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <span className="text-xs text-muted-foreground">Despesas</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Yearly Balance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <h2 className="text-lg font-semibold text-foreground font-display mb-4">
            Balanço Anual - Últimos 6 Anos
          </h2>
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="hsl(215, 20%, 50%)" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(215, 20%, 50%)" tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toLocaleString()}`, '']}
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid hsl(214, 32%, 91%)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="receita" fill="hsl(213, 90%, 35%)" radius={[4, 4, 0, 0]} name="Receita" />
                <Bar dataKey="lucro" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} name="Lucro" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs text-muted-foreground">Receita</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-xs text-muted-foreground">Lucro</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Users */}
        {recentUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <h2 className="text-lg font-semibold text-foreground font-display mb-4">
              Cadastros Recentes
            </h2>
            <div className="space-y-3">
              {recentUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    user.type === 'Cliente' ? 'bg-primary/10' : 
                    user.type === 'Prestador' ? 'bg-success/10' : 'bg-warning/10'
                  }`}>
                    {user.type === 'Cliente' ? <Users className="w-5 h-5 text-primary" /> :
                     user.type === 'Prestador' ? <Wrench className="w-5 h-5 text-success" /> :
                     <Building2 className="w-5 h-5 text-warning" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.type} • {user.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.status === 'Ativo' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                  }`}>
                    {user.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
