import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Language Selector */}
        <div className="flex justify-end">
          <LanguageSelector />
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
            <h3 className="text-4xl font-bold">$ 1531.02</h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('dashboard.investment')}</span>
              <HelpCircle className="w-4 h-4 text-primary" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-success font-semibold">23 {t('dashboard.days')}</span>
                <span className="text-sm text-muted-foreground">
                  {t('dashboard.until')} <span className="text-accent">{t('dashboard.starbucks')}</span>
                </span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
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