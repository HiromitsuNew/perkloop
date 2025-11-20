import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CircleDollarSign, Shield, Clock, Zap, Gift, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import heroImageCoffee from "@/assets/hero-coffee-barista.jpg";
import heroImageNetflix from "@/assets/hero-netflix.jpg";
import heroImageFamily from "@/assets/hero-family.jpg";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bonusDialogOpen, setBonusDialogOpen] = useState(false);

  const slides = [
    {
      image: heroImageCoffee,
      hero: t('landing.hero'),
      subtitle: t('landing.subtitle')
    },
    {
      image: heroImageNetflix,
      hero: t('landing.hero2'),
      subtitle: t('landing.subtitle2')
    },
    {
      image: heroImageFamily,
      hero: t('landing.hero3'),
      subtitle: t('landing.subtitle3')
    }
  ];

  useEffect(() => {
    // Trigger hero animations on mount
    setIsVisible(true);

    // Set up intersection observer for selling points cards
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe all card elements after a short delay
    setTimeout(() => {
      document.querySelectorAll('.selling-point-card').forEach((card) => {
        observer.observe(card);
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Auto-rotate slides every 4 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const sellingPoints = [
    {
      text: t('landing.card1'),
      textBold: t('landing.card1.bold'),
      textSuffix: t('landing.card1.suffix'),
      disclaimer: t('landing.card1.disclaimer'),
      icon: CircleDollarSign
    },
    {
      text: t('landing.card2'),
      textBold: t('landing.card2.bold'),
      textSuffix: t('landing.card2.suffix'),
      disclaimer: t('landing.card2.disclaimer'),
      icon: Shield
    },
    {
      text: t('landing.card3'),
      textBold: t('landing.card3.bold'),
      textSuffix: t('landing.card3.suffix'),
      disclaimer: t('landing.card3.disclaimer'),
      icon: Clock
    },
    {
      text: t('landing.card4'),
      textBold: t('landing.card4.bold'),
      textSuffix: t('landing.card4.suffix'),
      disclaimer: t('landing.card4.disclaimer'),
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Language Selector */}
      <div className="fixed top-6 left-6 z-50">
        <LanguageSelector />
      </div>

      {/* Launch Bonus Button - Eye-catching animated */}
      <button
        onClick={() => setBonusDialogOpen(true)}
        className="fixed top-6 right-6 z-50 group"
      >
        <div className="relative">
          {/* Pulsing glow effect */}
          <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-75 group-hover:opacity-100 animate-pulse" />
          
          {/* Main button */}
          <div className="relative bg-gradient-to-r from-primary via-primary/90 to-primary flex items-center gap-3 px-6 py-4 rounded-full shadow-lg border-2 border-primary-foreground/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
            <Gift className="w-6 h-6 text-primary-foreground animate-bounce" />
            <div className="text-left">
              <div className="text-sm font-bold text-primary-foreground">
                {t('landing.launchBonus')}
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Launch Bonus Dialog */}
      <Dialog open={bonusDialogOpen} onOpenChange={setBonusDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Gift className="w-6 h-6 text-primary" />
              {t('landing.launchBonus')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* New Account Registration */}
            <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {t('landing.bonusNewAccount')}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-foreground">{t('landing.bonusCash')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-foreground">{t('landing.bonusFees')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-foreground">{t('landing.bonusZeroFees')}</span>
                </li>
              </ul>
            </div>

            {/* First Deposit Bonus */}
            <div className="bg-accent/10 p-6 rounded-lg border border-accent/30">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                {t('landing.bonusFirstDeposit')}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-foreground">{t('landing.bonusBoost')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-foreground">{t('landing.bonusConversion')}</span>
                </li>
              </ul>
            </div>

            {/* Disclaimers */}
            <div className="space-y-2 border-t pt-4">
              <p className="text-xs text-muted-foreground italic">
                {t('landing.bonusDisclaimer')}
              </p>
              <p className="text-xs text-muted-foreground italic">
                {t('landing.bonusConversionDisclaimer')}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Images with crossfade animation */}
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out ${
              currentSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background/90" />
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-end pb-20 px-6">
          <div className="max-w-4xl w-full text-center space-y-6">
            {/* Main Headline with fade-in slide-up animation */}
            <h1 
              className={`text-5xl md:text-7xl font-bold text-foreground drop-shadow-lg transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              {slides[currentSlide].hero}
            </h1>

            {/* Subtext with fade-in slide-up animation */}
            <p 
              className={`text-lg md:text-xl text-foreground/90 drop-shadow transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              {slides[currentSlide].subtitle}
            </p>

            {/* Navigation Dots */}
            <div 
              className={`flex gap-2 justify-center transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'bg-foreground w-6' 
                      : 'bg-foreground/40 hover:bg-foreground/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* CTA Button with fade-in scale animation */}
            <div 
              className={`pt-4 transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <Button 
                size="lg"
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
                className="text-lg px-12"
              >
                {t('landing.ctaEnter')}
              </Button>
            </div>
          </div>
          
          {/* Disclaimer at bottom right */}
          <p 
            className={`absolute bottom-10 right-6 text-xs text-foreground/70 drop-shadow transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '800ms' }}
          >
            {t('landing.disclaimer')}
          </p>
        </div>
      </div>

      {/* Intro Section with smooth gradient transition */}
      <div className="relative bg-gradient-to-b from-background via-background to-card py-12 px-6 -mt-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-xl md:text-2xl text-foreground/90 font-light leading-relaxed">
            {t('landing.intro')}
          </p>
          <p className="text-xl md:text-2xl text-foreground/90 font-light leading-relaxed">
            {t('landing.intro2')}
          </p>
        </div>
      </div>

      {/* Key Selling Points Section */}
      <div className="bg-card pt-6 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {sellingPoints.map((point, index) => {
              const IconComponent = point.icon;
              
              return (
                <div 
                  key={index}
                  data-index={index}
                  className={`selling-point-card flex flex-col gap-2 p-6 rounded-2xl bg-background/50 border border-border/50 transition-all duration-500 ${
                    visibleCards.includes(index) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ 
                    transitionDelay: visibleCards.includes(index) ? `${index * 100}ms` : '0ms'
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-success" />
                      </div>
                    </div>
                    <p className="text-lg text-foreground">
                      {point.text && !point.text.includes('landing.card') ? point.text : ''}<strong>{point.textBold}</strong>{point.textSuffix && !point.textSuffix.includes('landing.card') ? point.textSuffix : ''}
                    </p>
                  </div>
                  {point.disclaimer && (
                    <p className="text-xs text-muted-foreground ml-12">{point.disclaimer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
