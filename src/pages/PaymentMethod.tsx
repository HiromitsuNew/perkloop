import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Monitor, Coffee, Egg, Milk, Container, Beer, Wheat, Cigarette, Coins } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const PaymentMethod = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  const [customAmount, setCustomAmount] = React.useState("");
  
  // Get the deposit details from the previous page
  const { 
    depositAmount, 
    investmentDays,
    timeString, 
    sliderValue,
    product,
    price,
    icon,
    justSave
  } = location.state || {};
  
  console.log('PaymentMethod state:', { justSave, depositAmount, product, customAmount });
  
  // For justSave mode, we don't need product details
  // For regular mode, redirect if no product
  useEffect(() => {
    if (!justSave && (!product || !depositAmount || !investmentDays)) {
      navigate('/pick-purchase');
    }
  }, [justSave, product, depositAmount, investmentDays, navigate]);
  
  // Get icon and product name (only for regular mode)
  const getIconComponent = () => {
    if (!icon) return null;
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
  const productName = product ? product.charAt(0).toUpperCase() + product.slice(1) : "Just Save";
  const selectedProduct = justSave ? "Just Save" : productName;

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
            onClick={() => navigate('/pick-purchase')}
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

        {justSave ? (
          // Just Save Mode
          <>
            <Card className="bg-card border-border p-6">
              <div className="text-center space-y-3">
                <Coins className="w-12 h-12 mx-auto text-accent" />
                <div>
                  <p className="font-medium text-lg">{t('paymentMethod.justSaveMode')}</p>
                  <p className="text-sm text-muted-foreground mt-2">{t('paymentMethod.justSaveDescription')}</p>
                </div>
              </div>
            </Card>

            {/* Custom Amount Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('paymentMethod.enterAmount')}</label>
              <Input
                type="text"
                inputMode="numeric"
                value={customAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  console.log('Input changed:', value);
                  setCustomAmount(value);
                }}
                placeholder="10000"
                className="text-base"
              />
              {customAmount && (
                <p className="text-sm text-muted-foreground">
                  ￥{parseFloat(customAmount).toLocaleString()}
                </p>
              )}
            </div>
          </>
        ) : (
          // Regular Item Mode
          <>
            <Card className="bg-card border-border p-6">
              <div className="text-center space-y-3">
                {IconComponent && <IconComponent className="w-8 h-8 mx-auto text-foreground" />}
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
          </>
        )}

        {/* Payment Methods */}
        <div className="space-y-3">
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium justify-center"
            disabled={justSave && (!customAmount || parseFloat(customAmount) <= 0)}
            onClick={() => {
              console.log('Bank Wire clicked', { justSave, customAmount, depositAmount });
              const finalAmount = justSave ? parseFloat(customAmount) : depositAmount;
              const finalDays = justSave ? 365 : investmentDays;
              
              navigate('/payment-process', { 
                state: { 
                  paymentMethod: 'bank_wire',
                  depositAmount: finalAmount,
                  selectedProduct,
                  investmentDays: finalDays,
                  justSave
                } 
              });
            }}
          >
            {t('paymentMethod.bankWire')}
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium justify-center"
            disabled={justSave && (!customAmount || parseFloat(customAmount) <= 0)}
            onClick={() => {
              console.log('Stablecoin clicked', { justSave, customAmount, depositAmount });
              const finalAmount = justSave ? parseFloat(customAmount) : depositAmount;
              const finalDays = justSave ? 365 : investmentDays;
              
              navigate('/payment-process', { 
                state: { 
                  paymentMethod: 'stablecoin',
                  depositAmount: finalAmount,
                  selectedProduct,
                  investmentDays: finalDays,
                  justSave
                } 
              });
            }}
          >
            {t('paymentMethod.stablecoin')}
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium justify-center"
            disabled={justSave && (!customAmount || parseFloat(customAmount) <= 0)}
            onClick={() => {
              console.log('Credit Card clicked', { justSave, customAmount, depositAmount });
              const finalAmount = justSave ? parseFloat(customAmount) : depositAmount;
              const finalDays = justSave ? 365 : investmentDays;
              
              navigate('/payment-process', { 
                state: { 
                  paymentMethod: 'credit_card',
                  depositAmount: finalAmount,
                  selectedProduct,
                  investmentDays: finalDays,
                  justSave
                } 
              });
            }}
          >
            {t('paymentMethod.creditCard')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;