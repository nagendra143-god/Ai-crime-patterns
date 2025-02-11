
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Shield } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A192F] relative overflow-hidden">
      {/* Background overlay with gradient and image */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90"
        style={{
          backgroundImage: `url("/placeholder.svg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: '0.15'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Crime Pattern Detection
          </h1>
          <p className="text-muted-foreground">
            Secure access to crime analysis system
          </p>
        </div>
        <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-accent p-6 shadow-xl">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Auth;
