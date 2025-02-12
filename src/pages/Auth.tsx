
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Shield } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isResetPassword = location.pathname === "/auth/reset-password";

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !isResetPassword) {
        navigate("/");
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" && !isResetPassword) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, isResetPassword]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A192F] relative overflow-hidden auth-pattern">
      {/* Background overlay with gradient and crime pattern */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: '0.15',
          filter: 'blur(3px)'
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
          {isResetPassword ? <ResetPasswordForm /> : <AuthForm />}
        </div>
      </div>
    </div>
  );
};

export default Auth;
