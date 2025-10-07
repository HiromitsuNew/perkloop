import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HelpCircle, LogOut, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useInvestments } from "@/hooks/useInvestments";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LanguageSelector from "@/components/LanguageSelector";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { signOut } = useAuth();
  const { investments, totalInvestment, deleteAllInvestments } = useInvestments();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleReset = async () => {
    try {
      await deleteAllInvestments();
      toast({
        title: "Reset Complete",
        description: "All investments have been cleared.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset investments.",
        variant: "destructive",
      });
    }
  };

  // Calculate progress and remaining days for each investment
  const investmentsWithProgress = investments.map(inv => {
    const createdDate = new Date(inv.created_at);
    const now = new Date();
    const daysPassed = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, inv.investment_days - daysPassed);
    const progressPercent = Math.min(100, (daysPassed / inv.investment_days) * 100);
    
    return {
      ...inv,
      daysPassed,
      remainingDays,
      progressPercent,
    };
  });

  // Sort by remaining days (ascending - least time remaining shows first)
  const sortedInvestments = [...investmentsWithProgress].sort((a, b) => a.remainingDays - b.remainingDays);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header with Language Selector and Actions */}
        <div className="flex justify-between items-center">
          <LanguageSelector />
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset All Investments?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your investments and history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
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
          <div className="flex justify-around gap-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">{t('dashboard.withdrawable')}</p>
              <h3 className="text-4xl font-bold">$ {Math.ceil(totalInvestment)}</h3>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Returns</p>
              <h3 className="text-4xl font-bold">$ 0</h3>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('dashboard.investment')}</span>
              <HelpCircle className="w-4 h-4 text-primary" />
            </div>
            
            {sortedInvestments.length > 0 ? (
              <div className="space-y-4">
                {sortedInvestments.map((inv) => (
                  <div key={inv.id} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-success font-semibold">
                        {inv.remainingDays} {t('dashboard.days')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {t('dashboard.until')} <span className="text-accent">{inv.product_name}</span>
                      </span>
                    </div>
                    <Progress value={inv.progressPercent} className="h-2" />
                  </div>
                ))}
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