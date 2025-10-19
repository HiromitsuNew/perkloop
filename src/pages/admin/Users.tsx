import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';

interface UserData {
  user_id: string;
  email: string;
  totalDeposits: number;
  activeInvestments: number;
  pendingInvestments: number;
}

export default function Users() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get all investments
      const { data: investments, error: investmentsError } = await supabase
        .from('investments')
        .select('user_id, deposit_amount, status');

      if (investmentsError) throw investmentsError;

      // Aggregate data by user
      const userData = profiles?.map(profile => {
        const userInvestments = investments?.filter(inv => inv.user_id === profile.user_id) || [];
        const activeInvestments = userInvestments.filter(inv => inv.status === 'active' || inv.status === 'pending');
        const totalDeposits = activeInvestments.reduce((sum, inv) => sum + Number(inv.deposit_amount), 0);
        
        return {
          user_id: profile.user_id,
          email: profile.email || 'N/A',
          totalDeposits,
          activeInvestments: userInvestments.filter(inv => inv.status === 'active').length,
          pendingInvestments: userInvestments.filter(inv => inv.status === 'pending').length,
        };
      }) || [];

      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
        <h1 className="text-3xl font-bold text-foreground">All Users</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Overview ({users.length} / 5 pilot limit)</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No users yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Total Deposits (Active + Pending)</TableHead>
                  <TableHead>Active Investments</TableHead>
                  <TableHead>Pending Investments</TableHead>
                  <TableHead>User ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-lg">
                        ¥{user.totalDeposits.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.activeInvestments > 0 ? (
                        <Badge variant="default">{user.activeInvestments}</Badge>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.pendingInvestments > 0 ? (
                        <Badge variant="secondary">{user.pendingInvestments}</Badge>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {user.user_id.substring(0, 8)}...
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}