import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-lg font-medium">
            Select a desirable good to
          </h1>
          <h2 className="text-lg font-medium">
            let your <span className="text-accent">money</span> work for you
          </h2>
        </div>

        {/* Balance Card */}
        <Card className="bg-card border-border p-6 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Withdrawable Principle</p>
            <h3 className="text-4xl font-bold">$ 1531.02</h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Investment Progress</span>
              <HelpCircle className="w-4 h-4 text-primary" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-success font-semibold">23 Days</span>
                <span className="text-sm text-muted-foreground">
                  Until the next free <span className="text-accent">Starbucks</span>
                </span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium"
          >
            Withdraw Principle
          </Button>
          
          <Button 
            onClick={() => navigate('/pick-purchase')}
            variant="secondary" 
            className="w-full h-12 text-base font-medium"
          >
            Add new purchases
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium"
          >
            Privacy Policy
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full h-12 text-base font-medium"
          >
            User Agreement
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;