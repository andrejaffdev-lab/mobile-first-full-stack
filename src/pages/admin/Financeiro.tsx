import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Transaction {
  id: string;
  description: string;
  type: "income" | "expense";
  value: number;
  date: string;
}

const AdminFinanceiro = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summaryCards, setSummaryCards] = useState([
    { label: "Receita Total", value: "R$ 0", change: "+0%", icon: DollarSign, color: "bg-success/10 text-success", trend: "up" },
    { label: "Despesas", value: "R$ 0", change: "+0%", icon: CreditCard, color: "bg-destructive/10 text-destructive", trend: "up" },
    { label: "Lucro Líquido", value: "R$ 0", change: "+0%", icon: Wallet, color: "bg-primary/10 text-primary", trend: "up" },
    { label: "Reserva", value: "R$ 0", change: "+0%", icon: PiggyBank, color: "bg-warning/10 text-warning", trend: "up" },
  ]);

  const monthlyData = [
    { month: "Jan", receita: 0, despesas: 0, lucro: 0 },
    { month: "Fev", receita: 0, despesas: 0, lucro: 0 },
    { month: "Mar", receita: 0, despesas: 0, lucro: 0 },
    { month: "Abr", receita: 0, despesas: 0, lucro: 0 },
    { month: "Mai", receita: 0, despesas: 0, lucro: 0 },
    { month: "Jun", receita: 0, despesas: 0, lucro: 0 },
    { month: "Jul", receita: 0, despesas: 0, lucro: 0 },
    { month: "Ago", receita: 0, despesas: 0, lucro: 0 },
    { month: "Set", receita: 0, despesas: 0, lucro: 0 },
    { month: "Out", receita: 0, despesas: 0, lucro: 0 },
    { month: "Nov", receita: 0, despesas: 0, lucro: 0 },
    { month: "Dez", receita: 0, despesas: 0, lucro: 0 },
  ];

  const yearlyData = [
    { year: "2019", receita: 0, lucro: 0 },
    { year: "2020", receita: 0, lucro: 0 },
    { year: "2021", receita: 0, lucro: 0 },
    { year: "2022", receita: 0, lucro: 0 },
    { year: "2023", receita: 0, lucro: 0 },
    { year: "2024", receita: 0, lucro: 0 },
  ];

  const expenseBreakdown = [
    { name: "Comissões Prestadores", value: 0, color: "hsl(213, 90%, 35%)" },
    { name: "Comissões Vidraçarias", value: 0, color: "hsl(142, 76%, 36%)" },
    { name: "Operacional", value: 0, color: "hsl(38, 92%, 50%)" },
    { name: "Marketing", value: 0, color: "hsl(200, 100%, 50%)" },
    { name: "Outros", value: 0, color: "hsl(0, 84%, 60%)" },
  ];

  const revenueBySource = [
    { name: "Instalações", value: 0, color: "hsl(213, 90%, 35%)" },
    { name: "Assinaturas", value: 0, color: "hsl(142, 76%, 36%)" },
    { name: "Comissões", value: 0, color: "hsl(38, 92%, 50%)" },
    { name: "Outros", value: 0, color: "hsl(200, 100%, 50%)" },
  ];

  useEffect(() => {
    const carregarDados = async () => {
      // Carregar transações recentes
      const { data: financeiroData } = await supabase
        .from('financeiro')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (financeiroData) {
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

        const txs: Transaction[] = financeiroData.map(f => ({
          id: f.id,
          description: f.descricao || f.tipo,
          type: f.tipo === 'receita' ? 'income' : 'expense',
          value: f.tipo === 'receita' ? Number(f.valor) : -Number(f.valor),
          date: formatDate(f.created_at)
        }));
        setTransactions(txs);

        // Calcular totais
        const totalReceitas = financeiroData
          .filter(f => f.tipo === 'receita')
          .reduce((acc, f) => acc + Number(f.valor), 0);
        const totalDespesas = financeiroData
          .filter(f => f.tipo !== 'receita')
          .reduce((acc, f) => acc + Number(f.valor), 0);
        const lucro = totalReceitas - totalDespesas;

        setSummaryCards([
          { label: "Receita Total", value: `R$ ${totalReceitas.toLocaleString()}`, change: "+0%", icon: DollarSign, color: "bg-success/10 text-success", trend: "up" },
          { label: "Despesas", value: `R$ ${totalDespesas.toLocaleString()}`, change: "+0%", icon: CreditCard, color: "bg-destructive/10 text-destructive", trend: "up" },
          { label: "Lucro Líquido", value: `R$ ${lucro.toLocaleString()}`, change: "+0%", icon: Wallet, color: "bg-primary/10 text-primary", trend: "up" },
          { label: "Reserva", value: "R$ 0", change: "+0%", icon: PiggyBank, color: "bg-warning/10 text-warning", trend: "up" },
        ]);
      }
    };

    carregarDados();
  }, []);

  return (
    <div className="mobile-container min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-hero-gradient px-6 pt-12 pb-8 rounded-b-[2rem]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <button 
            onClick={() => navigate('/dashboard/admin')}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white font-display">
              Dashboard Financeiro
            </h1>
            <p className="text-white/70 mt-1">Visão geral das finanças</p>
          </div>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          {summaryCards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs ${card.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                  {card.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {card.change}
                </div>
              </div>
              <p className="text-lg font-bold text-foreground font-display">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Revenue & Expenses Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <h2 className="text-lg font-semibold text-foreground font-display mb-4">
            Receita vs Despesas - 12 Meses
          </h2>
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorReceitaFin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDespesasFin" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="receita" stroke="hsl(142, 76%, 36%)" fill="url(#colorReceitaFin)" name="Receita" />
                <Area type="monotone" dataKey="despesas" stroke="hsl(0, 84%, 60%)" fill="url(#colorDespesasFin)" name="Despesas" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-xs text-muted-foreground">Receita</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <span className="text-xs text-muted-foreground">Despesas</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profit Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6"
        >
          <h2 className="text-lg font-semibold text-foreground font-display mb-4">
            Evolução do Lucro
          </h2>
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(215, 20%, 50%)" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(215, 20%, 50%)" tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toLocaleString()}`, 'Lucro']}
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid hsl(214, 32%, 91%)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line type="monotone" dataKey="lucro" stroke="hsl(213, 90%, 35%)" strokeWidth={3} dot={{ fill: 'hsl(213, 90%, 35%)', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Yearly Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <h2 className="text-lg font-semibold text-foreground font-display mb-4">
            Comparativo Anual - 6 Anos
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

        {/* Expense Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6"
        >
          <h2 className="text-lg font-semibold text-foreground font-display mb-4">
            Distribuição de Despesas
          </h2>
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <div className="flex items-center">
              <ResponsiveContainer width="50%" height={150}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {expenseBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      R$ {(item.value / 1000).toFixed(0)}k
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Revenue Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <h2 className="text-lg font-semibold text-foreground font-display mb-4">
            Fontes de Receita
          </h2>
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <div className="space-y-3">
              {revenueBySource.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{item.name}</span>
                    <span className="text-sm font-medium text-foreground">
                      R$ {(item.value / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: item.value > 0 ? `${(item.value / 918000) * 100}%` : '0%',
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-6"
        >
          <h2 className="text-lg font-semibold text-foreground font-display mb-4">
            Transações Recentes
          </h2>
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'
                  }`}>
                    {tx.type === 'income' ? 
                      <TrendingUp className="w-5 h-5 text-success" /> : 
                      <TrendingDown className="w-5 h-5 text-destructive" />
                    }
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <span className={`font-semibold ${tx.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                    {tx.type === 'income' ? '+' : ''}R$ {Math.abs(tx.value).toLocaleString()}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma transação encontrada
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminFinanceiro;
