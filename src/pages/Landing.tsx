import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useEffect } from "react";
import heroImage from "@/assets/hero-coffee.jpg";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

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
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-end pb-20 px-6">
          <div className="max-w-4xl w-full text-center space-y-6">
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-foreground drop-shadow-lg">
              The happiness of a free coffee every week.
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-foreground/90 drop-shadow">
              *Depositing ￥147000 of savings covers a coffee every 7 days with interests alone
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Button 
                size="lg"
                onClick={() => navigate("/auth")}
                className="text-lg px-12"
              >
                Get Started
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
                className="flex items-start gap-4 p-6 rounded-2xl bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
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
