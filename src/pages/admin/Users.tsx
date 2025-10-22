import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserData {
  user_id: string;
  email: string;
  withdrawal_principle_usd: number;
  jpy_deposit: number;
  total_returns: number;
}

interface Investment {
  id: string;
  product_name: string;
  deposit_amount: number;
  investment_days: number;
  created_at: string;
}

interface WithdrawalPreference {
  withdrawal_type: string;
  frequency: string | null;
}

export default function Users() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userInvestments, setUserInvestments] = useState<Investment[]>([]);
  const [withdrawalPreference, setWithdrawalPreference] = useState<WithdrawalPreference | null>(null);
  const [editValues, setEditValues] = useState({
    withdrawal_principle_usd: '',
    jpy_deposit: '',
    total_returns: '',
  });
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, withdrawal_principle_usd, jpy_deposit, total_returns')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const userData = profiles?.map(profile => ({
        user_id: profile.user_id,
        email: profile.email || 'N/A',
        withdrawal_principle_usd: Number(profile.withdrawal_principle_usd) || 0,
        jpy_deposit: Number(profile.jpy_deposit) || 0,
        total_returns: Number(profile.total_returns) || 0,
      })) || [];

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

  const fetchUserInvestments = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('id, product_name, deposit_amount, investment_days, created_at')
        .eq('user_id', userId)
        .in('status', ['active', 'pending'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserInvestments(data || []);
    } catch (error) {
      console.error('Error fetching user investments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch investments',
        variant: 'destructive',
      });
    }
  };

  const fetchWithdrawalPreference = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('withdrawal_preferences')
        .select('withdrawal_type, frequency')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get the most recent preference with returns type (most relevant for admin)
      const returnsPreference = data?.find(pref => pref.withdrawal_type === 'returns');
      const principlesPreference = data?.find(pref => pref.withdrawal_type === 'principles');
      
      // Store both for display
      setWithdrawalPreference(returnsPreference || principlesPreference || null);
    } catch (error) {
      console.error('Error fetching withdrawal preference:', error);
      setWithdrawalPreference(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          withdrawal_principle_usd: Number(editValues.withdrawal_principle_usd),
          jpy_deposit: Number(editValues.jpy_deposit),
          total_returns: Number(editValues.total_returns),
        })
        .eq('user_id', selectedUser.user_id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User values updated successfully',
      });

      await fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
    }
  };

  const handleViewUser = async (user: UserData) => {
    setSelectedUser(user);
    setEditValues({
      withdrawal_principle_usd: user.withdrawal_principle_usd.toString(),
      jpy_deposit: user.jpy_deposit.toString(),
      total_returns: user.total_returns.toString(),
    });
    await Promise.all([
      fetchUserInvestments(user.user_id),
      fetchWithdrawalPreference(user.user_id)
    ]);
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
                  <TableHead>User ID</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {user.user_id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewUser(user)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={selectedUser !== null} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User: {selectedUser?.email}</DialogTitle>
            <DialogDescription>
              Update user-facing values and view investment details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Editable Values */}
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <h3 className="font-semibold text-sm uppercase tracking-wide">User-Facing Values (Editable)</h3>
              
              <div className="space-y-2">
                <Label htmlFor="withdrawal_principle_usd">Withdrawal Principle (USD)</Label>
                <Input
                  id="withdrawal_principle_usd"
                  type="number"
                  step="0.01"
                  value={editValues.withdrawal_principle_usd}
                  onChange={(e) => setEditValues({ ...editValues, withdrawal_principle_usd: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jpy_deposit">JPY Deposit</Label>
                <Input
                  id="jpy_deposit"
                  type="number"
                  step="0.01"
                  value={editValues.jpy_deposit}
                  onChange={(e) => setEditValues({ ...editValues, jpy_deposit: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="total_returns">Total Returns (USD)</Label>
                <Input
                  id="total_returns"
                  type="number"
                  step="0.01"
                  value={editValues.total_returns}
                  onChange={(e) => setEditValues({ ...editValues, total_returns: e.target.value })}
                />
              </div>
            </div>

            {/* Withdrawal Preference */}
            <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
              <h3 className="font-semibold text-sm uppercase tracking-wide">Payment Preference</h3>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="text-muted-foreground">Withdrawal Type:</span>{' '}
                  <span className="font-medium">{withdrawalPreference?.withdrawal_type || 'Not set'}</span>
                </p>
                {withdrawalPreference?.frequency && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Payment Frequency:</span>{' '}
                    <span className="font-medium capitalize">{withdrawalPreference.frequency}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Read-only Investment Info */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm uppercase tracking-wide">Investment Details (Read-only)</h3>
                {userInvestments.length > 0 && (
                  <Badge variant="secondary" className="text-base font-semibold">
                    Total: ¥{userInvestments.reduce((sum, inv) => sum + Number(inv.deposit_amount), 0).toLocaleString()}
                  </Badge>
                )}
              </div>
              
              {userInvestments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active or pending investments</p>
              ) : (
                <div className="space-y-3">
                  {userInvestments.map((inv) => {
                    const createdDate = new Date(inv.created_at);
                    const daysPassed = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
                    const daysInCurrentCycle = daysPassed % inv.investment_days;
                    const nextMaturityDate = new Date(createdDate.getTime() + (daysPassed - daysInCurrentCycle + inv.investment_days) * 24 * 60 * 60 * 1000);
                    
                    return (
                      <div key={inv.id} className="p-3 border rounded bg-background space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{inv.product_name}</span>
                          <Badge variant="outline">¥{Number(inv.deposit_amount).toLocaleString()}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-0.5">
                          <p>Time-to-Purchase: {inv.investment_days} days</p>
                          <p>Next Maturity: {nextMaturityDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-3 border rounded bg-muted/20 text-sm text-muted-foreground">
              <p><strong>User ID:</strong> {selectedUser?.user_id}</p>
              <p><strong>Email:</strong> {selectedUser?.email}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}