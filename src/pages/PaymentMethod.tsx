import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Monitor } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const PaymentMethod = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  // Get the deposit details from the previous page, with fallback values
  const { depositAmount = 3968.8, months = 1, timeString = "1 month", sliderValue = 100 } = location.state || {};
  
  // Set product info
  const selectedProduct = "Netflix";
  const investmentDays = months * 30; // Convert months to days

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
            onClick={() => navigate('/decide-deposit')}
            className="text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-medium">
              {t('paymentMethod.title1')}
            </h1>
            <h2 className="text-lg font-medium">
              {t('paymentMethod.title2')} <span className="text-accent">{t('paymentMethod.title2.money')}</span> {t('paymentMethod.title2.rest')}
            </h2>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-base font-medium">{t('paymentMethod.selectPayment')}</h3>
        </div>

        {/* Selected Item */}
        <Card className="bg-card border-border p-6">
          <div className="text-center space-y-3">
            <Monitor className="w-8 h-8 mx-auto text-foreground" />
            <div>
              <p className="font-medium">{t('paymentMethod.netflix')}</p>
              <p className="text-sm text-muted-foreground">USD 12.99</p>
            </div>
          </div>
        </Card>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={sliderValue} className="h-2" />
        </div>

        {/* Summary */}
        <div className="text-center space-y-2">
          <p className="text-sm">
            Get 1 <span className="text-accent">"free"</span> {t('paymentMethod.netflix')} in{" "}
            <span className="text-success">{timeString}</span> by
          </p>
          <p className="text-sm">
            depositing <span className="text-accent">USD {depositAmount.toFixed(2)}</span> today
          </p>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium justify-center"
            onClick={() => navigate('/payment-process', { 
              state: { 
                paymentMethod: 'bank_wire',
                depositAmount,
                selectedProduct,
                investmentDays
              } 
            })}
          >
            {t('paymentMethod.bankWire')}
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium justify-center"
            onClick={() => navigate('/payment-process', { 
              state: { 
                paymentMethod: 'stablecoin',
                depositAmount,
                selectedProduct,
                investmentDays
              } 
            })}
          >
            {t('paymentMethod.stablecoin')}
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium justify-center"
            onClick={() => navigate('/payment-process', { 
              state: { 
                paymentMethod: 'credit_card',
                depositAmount,
                selectedProduct,
                investmentDays
              } 
            })}
          >
            {t('paymentMethod.creditCard')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;