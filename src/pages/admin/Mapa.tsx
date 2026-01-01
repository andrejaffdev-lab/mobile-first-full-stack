import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Wrench, Building2, MapPin, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

type FilterType = "todos" | "clientes" | "prestadores" | "vidracarias";

interface MarkerData {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  type: "cliente" | "prestador" | "vidracaria";
  qualifications?: number;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN || '';

const AdminMapa = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [markers, setMarkers] = useState<{
    clientes: MarkerData[];
    prestadores: MarkerData[];
    vidracarias: MarkerData[];
  }>({ clientes: [], prestadores: [], vidracarias: [] });
  const [counts, setCounts] = useState({ total: 0, clientes: 0, prestadores: 0, vidracarias: 0 });
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    const carregarDados = async () => {
      const [clientesRes, prestadoresRes, vidracariasRes] = await Promise.all([
        supabase.from('clientes').select('id, nome, cidade, estado, latitude, longitude'),
        supabase.from('prestadores_servico').select('id, nome, cidade, estado, latitude, longitude, qualificacoes'),
        supabase.from('vidracarias').select('id, razao_social, nome_fantasia, cidade, estado, latitude, longitude'),
      ]);

      const clientesData: MarkerData[] = (clientesRes.data || [])
        .filter(c => c.latitude && c.longitude)
        .map(c => ({
          id: c.id,
          name: c.nome,
          location: `${c.cidade || ''}, ${c.estado || ''}`,
          lat: Number(c.latitude),
          lng: Number(c.longitude),
          type: "cliente" as const
        }));

      const prestadoresData: MarkerData[] = (prestadoresRes.data || [])
        .filter(p => p.latitude && p.longitude)
        .map(p => ({
          id: p.id,
          name: p.nome,
          location: `${p.cidade || ''}, ${p.estado || ''}`,
          lat: Number(p.latitude),
          lng: Number(p.longitude),
          type: "prestador" as const,
          qualifications: p.qualificacoes?.length || 0
        }));

      const vidracariasData: MarkerData[] = (vidracariasRes.data || [])
        .filter(v => v.latitude && v.longitude)
        .map(v => ({
          id: v.id,
          name: v.nome_fantasia || v.razao_social,
          location: `${v.cidade || ''}, ${v.estado || ''}`,
          lat: Number(v.latitude),
          lng: Number(v.longitude),
          type: "vidracaria" as const
        }));

      setMarkers({
        clientes: clientesData,
        prestadores: prestadoresData,
        vidracarias: vidracariasData
      });

      setCounts({
        total: clientesData.length + prestadoresData.length + vidracariasData.length,
        clientes: clientesRes.count || clientesData.length,
        prestadores: prestadoresRes.count || prestadoresData.length,
        vidracarias: vidracariasRes.count || vidracariasData.length
      });
    };

    carregarDados();
  }, []);

  const filters: { id: FilterType; label: string; icon: React.ElementType; color: string; count: number }[] = [
    { id: "todos", label: "Todos", icon: MapPin, color: "bg-muted text-foreground", count: counts.total },
    { id: "clientes", label: "Clientes", icon: Users, color: "bg-primary/10 text-primary", count: counts.clientes },
    { id: "prestadores", label: "Prestadores", icon: Wrench, color: "bg-success/10 text-success", count: counts.prestadores },
    { id: "vidracarias", label: "Vidraçarias", icon: Building2, color: "bg-warning/10 text-warning", count: counts.vidracarias },
  ];

  const getFilteredMarkers = () => {
    if (activeFilter === "todos") {
      return [
        ...markers.clientes,
        ...markers.prestadores,
        ...markers.vidracarias,
      ];
    }
    if (activeFilter === "clientes") {
      return markers.clientes;
    }
    if (activeFilter === "prestadores") {
      return markers.prestadores;
    }
    return markers.vidracarias;
  };

  const filteredMarkers = getFilteredMarkers().filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMarkerColor = (type: string) => {
    switch (type) {
      case "cliente": return "#1e40af";
      case "prestador": return "#16a34a";
      case "vidracaria": return "#d97706";
      default: return "#6b7280";
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

  const regions = [
    { name: "Sudeste", coverage: 0, color: "bg-muted" },
    { name: "Sul", coverage: 0, color: "bg-muted" },
    { name: "Nordeste", coverage: 0, color: "bg-muted" },
    { name: "Centro-Oeste", coverage: 0, color: "bg-muted" },
    { name: "Norte", coverage: 0, color: "bg-muted" },
  ];

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-47.9, -15.8],
      zoom: 3.5,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: false }),
      'top-right'
    );

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update markers when filter or search changes
  useEffect(() => {
    if (!map.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    filteredMarkers.forEach((markerData) => {
      const el = document.createElement('div');
      el.className = 'mapbox-marker';
      el.style.cssText = `
        width: 32px;
        height: 32px;
        background-color: ${getMarkerColor(markerData.type)};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px; font-family: system-ui, sans-serif;">
          <strong style="font-size: 14px;">${markerData.name}</strong>
          <p style="margin: 4px 0 0; color: #666; font-size: 12px;">${markerData.location}</p>
          ${markerData.qualifications ? `<p style="margin: 4px 0 0; color: #16a34a; font-size: 11px;">${markerData.qualifications} qualificações</p>` : ''}
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([markerData.lng, markerData.lat])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [filteredMarkers, activeFilter, searchQuery]);

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

        {/* Mapbox Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {MAPBOX_TOKEN ? (
              <div className="relative">
                <div ref={mapContainer} className="h-72 w-full" />
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
            ) : (
              <div className="h-72 flex items-center justify-center bg-muted/50">
                <p className="text-muted-foreground text-center px-4">
                  Token do Mapbox não configurado.<br />
                  <span className="text-sm">Configure VITE_MAPBOX_PUBLIC_TOKEN nas variáveis de ambiente.</span>
                </p>
              </div>
            )}
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
                    region.coverage >= 30 ? 'text-warning' : 'text-muted-foreground'
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
                  {marker.qualifications && (
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                      {marker.qualifications} qualif.
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
          
          {filteredMarkers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum registro encontrado com coordenadas
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminMapa;
