import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInvestments } from "@/hooks/useInvestments";
import { useToast } from "@/hooks/use-toast";
import LanguageSelector from "@/components/LanguageSelector";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PaymentProcess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { createInvestment, updateInvestment, investments } = useInvestments();
  const { toast } = useToast();
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [existingInvestment, setExistingInvestment] = useState<any>(null);
  
  const { paymentMethod, depositAmount, selectedProduct, investmentDays, justSave } = location.state || {};

  // Redirect if no state
  if (!paymentMethod || !depositAmount || !selectedProduct || !investmentDays) {
    navigate('/pick-purchase');
    return null;
  }

  useEffect(() => {
    // Check for duplicate investment when component mounts (skip for justSave mode)
    if (!justSave && selectedProduct && investments.length > 0) {
      const existing = investments.find(inv => inv.product_name === selectedProduct);
      if (existing) {
        setExistingInvestment(existing);
        setShowDuplicateDialog(true);
      }
    }
  }, [selectedProduct, investments, justSave]);

  const handleCreateNewInvestment = async () => {
    try {
      if (depositAmount && selectedProduct && investmentDays && paymentMethod) {
        await createInvestment({
          product_name: selectedProduct,
          deposit_amount: parseFloat(depositAmount),
          investment_days: parseInt(investmentDays),
          payment_method: paymentMethod,
        });
        
        toast({
          title: t('paymentProcess.investmentCreated'),
          description: t('paymentProcess.investmentCreatedSuccess').replace('{product}', selectedProduct),
        });
      }
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: t('paymentProcess.error'),
        description: t('paymentProcess.createFailed'),
        variant: "destructive",
      });
    }
  };

  const handleUpdateExisting = async () => {
    const newAmount = parseFloat(depositAmount);
    const existingAmount = parseFloat(existingInvestment.deposit_amount);
    
    try {
      if (newAmount > existingAmount) {
        await updateInvestment(existingInvestment.id, {
          deposit_amount: newAmount,
          investment_days: parseInt(investmentDays),
        });
        
        const difference = Math.ceil(newAmount - existingAmount);
        toast({
          title: t('paymentProcess.investmentUpdated'),
          description: t('paymentProcess.addedToInvestment')
            .replace('{amount}', difference.toLocaleString())
            .replace('{product}', selectedProduct),
        });
      } else if (newAmount < existingAmount) {
        const difference = Math.ceil(existingAmount - newAmount);
        toast({
          title: t('paymentProcess.withdrawFunds'),
          description: t('paymentProcess.withdrawDescription')
            .replace('{amount}', difference.toLocaleString())
            .replace('{product}', selectedProduct),
        });
      } else {
        toast({
          title: t('paymentProcess.noChanges'),
          description: t('paymentProcess.noChangesDescription').replace('{product}', selectedProduct),
        });
      }
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: t('paymentProcess.error'),
        description: t('paymentProcess.updateFailed'),
        variant: "destructive",
      });
    }
  };

  const handleFinishPayment = async () => {
    if (existingInvestment) {
      setShowDuplicateDialog(true);
    } else {
      await handleCreateNewInvestment();
    }
  };

  const renderContent = () => {
    if (paymentMethod === 'stablecoin') {
      return (
        <div className="text-center space-y-4">
          <p className="text-base">
            {t('paymentProcess.sendUsdc')} ￥{Math.ceil(depositAmount).toLocaleString()} {t('paymentProcess.usdcAmount')}
          </p>
          <Card className="bg-card border-border p-4">
            <p className="font-mono text-sm break-all text-foreground">
              0x47b38a66d0d05b8750e2d9359513c9f004c34cd9568ffeb4f686a95f14174c5f
            </p>
          </Card>
        </div>
      );
    }

    if (paymentMethod === 'bank_wire') {
      return (
        <div className="text-center">
          <p className="text-base">{t('paymentProcess.contactBankWire')}</p>
        </div>
      );
    }

    if (paymentMethod === 'credit_card') {
      return (
        <div className="text-center">
          <p className="text-base">{t('paymentProcess.contactCreditCard')}</p>
        </div>
      );
    }

    return (
      <div className="text-center">
        <p className="text-base">{t('paymentProcess.featureAvailable')}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Language Selector */}
        <div className="flex justify-end">
          <LanguageSelector />
        </div>
        
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {renderContent()}
        </div>

        {/* Finish Payment Button */}
        <div className="pt-8">
        <Button 
          onClick={handleFinishPayment}
          variant="default" 
          className="w-full h-12 text-base font-medium"
        >
          {t('paymentProcess.finishPayment')}
        </Button>
        </div>

        <AlertDialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('paymentProcess.updateExisting')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('paymentProcess.duplicateDescription')
                  .replace('{product}', selectedProduct)
                  .replace('{amount}', Math.ceil(existingInvestment?.deposit_amount || 0).toLocaleString())}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => navigate('/dashboard')}>{t('paymentProcess.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleUpdateExisting}>{t('paymentProcess.update')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default PaymentProcess;