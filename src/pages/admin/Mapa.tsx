import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Wrench, Building2, MapPin, Filter, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

type FilterType = "todos" | "clientes" | "prestadores" | "vidracarias";

const AdminMapa = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filters: { id: FilterType; label: string; icon: React.ElementType; color: string; count: number }[] = [
    { id: "todos", label: "Todos", icon: MapPin, color: "bg-muted text-foreground", count: 216 },
    { id: "clientes", label: "Clientes", icon: Users, color: "bg-primary/10 text-primary", count: 156 },
    { id: "prestadores", label: "Prestadores", icon: Wrench, color: "bg-success/10 text-success", count: 48 },
    { id: "vidracarias", label: "Vidraçarias", icon: Building2, color: "bg-warning/10 text-warning", count: 12 },
  ];

  // Mock data for map markers
  const markers = {
    clientes: [
      { id: 1, name: "Maria Silva", location: "São Paulo, SP", lat: -23.55, lng: -46.63 },
      { id: 2, name: "João Santos", location: "Rio de Janeiro, RJ", lat: -22.91, lng: -43.17 },
      { id: 3, name: "Ana Costa", location: "Belo Horizonte, MG", lat: -19.92, lng: -43.94 },
      { id: 4, name: "Pedro Oliveira", location: "Curitiba, PR", lat: -25.43, lng: -49.27 },
      { id: 5, name: "Carla Souza", location: "Porto Alegre, RS", lat: -30.03, lng: -51.23 },
    ],
    prestadores: [
      { id: 1, name: "Ricardo Montador", location: "São Paulo, SP", lat: -23.56, lng: -46.65, qualifications: 5 },
      { id: 2, name: "Fernando Silva", location: "Campinas, SP", lat: -22.91, lng: -47.06, qualifications: 4 },
      { id: 3, name: "Carlos Lima", location: "Salvador, BA", lat: -12.97, lng: -38.50, qualifications: 3 },
      { id: 4, name: "Marcos Alves", location: "Fortaleza, CE", lat: -3.73, lng: -38.52, qualifications: 6 },
      { id: 5, name: "José Pereira", location: "Recife, PE", lat: -8.05, lng: -34.90, qualifications: 4 },
    ],
    vidracarias: [
      { id: 1, name: "Vidraçaria Central", location: "São Paulo, SP", lat: -23.54, lng: -46.64 },
      { id: 2, name: "Glass Premium", location: "Belo Horizonte, MG", lat: -19.93, lng: -43.93 },
      { id: 3, name: "Vidros & Cia", location: "Brasília, DF", lat: -15.79, lng: -47.88 },
      { id: 4, name: "Box Master", location: "Goiânia, GO", lat: -16.68, lng: -49.25 },
    ],
  };

  const getFilteredMarkers = () => {
    if (activeFilter === "todos") {
      return [
        ...markers.clientes.map(m => ({ ...m, type: "cliente" as const })),
        ...markers.prestadores.map(m => ({ ...m, type: "prestador" as const })),
        ...markers.vidracarias.map(m => ({ ...m, type: "vidracaria" as const })),
      ];
    }
    if (activeFilter === "clientes") {
      return markers.clientes.map(m => ({ ...m, type: "cliente" as const }));
    }
    if (activeFilter === "prestadores") {
      return markers.prestadores.map(m => ({ ...m, type: "prestador" as const }));
    }
    return markers.vidracarias.map(m => ({ ...m, type: "vidracaria" as const }));
  };

  const filteredMarkers = getFilteredMarkers().filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMarkerColor = (type: string) => {
    switch (type) {
      case "cliente": return "bg-primary";
      case "prestador": return "bg-success";
      case "vidracaria": return "bg-warning";
      default: return "bg-muted";
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case "cliente": return Users;
      case "prestador": return Wrench;
      case "vidracaria": return Building2;
      default: return MapPin;
    }
  };

  // Brazil regions for coverage visualization
  const regions = [
    { name: "Sudeste", coverage: 85, color: "bg-success" },
    { name: "Sul", coverage: 72, color: "bg-success" },
    { name: "Nordeste", coverage: 45, color: "bg-warning" },
    { name: "Centro-Oeste", coverage: 38, color: "bg-warning" },
    { name: "Norte", coverage: 15, color: "bg-destructive" },
  ];

  return (
    <div className="mobile-container min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-hero-gradient px-6 pt-12 pb-6 rounded-b-[2rem]">
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
              Mapa de Cobertura
            </h1>
            <p className="text-white/70 mt-1">Visualize a distribuição</p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou cidade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-10 bg-white/95 border-0 h-12 rounded-xl"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </motion.div>
      </div>

      <div className="px-6 -mt-4">
        {/* Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeFilter === filter.id 
                  ? "bg-primary text-white shadow-lg" 
                  : "bg-white text-foreground shadow-card"
              }`}
            >
              <filter.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{filter.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeFilter === filter.id ? "bg-white/20" : "bg-muted"
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Map Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {/* Stylized Map of Brazil */}
            <div className="relative h-72 bg-gradient-to-br from-primary/5 to-accent/5 p-4">
              <svg viewBox="0 0 400 350" className="w-full h-full">
                {/* Simplified Brazil Map Outline */}
                <path
                  d="M120,30 L180,20 L250,25 L320,50 L350,100 L370,150 L380,200 L370,250 L340,290 L280,320 L220,330 L160,320 L120,280 L80,220 L70,160 L80,100 L100,50 Z"
                  fill="hsl(210, 30%, 95%)"
                  stroke="hsl(214, 32%, 85%)"
                  strokeWidth="2"
                />
                
                {/* Region divisions */}
                <path d="M280,120 L350,100" stroke="hsl(214, 32%, 85%)" strokeWidth="1" strokeDasharray="4"/>
                <path d="M220,180 L280,120" stroke="hsl(214, 32%, 85%)" strokeWidth="1" strokeDasharray="4"/>
                <path d="M160,200 L220,180" stroke="hsl(214, 32%, 85%)" strokeWidth="1" strokeDasharray="4"/>
                <path d="M160,200 L120,280" stroke="hsl(214, 32%, 85%)" strokeWidth="1" strokeDasharray="4"/>
                
                {/* Markers */}
                {filteredMarkers.slice(0, 10).map((marker, index) => {
                  // Convert lat/lng to SVG coordinates (simplified)
                  const x = 200 + (marker.lng + 50) * 3;
                  const y = 180 + (marker.lat + 20) * 3;
                  const Icon = getMarkerIcon(marker.type);
                  
                  return (
                    <g key={`${marker.type}-${marker.id}`}>
                      <motion.circle
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        cx={x}
                        cy={y}
                        r="12"
                        className={`${getMarkerColor(marker.type)} opacity-20`}
                        fill="currentColor"
                      />
                      <motion.circle
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        cx={x}
                        cy={y}
                        r="6"
                        className={getMarkerColor(marker.type)}
                        fill="currentColor"
                      />
                    </g>
                  );
                })}
              </svg>
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-md">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span>Clientes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                    <span>Prestadores</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <span>Vidraçarias</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Coverage by Region */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6"
        >
          <h2 className="text-lg font-semibold text-foreground font-display mb-4">
            Cobertura por Região
          </h2>
          <div className="bg-white rounded-2xl p-4 shadow-card space-y-4">
            {regions.map((region, index) => (
              <div key={region.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">{region.name}</span>
                  <span className={`text-sm font-medium ${
                    region.coverage >= 70 ? 'text-success' :
                    region.coverage >= 30 ? 'text-warning' : 'text-destructive'
                  }`}>
                    {region.coverage}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${region.coverage}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    className={`h-full rounded-full ${region.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* List of markers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground font-display">
              {activeFilter === "todos" ? "Todos os Cadastros" : 
               activeFilter === "clientes" ? "Clientes" :
               activeFilter === "prestadores" ? "Prestadores" : "Vidraçarias"}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredMarkers.length} encontrados
            </span>
          </div>
          
          <div className="space-y-3">
            {filteredMarkers.slice(0, 8).map((marker, index) => {
              const Icon = getMarkerIcon(marker.type);
              return (
                <motion.div
                  key={`${marker.type}-${marker.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    marker.type === "cliente" ? "bg-primary/10" :
                    marker.type === "prestador" ? "bg-success/10" : "bg-warning/10"
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      marker.type === "cliente" ? "text-primary" :
                      marker.type === "prestador" ? "text-success" : "text-warning"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{marker.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {marker.location}
                    </div>
                  </div>
                  {"qualifications" in marker && (
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                      {marker.qualifications} qualif.
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Alert for sparse regions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4">
            <h3 className="font-semibold text-destructive mb-2">Regiões com Baixa Cobertura</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Estas regiões precisam de mais prestadores para garantir atendimento completo:
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-white px-3 py-1 rounded-full text-foreground">Manaus, AM</span>
              <span className="text-xs bg-white px-3 py-1 rounded-full text-foreground">Belém, PA</span>
              <span className="text-xs bg-white px-3 py-1 rounded-full text-foreground">Palmas, TO</span>
              <span className="text-xs bg-white px-3 py-1 rounded-full text-foreground">Rio Branco, AC</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminMapa;
