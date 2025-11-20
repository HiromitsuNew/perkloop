import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HelpCircle, LogOut, RotateCcw, Lightbulb, ArrowRight, ArrowLeft, DollarSign, TrendingUp, Shield, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useInvestments } from "@/hooks/useInvestments";
import { useToast } from "@/hooks/use-toast";
import { useNaviAPY } from "@/hooks/useNaviAPY";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  const { signOut, user } = useAuth();
  const { investments, deleteAllInvestments } = useInvestments();
  const { toast } = useToast();
  const { userAPY, naviAPY, managementFee, isLoading: apyLoading } = useNaviAPY();
  
  const [withdrawalPrincipal, setWithdrawalPrincipal] = useState(0);
  const [jpyDeposit, setJpyDeposit] = useState(0);
  const [totalReturns, setTotalReturns] = useState(0);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('withdrawal_principal_usd, jpy_deposit, total_returns')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        setWithdrawalPrincipal(Number(data.withdrawal_principal_usd) || 0);
        setJpyDeposit(Number(data.jpy_deposit) || 0);
        setTotalReturns(Number(data.total_returns) || 0);
      }
    };
    
    fetchUserProfile();
  }, [user]);

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

  // Calculate progress and remaining days for each investment (with looping)
  const investmentsWithProgress = investments.map(inv => {
    const createdDate = new Date(inv.created_at);
    const now = new Date();
    const daysPassed = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Loop the progress: when it reaches investment_days, it resets to 0
    const daysInCurrentCycle = daysPassed % inv.investment_days;
    const remainingDays = inv.investment_days - daysInCurrentCycle;
    const progressPercent = Math.max(2, (daysInCurrentCycle / inv.investment_days) * 100);
    
    return {
      ...inv,
      daysPassed,
      remainingDays,
      progressPercent,
    };
  });

  // Sort by remaining days (ascending - least time remaining shows first)
  const sortedInvestments = [...investmentsWithProgress].sort((a, b) => a.remainingDays - b.remainingDays);

  // Function to translate product names
  const getTranslatedProductName = (productName: string) => {
    const nameMap: { [key: string]: string } = {
      'Coffee': 'pickPurchase.coffee',
      'Coffee (Regular)': 'pickPurchase.coffee',
      'Yogurt': 'pickPurchase.yogurt',
      'Eggs': 'pickPurchase.eggs',
      'Eggs (10 units)': 'pickPurchase.eggs',
      'Milk': 'pickPurchase.milk',
      'Beer': 'pickPurchase.beer',
      'Beer (6 cans)': 'pickPurchase.beer',
      'Rice': 'pickPurchase.rice',
      'Rice (2 kg)': 'pickPurchase.rice',
      'Cigarette': 'pickPurchase.cigarette',
    };
    
    const translationKey = nameMap[productName];
    return translationKey ? t(translationKey) : productName;
  };

  const handleNextPage = () => {
    if (currentPage < 4) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleCloseHowItWorks = () => {
    setHowItWorksOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header with Language Selector and Actions */}
        <div className="flex justify-between items-center">
          <LanguageSelector />
          <div className="flex gap-2 items-center">
            {/* Launch Bonus Badge */}
            <div className="relative animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-md opacity-75"></div>
              <div className="relative bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                🎉 Launch Bonus Active
              </div>
            </div>
            
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
                  <AlertDialogTitle>{t('dashboard.resetTitle')}</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-3">
                    <p>{t('dashboard.resetDescription')}</p>
                    <p className="text-destructive font-bold text-base border-2 border-destructive rounded-md p-3 bg-destructive/10">
                      {t('dashboard.resetWarning')}
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('dashboard.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
                    {t('dashboard.reset')}
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
              <h3 className="text-4xl font-bold">${withdrawalPrincipal.toFixed(2)}</h3>
              <p className="text-xs text-muted-foreground">{t('dashboard.byDeposit')} ￥{jpyDeposit.toFixed(0)}</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">{t('dashboard.returns')}</p>
              <h3 className="text-4xl font-bold">${totalReturns.toFixed(2)}</h3>
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
                            </p>
                            <div className="mt-3 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                              <p className="text-sm font-semibold text-primary">
                                🎉 {t('dashboard.launchBonusActive')}
                              </p>
                            </div>
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
                {sortedInvestments.map((inv) => {
                  // Check if this is a Just Save investment
                  const isJustSave = inv.product_name === "Just Save";
                  
                  if (isJustSave) {
                    // Just Save Mode Display
                    return (
                      <div key={inv.id} className="space-y-2 p-4 bg-accent/10 rounded-lg border border-accent/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Coins className="w-6 h-6 text-accent" />
                            <div>
                              <p className="font-medium">{t('dashboard.justSaveMode')}</p>
                              <p className="text-xs text-muted-foreground">{t('dashboard.justSaveDescription')}</p>
                            </div>
                          </div>
                          {inv.status === 'pending' && (
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30">
                              {t('dashboard.pending')}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between text-sm pt-2">
                          <span className="text-muted-foreground">{t('paymentMethod.deposit')}</span>
                          <span className="font-medium">￥{Math.ceil(inv.deposit_amount).toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  }
                  
                  // Regular investment display
                  return (
                    <div key={inv.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-success font-semibold">
                            {t('dashboard.remaining')}{inv.remainingDays}{t('dashboard.days')}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {t('dashboard.until')} <span className="text-accent">{getTranslatedProductName(inv.product_name)}</span>
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
                  );
                })}
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
          {/* How It Works Button */}
          <Dialog open={howItWorksOpen} onOpenChange={setHowItWorksOpen}>
            <DialogTrigger asChild>
              <Button 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <Lightbulb className="w-5 h-5 mr-2" />
                {t('dashboard.howItWorksButton')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  {t('dashboard.howItWorksTitle')}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {t('dashboard.howItWorksDescription')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Page 1: JPY to USDC Conversion */}
                {currentPage === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-center">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-center">{t('dashboard.step1Title')}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t('dashboard.step1Description')} <span className="font-semibold text-foreground">{t('dashboard.step1Bold')}</span>{t('dashboard.step1Description2')}
                    </p>
                  </div>
                )}

                {/* Page 2: DeFi Lending */}
                {currentPage === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-center">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-center">{t('dashboard.step2Title')}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t('dashboard.step2Description')} <span className="font-semibold text-foreground">{t('dashboard.step2Bold')}</span> {t('dashboard.step2Description2')}
                    </p>
                  </div>
                )}

                {/* Page 3: Continuous Profit Generation */}
                {currentPage === 3 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                        <Coins className="w-10 h-10 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-center">{t('dashboard.step3Title')}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t('dashboard.step3Description')} <span className="font-semibold text-foreground">{t('dashboard.step3Bold')}</span>{t('dashboard.step3Description2')}
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                        <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400 mt-1.5 flex-shrink-0" />
                        <p className="text-sm">{t('dashboard.step3Point1')}</p>
                      </div>
                      <div className="flex items-start gap-3 bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                        <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400 mt-1.5 flex-shrink-0" />
                        <p className="text-sm">{t('dashboard.step3Point2')}</p>
                      </div>
                      <div className="flex items-start gap-3 bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                        <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400 mt-1.5 flex-shrink-0" />
                        <p className="text-sm">{t('dashboard.step3Point3')}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Page 4: Security */}
                {currentPage === 4 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                        <Shield className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-center">{t('dashboard.step4Title')}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed text-center">
                      {t('dashboard.step4Description')}
                    </p>
                  </div>
                )}

                {/* Page Indicator */}
                <div className="flex justify-center gap-2 pt-2">
                  {[1, 2, 3, 4].map((page) => (
                    <div
                      key={page}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        page === currentPage ? 'w-8 bg-primary' : 'w-2 bg-primary/30'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('dashboard.previous')}
                  </Button>
                  {currentPage === 4 ? (
                    <Button
                      onClick={handleCloseHowItWorks}
                      className="flex-1"
                    >
                      {t('dashboard.gotIt')}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextPage}
                      className="flex-1"
                    >
                      {t('dashboard.next')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={() => navigate('/pick-purchase')}
            variant="secondary" 
            className="w-full h-12 text-base font-medium"
          >
            {t('dashboard.startInvesting')}
          </Button>
          
          <Button 
            onClick={() => navigate('/withdraw')}
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