import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HelpCircle, LogOut, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useInvestments } from "@/hooks/useInvestments";
import { useToast } from "@/hooks/use-toast";
import { useNaviAPY } from "@/hooks/useNaviAPY";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LanguageSelector from "@/components/LanguageSelector";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { signOut } = useAuth();
  const { investments, totalInvestment, totalReturns, deleteAllInvestments } = useInvestments();
  const { toast } = useToast();
  const { userAPY, naviAPY, managementFee, isLoading: apyLoading } = useNaviAPY();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleReset = async () => {
    try {
      console.log('Starting reset...');
      await deleteAllInvestments();
      console.log('Reset successful');
      toast({
        title: "Reset Complete",
        description: "All investments have been cleared.",
      });
    } catch (error) {
      console.error('Reset error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset investments.",
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
    const progressPercent = Math.min(100, Math.max(2, (daysPassed / inv.investment_days) * 100));
    
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
                  <AlertDialogDescription className="space-y-3">
                    <p>This will permanently delete all your investments and history. This action cannot be undone.</p>
                    <p className="text-destructive font-bold text-base border-2 border-destructive rounded-md p-3 bg-destructive/10">
                      ⚠️ WARNING: do NOT use this function unless strictly authorized by the admin.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
                    Reset
                  </AlertDialogAction>
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
              <h3 className="text-4xl font-bold">￥{Math.ceil(totalInvestment)}</h3>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">{t('dashboard.returns')}</p>
              <h3 className="text-4xl font-bold">￥{Math.ceil(totalReturns)}</h3>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('dashboard.investment')}</span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-primary/10"
                  >
                    <HelpCircle className="w-4 h-4 text-primary" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{t('dashboard.returnsDialogTitle')}</DialogTitle>
                    <DialogDescription className="sr-only">
                      {t('dashboard.returnsDialogDescription')}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    {apyLoading ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">{t('dashboard.loadingAPY')}</p>
                      </div>
                    ) : userAPY !== null ? (
                      <>
                        <div className="text-center space-y-2 py-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20 relative">
                          <p className="text-sm text-muted-foreground uppercase tracking-wide">{t('dashboard.apyTitle')}</p>
                          <div className="relative inline-block">
                            <p className="text-6xl font-bold text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                              {userAPY.toFixed(2)}%
                            </p>
                            <div className="absolute -top-2 -right-16 animate-[bounce_2s_ease-in-out_infinite]">
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 blur-md opacity-75 animate-pulse"></div>
                                <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg whitespace-nowrap animate-[scale-in_0.5s_ease-out]">
                                  {((userAPY - 0.5) / 0.5 * 100).toFixed(0)}% {t('dashboard.higherThanBoJ')}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4 px-2">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">{t('dashboard.feeStructure')}</h4>
                            <p className="text-sm leading-relaxed">
                              {t('dashboard.feeDescription')}
                              {naviAPY && managementFee && (
                                <span className="block mt-2 text-muted-foreground">
                                  {t('dashboard.feeExample')} {naviAPY.toFixed(2)}% - {t('dashboard.managementFee')} {managementFee.toFixed(2)}% = {t('dashboard.yourAPY')} {userAPY.toFixed(2)}%
                                </span>
                              )}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">{t('dashboard.dynamicRate')}</h4>
                            <p className="text-sm leading-relaxed">
                              {t('dashboard.dynamicRateDescription')}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-destructive">{t('dashboard.apyError')}</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {sortedInvestments.length > 0 ? (
              <div className="space-y-4">
                {sortedInvestments.map((inv) => (
                  <div key={inv.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-success font-semibold">
                          {inv.remainingDays} {t('dashboard.days')}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {t('dashboard.until')} <span className="text-accent">{inv.product_name}</span>
                        </span>
                      </div>
                      {inv.status === 'pending' && (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30">
                          {t('dashboard.pending')}
                        </span>
                      )}
                    </div>
                    <Progress value={inv.progressPercent} className="h-2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4">
                <p className="text-sm text-muted-foreground text-center">
                  {t('dashboard.noInvestments')}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/pick-purchase')}
            variant="secondary" 
            className="w-full h-12 text-base font-medium"
          >
            {t('dashboard.startInvesting')}
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium"
          >
            {t('dashboard.withdraw')}
          </Button>
          
          <Button 
            onClick={() => navigate('/risk-mitigation')}
            variant="secondary" 
            className="w-full h-12 text-base font-medium"
          >
            {t('dashboard.riskMitigation')}
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium"
          >
            {t('dashboard.legal')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;