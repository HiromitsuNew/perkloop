import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Shield } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Emergency() {
  const [shutdownDialogOpen, setShutdownDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmergencyShutdown = async () => {
    setProcessing(true);

    try {
      // Update all active investments to suspended
      const { error: investmentError } = await supabase
        .from('investments')
        .update({ status: 'suspended' })
        .eq('status', 'active');

      if (investmentError) throw investmentError;

      // Log the emergency shutdown
      await supabase.rpc('log_admin_action', {
        p_action_type: 'EMERGENCY_SHUTDOWN',
        p_investment_id: null,
        p_details: {
          timestamp: new Date().toISOString(),
          reason: 'Emergency shutdown initiated by admin',
        },
      });

      // Generate refund CSV data
      const { data: activeInvestments } = await supabase
        .from('investments')
        .select('*, profiles(email, bank_name, bank_branch, account_number, account_holder_name)')
        .in('status', ['active', 'suspended', 'pending']);

      if (activeInvestments && activeInvestments.length > 0) {
        const csvData = [
          ['Email', 'Bank Name', 'Branch', 'Account Number', 'Holder Name', 'Refund Amount'],
          ...activeInvestments.map((inv) => [
            inv.profiles.email,
            inv.profiles.bank_name || 'N/A',
            inv.profiles.bank_branch || 'N/A',
            inv.profiles.account_number || 'N/A',
            inv.profiles.account_holder_name || 'N/A',
            Number(inv.deposit_amount) + Number(inv.returns || 0),
          ]),
        ];

        const csv = csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `refund-list-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }

      toast({
        title: 'Emergency Shutdown Complete',
        description: 'All active investments suspended. Refund CSV downloaded.',
      });

      navigate('/admin');
    } catch (error) {
      console.error('Error during emergency shutdown:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete emergency shutdown',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
      setShutdownDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Emergency Controls</h1>
      </div>

      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Emergency Shutdown</CardTitle>
          </div>
          <CardDescription>
            Use this only in case of critical issues that require immediate service suspension.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-destructive/10 rounded-lg space-y-2">
            <p className="text-sm font-semibold text-destructive">This action will:</p>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>Immediately suspend all active investments</li>
              <li>Prevent any new deposits from being confirmed</li>
              <li>Generate a CSV file with all users requiring refunds</li>
              <li>Create an audit log entry</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              After shutdown, you will need to manually process refunds using the generated CSV file.
            </p>
          </div>

          <Button
            variant="destructive"
            size="lg"
            className="w-full"
            onClick={() => setShutdownDialogOpen(true)}
            disabled={processing}
          >
            <AlertTriangle className="mr-2 h-5 w-5" />
            INITIATE EMERGENCY SHUTDOWN
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={shutdownDialogOpen} onOpenChange={setShutdownDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will immediately suspend all operations. All active investments will be
              marked as suspended, and you will need to manually process refunds. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEmergencyShutdown}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Shutdown Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
