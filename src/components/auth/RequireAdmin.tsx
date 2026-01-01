import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const RequireAdmin = () => {
  const location = useLocation();
  const [state, setState] = useState<"loading" | "allowed" | "unauth" | "denied">("loading");

  useEffect(() => {
    let active = true;

    const check = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!active) return;

      if (!user) {
        setState("unauth");
        return;
      }

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

    check();

    return () => {
      active = false;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (state === "unauth") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (state === "denied") {
    return <Navigate to="/select-profile" replace />;
  }

  return <Outlet />;
};

export default RequireAdmin;
