import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DecideDeposit = () => {
  const navigate = useNavigate();
  const [sliderValue, setSliderValue] = useState([50]); // Default to middle

  // Calculate deposit amount and months based on slider value (0-100)
  const calculateDeposit = (value: number) => {
    const minDeposit = 159.27;
    const maxDeposit = 3968.8;
    return minDeposit + (value / 100) * (maxDeposit - minDeposit);
  };

  const calculateMonths = (value: number) => {
    const minMonths = 1;
    const maxMonths = 24;
    // Inverse relationship: higher slider value = lower months
    return Math.round(maxMonths - (value / 100) * (maxMonths - minMonths));
  };

  const formatTimeString = (months: number) => {
    if (months === 1) return "1 month";
    if (months < 12) return `${months} months`;
    if (months === 12) return "1 year";
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  };

  const currentDeposit = calculateDeposit(sliderValue[0]);
  const currentMonths = calculateMonths(sliderValue[0]);
  const timeString = formatTimeString(currentMonths);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-md mx-auto space-y-6">
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
              Select a desirable good to
            </h1>
            <h2 className="text-lg font-medium">
              let your <span className="text-accent">money</span> work for you
            </h2>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-base font-medium">Decide your deposit</h3>
        </div>

        {/* Selected Item */}
        <Card className="bg-card border-border p-6">
          <div className="text-center space-y-3">
            <Monitor className="w-8 h-8 mx-auto text-foreground" />
            <div>
              <p className="font-medium">Netflix</p>
              <p className="text-sm text-muted-foreground">USD 12.99</p>
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
            <span>Min: $159.27</span>
            <span>Max: $3,968.8</span>
          </div>
        </div>

        {/* Dynamic Deposit Information */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm">
              Get 1 <span className="text-accent">"free"</span> Netflix in{" "}
              <span className="text-success">{timeString}</span> by
            </p>
            <p className="text-sm">
              depositing <span className="text-accent">USD {currentDeposit.toFixed(2)}</span> today
            </p>
          </div>

          <div 
            className="bg-success/10 border border-success/20 rounded-lg p-3 cursor-pointer hover:bg-success/15 transition-colors"
            onClick={() => setSliderValue([100])}
          >
            <div className="flex items-center justify-center">
              <span className="text-xs text-success bg-success/20 px-2 py-1 rounded">
                AI Recommendation
              </span>
            </div>
            <div className="text-center mt-2 space-y-1">
              <p className="text-xs">
                Get 1 <span className="text-accent">"free"</span> Netflix{" "}
                <span className="text-success">each month</span> by
              </p>
              <p className="text-xs">
                depositing <span className="text-accent">USD 3,968.8</span> today
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/payment-method')}
            className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90"
          >
            Next step
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium"
          >
            Add more recurring purchases
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DecideDeposit;