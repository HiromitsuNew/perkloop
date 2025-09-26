import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentMethod = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/decide-deposit')}
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
          <h3 className="text-base font-medium">Select payment method</h3>
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

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={90} className="h-2" />
        </div>

        {/* Summary */}
        <div className="text-center space-y-2">
          <p className="text-sm">
            Get 1 <span className="text-accent">"free"</span> Netflix{" "}
            <span className="text-success">each month</span> by
          </p>
          <p className="text-sm">
            depositing <span className="text-accent">USD 3,968.8</span> today
          </p>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium justify-center"
          >
            Bank wire
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium justify-center"
          >
            Stablecoin
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium justify-center"
          >
            Credit Card
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;