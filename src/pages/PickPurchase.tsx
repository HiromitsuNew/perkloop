import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Coffee, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PickPurchase = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
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
          <h3 className="text-base font-medium">Pick a purchase</h3>
        </div>

        {/* Purchase Options */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="bg-card border-border p-6 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => navigate('/')}
          >
            <div className="text-center space-y-3">
              <Coffee className="w-8 h-8 mx-auto text-foreground" />
              <div>
                <p className="font-medium">Starbucks</p>
                <p className="text-sm text-muted-foreground">USD 5</p>
              </div>
            </div>
          </Card>

          <Card 
            className="bg-card border-border p-6 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => navigate('/decide-deposit')}
          >
            <div className="text-center space-y-3">
              <Monitor className="w-8 h-8 mx-auto text-foreground" />
              <div>
                <p className="font-medium">Netflix</p>
                <p className="text-sm text-muted-foreground">USD 12.99</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PickPurchase;