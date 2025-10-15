import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        toast({
          title: t('auth.error'),
          description: error.message,
          variant: "destructive",
        });
      } else {
        if (isLogin) {
          navigate('/');
        } else {
          toast({
            title: t('auth.success'),
            description: t('auth.confirmEmail'),
          });
        }
      }
    } catch (error: any) {
      toast({
        title: t('auth.error'), 
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="absolute top-6 right-6">
        <LanguageSelector />
      </div>
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">
            {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? t('auth.signInSubtitle') : t('auth.signUpSubtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('auth.enterEmail')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t('auth.enterPassword')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? t('auth.loading') : (isLogin ? t('auth.signIn') : t('auth.signUp'))}
          </Button>
        </form>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm"
          >
            {isLogin 
              ? t('auth.noAccount')
              : t('auth.haveAccount')}
          </Button>
        </div>

        {/* Test Account Info */}
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">{t('auth.testAccount')}</p>
          <p className="text-xs font-mono">test@perkloop.io</p>
          <p className="text-xs font-mono">123456</p>
        </div>
      </Card>
    </div>
  );
};

export default Auth;