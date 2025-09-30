import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInvestments } from "@/hooks/useInvestments";
import { useToast } from "@/hooks/use-toast";
import LanguageSelector from "@/components/LanguageSelector";

const PaymentProcess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { createInvestment } = useInvestments();
  const { toast } = useToast();
  
  const { paymentMethod, depositAmount, selectedProduct, investmentDays } = location.state || {};

  const handleFinishPayment = async () => {
    try {
      if (depositAmount && selectedProduct && investmentDays && paymentMethod) {
        await createInvestment({
          product_name: selectedProduct,
          deposit_amount: parseFloat(depositAmount),
          investment_days: parseInt(investmentDays),
          payment_method: paymentMethod,
        });
        
        toast({
          title: "Investment Created!",
          description: `Your ${selectedProduct} investment has been created successfully.`,
        });
      }
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create investment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderContent = () => {
    if (paymentMethod === 'stablecoin') {
      return (
        <div className="text-center space-y-4">
          <p className="text-base">
            {t('paymentProcess.sendUsdc')} {depositAmount?.toFixed(2)} {t('paymentProcess.usdcAmount')}
          </p>
          <Card className="bg-card border-border p-4">
            <p className="font-mono text-sm break-all text-foreground">
              0x47b38a66d0d05b8750e2d9359513c9f004c34cd9568ffeb4f686a95f14174c5f
            </p>
          </Card>
        </div>
      );
    }

    // For Bank Wire and Credit Card
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
            onClick={() => navigate('/payment-method')}
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
      </div>
    </div>
  );
};

export default PaymentProcess;