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
  totalDeposits: number;
  activeInvestments: number;
  pendingInvestments: number;
}

interface Investment {
  id: string;
  product_name: string;
  deposit_amount: number;
  returns: number;
  investment_days: number;
  status: string;
  created_at: string;
}

export default function Users() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userInvestments, setUserInvestments] = useState<Investment[]>([]);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [editValues, setEditValues] = useState({
    deposit_amount: '',
    returns: '',
    investment_days: '',
  });
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

  const fetchUserInvestments = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
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

  const handleEditInvestment = (investment: Investment) => {
    setEditingInvestment(investment);
    setEditValues({
      deposit_amount: investment.deposit_amount.toString(),
      returns: investment.returns.toString(),
      investment_days: investment.investment_days.toString(),
    });
  };

  const handleSaveEdit = async () => {
    if (!editingInvestment) return;

    try {
      const { error } = await supabase
        .from('investments')
        .update({
          deposit_amount: Number(editValues.deposit_amount),
          returns: Number(editValues.returns),
          investment_days: Number(editValues.investment_days),
        })
        .eq('id', editingInvestment.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Investment updated successfully',
      });

      // Refresh data
      if (selectedUser) {
        await fetchUserInvestments(selectedUser.user_id);
      }
      await fetchUsers();
      setEditingInvestment(null);
    } catch (error) {
      console.error('Error updating investment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update investment',
        variant: 'destructive',
      });
    }
  };

  const handleViewUser = async (user: UserData) => {
    setSelectedUser(user);
    await fetchUserInvestments(user.user_id);
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
                  <TableHead>Actions</TableHead>
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

      {/* User Investments Dialog */}
      <Dialog open={selectedUser !== null} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Investments for {selectedUser?.email}</DialogTitle>
            <DialogDescription>
              Edit deposit amounts, returns, and investment periods directly
            </DialogDescription>
          </DialogHeader>
          
          {userInvestments.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No active or pending investments
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deposit</TableHead>
                  <TableHead>Returns</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userInvestments.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell className="font-medium">{investment.product_name}</TableCell>
                    <TableCell>
                      <Badge variant={investment.status === 'active' ? 'default' : 'secondary'}>
                        {investment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>¥{Number(investment.deposit_amount).toLocaleString()}</TableCell>
                    <TableCell>¥{Number(investment.returns).toLocaleString()}</TableCell>
                    <TableCell>{investment.investment_days} days</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditInvestment(investment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Investment Dialog */}
      <Dialog open={editingInvestment !== null} onOpenChange={() => setEditingInvestment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Investment</DialogTitle>
            <DialogDescription>
              Update deposit amount, returns, and investment period for {editingInvestment?.product_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deposit_amount">Deposit Amount (¥)</Label>
              <Input
                id="deposit_amount"
                type="number"
                value={editValues.deposit_amount}
                onChange={(e) => setEditValues({ ...editValues, deposit_amount: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="returns">Returns (¥)</Label>
              <Input
                id="returns"
                type="number"
                value={editValues.returns}
                onChange={(e) => setEditValues({ ...editValues, returns: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="investment_days">Investment Period (days)</Label>
              <Input
                id="investment_days"
                type="number"
                value={editValues.investment_days}
                onChange={(e) => setEditValues({ ...editValues, investment_days: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingInvestment(null)}>
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