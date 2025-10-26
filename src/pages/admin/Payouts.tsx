import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

interface WithdrawalRequest {
  id: string;
  user_email: string;
  deposit_usd: number;
  indicated_jpy_amount: number;
  status: string;
  created_at: string;
}

export default function Payouts() {
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchWithdrawalRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('principal_withdrawal_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setWithdrawalRequests(data || []);
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch withdrawal requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalRequests();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('withdrawal-requests-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'principal_withdrawal_requests'
        },
        () => {
          fetchWithdrawalRequests();
          toast({
            title: '🔔 New Withdrawal Request',
            description: 'A user has requested to withdraw their principal',
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'done' : 'pending';
    
    try {
      const { error } = await supabase
        .from('principal_withdrawal_requests')
        .update({
          status: newStatus,
          processed_at: newStatus === 'done' ? new Date().toISOString() : null,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Status updated to ${newStatus}`,
      });

      fetchWithdrawalRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
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

      {withdrawalRequests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No withdrawal requests
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Principal Withdrawal Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Email</TableHead>
                  <TableHead>Deposit (USD)</TableHead>
                  <TableHead>Indicated Withdrawal Amount (JPY)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawalRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.user_email}</TableCell>
                    <TableCell className="font-semibold">
                      ${Number(request.deposit_usd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      ¥{Number(request.indicated_jpy_amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`status-${request.id}`}
                          checked={request.status === 'done'}
                          onCheckedChange={() => handleStatusChange(request.id, request.status)}
                        />
                        <label
                          htmlFor={`status-${request.id}`}
                          className={`text-sm font-medium cursor-pointer ${
                            request.status === 'done' ? 'text-green-600' : 'text-muted-foreground'
                          }`}
                        >
                          {request.status === 'done' ? 'Done' : 'Pending'}
                        </label>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
