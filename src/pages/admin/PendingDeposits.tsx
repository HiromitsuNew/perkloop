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

interface PendingInvestment {
  id: string;
  user_id: string;
  product_name: string;
  deposit_amount: number;
  reference_code: string;
  created_at: string;
  profiles: {
    email: string;
  };
}

export default function PendingDeposits() {
  const [investments, setInvestments] = useState<PendingInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestment, setSelectedInvestment] = useState<PendingInvestment | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [jpyAmount, setJpyAmount] = useState('');
  const [usdcAmount, setUsdcAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const { toast } = useToast();

  const fetchPendingDeposits = async () => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*, profiles(email)')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setInvestments(data || []);
    } catch (error) {
      console.error('Error fetching pending deposits:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch pending deposits',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDeposits();
  }, []);

  const handleConfirmDeposit = async () => {
    if (!selectedInvestment) return;

    try {
      const { error: updateError } = await supabase
        .from('investments')
        .update({
          status: 'active',
          jpy_received_at: new Date().toISOString(),
          jpy_amount: Number(jpyAmount),
          usdc_converted_at: new Date().toISOString(),
          usdc_amount: Number(usdcAmount),
          navi_deployed_at: new Date().toISOString(),
          navi_transaction_hash: txHash,
          expected_return_date: new Date(
            Date.now() + selectedInvestment.deposit_amount * 24 * 60 * 60 * 1000
          ).toISOString().split('T')[0],
        })
        .eq('id', selectedInvestment.id);

      if (updateError) throw updateError;

      // Log admin action
      await supabase.rpc('log_admin_action', {
        p_action_type: 'CONFIRM_DEPOSIT',
        p_investment_id: selectedInvestment.id,
        p_details: {
          jpy_amount: Number(jpyAmount),
          usdc_amount: Number(usdcAmount),
          tx_hash: txHash,
        },
      });

      toast({
        title: 'Success',
        description: 'Deposit confirmed successfully',
      });

      setConfirmDialogOpen(false);
      setSelectedInvestment(null);
      setJpyAmount('');
      setUsdcAmount('');
      setTxHash('');
      fetchPendingDeposits();
    } catch (error) {
      console.error('Error confirming deposit:', error);
      toast({
        title: 'Error',
        description: 'Failed to confirm deposit',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (investmentId: string) => {
    if (!confirm('Are you sure you want to reject this deposit? This will delete the investment.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', investmentId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Investment rejected and deleted',
      });

      fetchPendingDeposits();
    } catch (error) {
      console.error('Error rejecting deposit:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject deposit',
        variant: 'destructive',
      });
    }
  };

  const getDaysWaiting = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
        <h1 className="text-3xl font-bold text-foreground">Pending Deposits</h1>
      </div>

      {investments.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No pending deposits
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Deposits Awaiting Confirmation</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Email</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reference Code</TableHead>
                  <TableHead>Days Waiting</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell>{investment.profiles.email}</TableCell>
                    <TableCell>{investment.product_name}</TableCell>
                    <TableCell>¥{Number(investment.deposit_amount).toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-sm">{investment.reference_code}</TableCell>
                    <TableCell>{getDaysWaiting(investment.created_at)} days</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedInvestment(investment);
                          setJpyAmount(investment.deposit_amount.toString());
                          setConfirmDialogOpen(true);
                        }}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(investment.id)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deposit</DialogTitle>
            <DialogDescription>
              Enter the details of the deposit you received and the USDC conversion.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="jpyAmount">JPY Amount Received</Label>
              <Input
                id="jpyAmount"
                type="number"
                value={jpyAmount}
                onChange={(e) => setJpyAmount(e.target.value)}
                placeholder="100000"
              />
            </div>
            <div>
              <Label htmlFor="usdcAmount">USDC Amount Converted</Label>
              <Input
                id="usdcAmount"
                type="number"
                value={usdcAmount}
                onChange={(e) => setUsdcAmount(e.target.value)}
                placeholder="680.50"
              />
            </div>
            <div>
              <Label htmlFor="txHash">Sui Transaction Hash</Label>
              <Input
                id="txHash"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="0x..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDeposit}>
              Confirm Deposit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
