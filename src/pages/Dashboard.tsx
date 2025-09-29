import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useInvestments } from "@/hooks/useInvestments";
import LanguageSelector from "@/components/LanguageSelector";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { signOut } = useAuth();
  const { investments, totalInvestment } = useInvestments();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const latestInvestment = investments[0];

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header with Language Selector and Logout */}
        <div className="flex justify-between items-center">
          <LanguageSelector />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-lg font-medium">
            {t('dashboard.title1')}
          </h1>
          <h2 className="text-lg font-medium">
            {t('dashboard.title2')} <span className="text-accent">{t('dashboard.title2.money')}</span> {t('dashboard.title2.rest')}
          </h2>
        </div>

        {/* Balance Card */}
        <Card className="bg-card border-border p-6 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">{t('dashboard.withdrawable')}</p>
            <h3 className="text-4xl font-bold">$ {totalInvestment.toFixed(2)}</h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('dashboard.investment')}</span>
              <HelpCircle className="w-4 h-4 text-primary" />
            </div>
            
            {latestInvestment ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-success font-semibold">
                    {latestInvestment.investment_days} {t('dashboard.days')}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t('dashboard.until')} <span className="text-accent">{latestInvestment.product_name}</span>
                  </span>
                </div>
                <Progress value={5} className="h-2" />
              </div>
            ) : (
              <div className="py-4">
                <p className="text-sm text-muted-foreground text-center">
                  No ongoing investment. Select a desirable good to start having your money work for you.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium"
          >
            {t('dashboard.withdraw')}
          </Button>
          
          <Button 
            onClick={() => navigate('/pick-purchase')}
            variant="secondary" 
            className="w-full h-12 text-base font-medium"
          >
            {t('dashboard.addPurchases')}
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium"
          >
            {t('dashboard.privacy')}
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium"
          >
            {t('dashboard.userAgreement')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;