import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PayoutInvestment {
  id: string;
  user_id: string;
  product_name: string;
  deposit_amount: number;
  returns: number;
  investment_days: number;
  expected_return_date: string;
  profiles: {
    email: string;
    bank_name: string;
    bank_branch: string;
    account_number: string;
    account_holder_name: string;
  };
}

export default function Payouts() {
  const [investments, setInvestments] = useState<PayoutInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestment, setSelectedInvestment] = useState<PayoutInvestment | null>(null);
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const { toast } = useToast();

  const fetchReadyPayouts = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data: investmentsData, error } = await supabase
        .from('investments')
        .select('*')
        .eq('status', 'active')
        .lte('expected_return_date', today)
        .order('expected_return_date', { ascending: true });

      if (error) throw error;
      
      // Fetch profiles for all users
      const userIds = investmentsData?.map(inv => inv.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, email, bank_name, bank_branch, account_number, account_holder_name')
        .in('user_id', userIds);
      
      // Map profiles to investments
      const profileMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);
      const enrichedData = investmentsData?.map(inv => ({
        ...inv,
        profiles: profileMap.get(inv.user_id) || {
          email: '',
          bank_name: '',
          bank_branch: '',
          account_number: '',
          account_holder_name: '',
        },
      })) || [];
      
      setInvestments(enrichedData);
    } catch (error) {
      console.error('Error fetching ready payouts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch payouts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadyPayouts();
  }, []);

  const handleProcessPayout = async () => {
    if (!selectedInvestment) return;

    const totalPayout = Number(selectedInvestment.deposit_amount) + Number(selectedInvestment.returns);

    try {
      const { error: updateError } = await supabase
        .from('investments')
        .update({
          status: 'completed',
          payout_jpy_amount: totalPayout,
          payout_processed_at: new Date().toISOString(),
          payout_transaction_id: transactionId,
        })
        .eq('id', selectedInvestment.id);

      if (updateError) throw updateError;

      // Log admin action
      await supabase.rpc('log_admin_action', {
        p_action_type: 'PROCESS_PAYOUT',
        p_investment_id: selectedInvestment.id,
        p_details: {
          payout_amount: totalPayout,
          transaction_id: transactionId,
        },
      });

      toast({
        title: 'Success',
        description: 'Payout processed successfully',
      });

      setPayoutDialogOpen(false);
      setSelectedInvestment(null);
      setTransactionId('');
      fetchReadyPayouts();
    } catch (error) {
      console.error('Error processing payout:', error);
      toast({
        title: 'Error',
        description: 'Failed to process payout',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Process Payouts</h1>
      </div>

      {investments.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No payouts ready to process
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Investments Ready for Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Email</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Original Deposit</TableHead>
                  <TableHead>Returns</TableHead>
                  <TableHead>Total Payout</TableHead>
                  <TableHead>Bank Details</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((investment) => {
                  const totalPayout = Number(investment.deposit_amount) + Number(investment.returns);
                  return (
                    <TableRow key={investment.id}>
                      <TableCell>{investment.profiles.email}</TableCell>
                      <TableCell>{investment.product_name}</TableCell>
                      <TableCell>¥{Number(investment.deposit_amount).toLocaleString()}</TableCell>
                      <TableCell className="text-green-600">¥{Number(investment.returns).toLocaleString()}</TableCell>
                      <TableCell className="font-bold">¥{totalPayout.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <div>{investment.profiles.bank_name}</div>
                          <div>{investment.profiles.bank_branch}</div>
                          <div className="font-mono">{investment.profiles.account_number}</div>
                          <div>{investment.profiles.account_holder_name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedInvestment(investment);
                            setPayoutDialogOpen(true);
                          }}
                        >
                          Process Payout
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={payoutDialogOpen} onOpenChange={setPayoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payout</DialogTitle>
            <DialogDescription>
              Confirm that you have transferred the payout to the user's bank account.
            </DialogDescription>
          </DialogHeader>
          {selectedInvestment && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="text-sm">
                  <span className="font-semibold">Total to transfer:</span>{' '}
                  ¥{(Number(selectedInvestment.deposit_amount) + Number(selectedInvestment.returns)).toLocaleString()}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Bank:</span> {selectedInvestment.profiles.bank_name}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Account:</span> {selectedInvestment.profiles.account_number}
                </div>
              </div>
              <div>
                <Label htmlFor="transactionId">Bank Transaction ID</Label>
                <Input
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID from your bank"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProcessPayout} disabled={!transactionId}>
              Mark as Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
