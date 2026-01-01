import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const RequireAdmin = () => {
  const location = useLocation();
  const { user, session, loading: authLoading } = useAuth();
  const [state, setState] = useState<"loading" | "allowed" | "denied">("loading");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setState("denied");
      return;
    }

    let active = true;

    const checkAdmin = async () => {
      const { data: isAdmin, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });

      if (!active) return;

      if (error) {
        console.error("Erro ao verificar permissões:", error);
        toast.error("Erro ao verificar permissões");
        setState("denied");
        return;
      }

      if (!isAdmin) {
        toast.error("Você não tem permissão para acessar o Admin");
        setState("denied");
        return;
      }

      setState("allowed");
    };

    checkAdmin();

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  if (authLoading || state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (state === "denied") {
    return <Navigate to="/select-profile" replace />;
  }

  return <Outlet />;
};

export default RequireAdmin;
