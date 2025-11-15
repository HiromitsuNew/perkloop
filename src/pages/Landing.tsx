import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CircleDollarSign, Shield, Clock, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-coffee-barista.jpg";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

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

  const sellingPoints = [
    {
      text: t('landing.card1'),
      textBold: t('landing.card1.bold'),
      disclaimer: t('landing.card1.disclaimer'),
      icon: CircleDollarSign
    },
    {
      text: t('landing.card2'),
      textBold: t('landing.card2.bold'),
      disclaimer: null,
      icon: Shield
    },
    {
      text: t('landing.card3'),
      textBold: t('landing.card3.bold'),
      disclaimer: null,
      icon: Clock
    },
    {
      text: t('landing.card4'),
      textBold: t('landing.card4.bold'),
      disclaimer: null,
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Language Selector */}
      <div className="fixed top-6 left-6 z-50">
        <LanguageSelector />
      </div>

      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Image with zoom animation */}
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] ease-out ${
            isVisible ? 'scale-100' : 'scale-105'
          }`}
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background/90" />
        </div>

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
              {t('landing.hero')}
            </h1>

            {/* Subtext with fade-in slide-up animation */}
            <p 
              className={`text-lg md:text-xl text-foreground/90 drop-shadow transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              {t('landing.subtitle')}
            </p>

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
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-foreground/90 font-light leading-relaxed">
            {t('landing.intro')}
          </p>
        </div>
      </div>

      {/* Key Selling Points Section */}
      <div className="bg-card pt-6 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {sellingPoints.map((point, index) => {
              const IconComponent = point.icon;
              // Split text at the bold part and render with bold
              const textParts = point.text.split(point.textBold);
              
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
                      {textParts[0]}<strong>{point.textBold}</strong>{textParts[1]}
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
