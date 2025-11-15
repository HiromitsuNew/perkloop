import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-coffee-barista.jpg";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
    "Enjoy 9% APY on your savings*",
    "Principal protection against market conditions",
    "Full withdrawal of principal within 24 hours",
    "Take profit as soon as one week after deposit"
  ];

  return (
    <div className="min-h-screen bg-background">
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
              className={`text-4xl md:text-6xl font-bold text-foreground drop-shadow-lg transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              The happiness of a free coffee every week.
            </h1>

            {/* Subtext with fade-in slide-up animation */}
            <p 
              className={`text-lg md:text-xl text-foreground/90 drop-shadow transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              *Depositing ￥147000 of savings covers a coffee every 7 days with interests alone
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
                className="text-lg px-12 animate-pulse hover:animate-none"
              >
                {user ? "Go to Dashboard" : "Get Started"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Selling Points Section */}
      <div className="bg-card py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {sellingPoints.map((point, index) => (
              <div 
                key={index}
                data-index={index}
                className={`selling-point-card flex items-start gap-4 p-6 rounded-2xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-lg ${
                  visibleCards.includes(index) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transitionDelay: visibleCards.includes(index) ? `${index * 100}ms` : '0ms'
                }}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                </div>
                <p className="text-lg text-foreground">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
