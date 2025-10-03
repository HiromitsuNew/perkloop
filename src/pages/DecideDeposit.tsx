import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Monitor, Coffee } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const DecideDeposit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  // Get product info from navigation state, default to Netflix
  const { product = 'netflix', price = 12.99, icon = 'Monitor' } = location.state || {};
  const APY = 0.04;
  
  const [sliderValue, setSliderValue] = useState([50]); // Default to middle

  // Calculate min/max deposits based on product
  const getMinDeposit = () => {
    // Min = 1 year of returns: price / APY
    return price / APY;
  };

  const getMaxDeposit = () => {
    // Max = daily returns for a year: (price * 365) / APY
    return (price * 365) / APY;
  };

  const getAIRecommendation = () => {
    // AI recommendation for weekly: (price * 52) / APY
    return (price * 52) / APY;
  };

  const minDeposit = getMinDeposit();
  const maxDeposit = getMaxDeposit();
  const aiRecommendation = getAIRecommendation();

  // Calculate deposit amount and days based on slider value (0-100)
  const calculateDeposit = (value: number) => {
    return minDeposit + (value / 100) * (maxDeposit - minDeposit);
  };

  const calculateDays = (depositAmount: number) => {
    // days = (deposit * APY) / price
    const itemsPerYear = (depositAmount * APY) / price;
    return Math.round(365 / itemsPerYear);
  };

  const formatTimeString = (days: number) => {
    if (days === 1) return "each day";
    if (days === 7) return "each week";
    if (days < 30) return `every ${days} days`;
    if (days < 365) {
      const weeks = Math.round(days / 7);
      if (weeks === 1) return "each week";
      return `every ${weeks} weeks`;
    }
    return "1 year";
  };

  const currentDeposit = calculateDeposit(sliderValue[0]);
  const currentDays = calculateDays(currentDeposit);
  const timeString = formatTimeString(currentDays);

  // Get the icon component
  const IconComponent = icon === 'Coffee' ? Coffee : Monitor;
  const productName = product === 'starbucks' ? t('decideDeposit.starbucks') : t('decideDeposit.netflix');

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
              {t('decideDeposit.title1')}
            </h1>
            <h2 className="text-lg font-medium">
              {t('decideDeposit.title2')} <span className="text-accent">{t('decideDeposit.title2.money')}</span> {t('decideDeposit.title2.rest')}
            </h2>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-base font-medium">{t('decideDeposit.decide')}</h3>
        </div>

        {/* Selected Item */}
        <Card className="bg-card border-border p-6">
          <div className="text-center space-y-3">
            <IconComponent className="w-8 h-8 mx-auto text-foreground" />
            <div>
              <p className="font-medium">{productName}</p>
              <p className="text-sm text-muted-foreground">USD {price.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        {/* Deposit Slider */}
        <div className="space-y-4">
          <Slider
            value={sliderValue}
            onValueChange={setSliderValue}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min: ${minDeposit.toFixed(0)}</span>
            <span>Max: ${maxDeposit.toLocaleString()}</span>
          </div>
        </div>

        {/* Dynamic Deposit Information */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm">
              Get 1 <span className="text-accent">"free"</span> {productName} {timeString} by
            </p>
            <p className="text-sm">
              depositing <span className="text-accent">USD {currentDeposit.toFixed(2)}</span> today
            </p>
          </div>

          <div 
            className="bg-success/10 border border-success/20 rounded-lg p-3 cursor-pointer hover:bg-success/15 transition-colors"
            onClick={() => {
              // Calculate slider value for AI recommendation
              const aiSliderValue = ((aiRecommendation - minDeposit) / (maxDeposit - minDeposit)) * 100;
              setSliderValue([Math.round(aiSliderValue)]);
            }}
          >
            <div className="flex items-center justify-center">
              <span className="text-xs text-success bg-success/20 px-2 py-1 rounded">
                {t('decideDeposit.aiRec')}
              </span>
            </div>
            <div className="text-center mt-2 space-y-1">
              <p className="text-xs">
                Depositing USD {aiRecommendation.toFixed(2)} today to get a free {productName} each week
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/payment-method', { 
              state: { 
                depositAmount: currentDeposit,
                investmentDays: currentDays,
                timeString: timeString,
                sliderValue: sliderValue[0],
                selectedProduct: productName
              }
            })}
            className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90"
          >
            {t('decideDeposit.nextStep')}
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium"
          >
            {t('decideDeposit.addMore')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DecideDeposit;