import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Monitor, Coffee, Egg, Milk, Container, Beer, Wheat, Cigarette } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import { useNaviAPY } from "@/hooks/useNaviAPY";

const DecideDeposit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  const { userAPY, isLoading } = useNaviAPY();
  
  // Get product info from navigation state
  const { product = 'netflix', price = 12.99, icon = 'Monitor' } = location.state || {};
  
  // Standardized day intervals for all items: 6 months down to 1 day
  const dayIntervals = [
    180, // 6 months
    150, // 5 months
    120, // 4 months
    90,  // 3 months
    60,  // 2 months
    ...Array.from({ length: 30 }, (_, i) => 30 - i) // 30 days down to 1 day
  ];

  const defaultIndex = dayIntervals.indexOf(7); // Default to weekly
  const [sliderValue, setSliderValue] = useState([defaultIndex]);

  // Use dynamic APY from dashboard (comes as percentage like 4 for 4%), convert to decimal
  const APY_percentage = userAPY || 4;
  const APY = APY_percentage / 100;

  // Calculate deposit needed for a specific number of days
  // Formula: Interest = Principal × APY × (Days / 365)
  // We want: Interest = Price
  // So: Principal = Price / (APY × (Days / 365))
  // Simplified: Principal = (Price × 365) / (APY × Days)
  const calculateDepositForDays = (days: number) => {
    return (price * 365) / (APY * days);
  };

  const minDeposit = calculateDepositForDays(dayIntervals[0]); // Max days (min deposit)
  const maxDeposit = calculateDepositForDays(dayIntervals[dayIntervals.length - 1]); // Min days (max deposit)
  
  // AI Recommendation: weekly (7 days) for all items except rice (monthly for rice)
  const recommendedDays = product === 'rice' ? 30 : 7;
  const aiRecommendation = calculateDepositForDays(recommendedDays);

  const formatTimeString = (days: number) => {
    const { t, language } = useLanguage();
    
    if (language === 'ja') {
      if (days === 1) return t('decideDeposit.eachDay');
      if (days === 7) return t('decideDeposit.eachWeek');
      if (days === 120) return "4" + t('decideDeposit.months') + "毎";
      if (days === 90) return "3" + t('decideDeposit.months') + "毎";
      if (days === 60) return "2" + t('decideDeposit.months') + "毎";
      if (days === 30) return t('decideDeposit.eachMonth');
      if (days < 30) return t('decideDeposit.every') + days + t('decideDeposit.days');
      if (days < 365) {
        const months = Math.round(days / 30);
        if (months === 1) return t('decideDeposit.eachMonth');
        return t('decideDeposit.every') + months + t('decideDeposit.months');
      }
      const years = Math.round(days / 365);
      if (years === 1) return t('decideDeposit.eachYear');
      return t('decideDeposit.every') + years + t('decideDeposit.years');
    }
    
    // English
    if (days === 1) return "each day";
    if (days === 7) return "each week";
    if (days === 120) return "every 4 months";
    if (days === 90) return "every 3 months";
    if (days === 60) return "every 2 months";
    if (days === 30) return "each month";
    if (days < 30) return `every ${days} days`;
    if (days < 365) {
      const months = Math.round(days / 30);
      if (months === 1) return "each month";
      return `every ${months} months`;
    }
    const years = Math.round(days / 365);
    if (years === 1) return "each year";
    return `every ${years} years`;
  };

  const currentDays = dayIntervals[sliderValue[0]];
  const currentDeposit = calculateDepositForDays(currentDays);
  const timeString = formatTimeString(currentDays);

  // Get the icon component
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
  const productName = t(`decideDeposit.${product}`) || product;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
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
            className="text-foreground relative z-10 shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
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
        <Card className="bg-card border-border p-6 hover-scale">
          <div className="text-center space-y-3">
            <IconComponent className="w-8 h-8 mx-auto text-foreground" />
            <div>
              <p className="font-medium">{productName}</p>
              <p className="text-sm text-muted-foreground">￥{price.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        {/* Deposit Slider */}
        <div className="space-y-4">
          <Slider
            value={sliderValue}
            onValueChange={setSliderValue}
            max={dayIntervals.length - 1}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t('decideDeposit.min')} ￥{Math.ceil(minDeposit).toLocaleString()}</span>
            <span>{t('decideDeposit.max')} ￥{Math.ceil(maxDeposit).toLocaleString()}</span>
          </div>
        </div>

        {/* Dynamic Deposit Information */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            {language === 'ja' ? (
              <p className="text-sm">
                {t('decideDeposit.today')}￥{Math.ceil(currentDeposit).toLocaleString()}を預けて{timeString}{t('decideDeposit.free')}の{productName}を1つ手に入れる
              </p>
            ) : (
              <>
                <p className="text-sm">
                  {t('decideDeposit.get')} <span className="text-accent">"{t('decideDeposit.free')}"</span> {productName} {timeString} {t('decideDeposit.by')}
                </p>
                <p className="text-sm">
                  {t('decideDeposit.depositing')} <span className="text-accent">￥{Math.ceil(currentDeposit).toLocaleString()}</span> {t('decideDeposit.today')}
                </p>
              </>
            )}
          </div>

          <div 
            className="bg-success/10 border-2 border-success rounded-xl p-4 cursor-pointer hover:bg-success/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            onClick={() => {
              const recommendedIndex = dayIntervals.indexOf(recommendedDays);
              if (recommendedIndex !== -1) {
                setSliderValue([recommendedIndex]);
              }
            }}
          >
            <div className="flex items-center justify-center">
              <span className="text-xs font-medium text-success-foreground bg-success px-3 py-1.5 rounded-full">
                {t('decideDeposit.aiRec')}
              </span>
            </div>
            <div className="text-center mt-3 space-y-1">
              {language === 'ja' ? (
                <p className="text-sm font-medium text-foreground">
                  {t('decideDeposit.today')}￥{Math.ceil(aiRecommendation).toLocaleString()}{t('decideDeposit.toGetFree')}{productName}を{formatTimeString(recommendedDays)}手に入れる
                </p>
              ) : (
                <p className="text-sm font-medium text-foreground">
                  {t('decideDeposit.aiRecText')} ￥{Math.ceil(aiRecommendation).toLocaleString()} {t('decideDeposit.today')} {t('decideDeposit.toGetFree')} {productName} {formatTimeString(recommendedDays)}
                </p>
              )}
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
                sliderValue: (sliderValue[0] / (dayIntervals.length - 1)) * 100,
                product: product,
                price: price,
                icon: icon
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