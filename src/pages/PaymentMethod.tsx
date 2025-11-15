import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Monitor, Coffee, Egg, Milk, Container, Beer, Wheat, Cigarette } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const PaymentMethod = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  
  // Get the deposit details from the previous page
  const { 
    depositAmount, 
    investmentDays,
    timeString, 
    sliderValue,
    product,
    price,
    icon
  } = location.state || {};
  
  // Redirect to decide-deposit if no state
  if (!product || !depositAmount || !investmentDays) {
    navigate('/pick-purchase');
    return null;
  }
  
  // Get icon and product name
  const getIconComponent = () => {
    switch(icon) {
      case 'Coffee': return Coffee;
      case 'Monitor': return Monitor;
      case 'Egg': return Egg;
      case 'Milk': return Milk;
      case 'Container': return Container;
      case 'Beer': return Beer;
      case 'Wheat': return Wheat;
      case 'Cigarette': return Cigarette;
      default: return Monitor;
    }
  };
  const IconComponent = getIconComponent();
  const productName = product.charAt(0).toUpperCase() + product.slice(1);
  const selectedProduct = productName;

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
            onClick={() => navigate('/decide-deposit', { 
              state: { 
                product,
                price,
                icon,
                depositAmount,
                investmentDays,
                timeString,
                sliderValue
              } 
            })}
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
            <IconComponent className="w-8 h-8 mx-auto text-foreground" />
            <div>
              <p className="font-medium">{productName}</p>
              <p className="text-sm text-muted-foreground">￥{price.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={sliderValue} className="h-2" />
        </div>

        {/* Summary */}
        <div className="text-center space-y-2">
          {language === 'ja' ? (
            <p className="text-sm">
              {t('paymentMethod.today')}￥{Math.ceil(depositAmount).toLocaleString()}を預けて{timeString}{t('paymentMethod.free')}の{productName}を1つ手に入れる
            </p>
          ) : (
            <>
              <p className="text-sm">
                {t('paymentMethod.get')} <span className="text-accent">"{t('paymentMethod.free')}"</span> {productName} {timeString} {t('paymentMethod.by')}
              </p>
              <p className="text-sm">
                {t('paymentMethod.depositing')} <span className="text-accent">￥{Math.ceil(depositAmount).toLocaleString()}</span> {t('paymentMethod.today')}
              </p>
            </>
          )}
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