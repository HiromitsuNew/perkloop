import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertCircle, Users, DollarSign, Clock, Shield } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAUM: 0,
    pendingDeposits: 0,
    maturingSoon: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total unique users from profiles table
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get total AUM (pending + active)
        const { data: aumData } = await supabase
          .from('investments')
          .select('deposit_amount')
          .in('status', ['pending', 'active']);

        const totalAUM = aumData?.reduce((sum, inv) => sum + Number(inv.deposit_amount), 0) || 0;

        // Get pending deposits count
        const { count: pendingCount } = await supabase
          .from('investments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        // Get investments maturing in next 7 days
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

        const { count: maturingCount } = await supabase
          .from('investments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active')
          .lte('expected_return_date', sevenDaysFromNow.toISOString().split('T')[0]);

        setStats({
          totalUsers: userCount || 0,
          totalAUM,
          pendingDeposits: pendingCount || 0,
          maturingSoon: maturingCount || 0,
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <Link to="/dashboard">
          <Button variant="outline">Back to App</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers} / 5</div>
            <p className="text-xs text-muted-foreground">Pilot limit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{stats.totalAUM.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">/ ¥500,000 limit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deposits</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingDeposits}</div>
            {stats.pendingDeposits > 0 && (
              <Link to="/admin/pending-deposits">
                <Button variant="link" size="sm" className="p-0 h-auto">
                  Review now
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maturing Soon</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.maturingSoon}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your pilot operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link to="/admin/pending-deposits">
            <Button className="w-full" variant={stats.pendingDeposits > 0 ? "default" : "outline"}>
              Review Pending Deposits {stats.pendingDeposits > 0 && `(${stats.pendingDeposits})`}
            </Button>
          </Link>
          <Link to="/admin/payouts">
            <Button className="w-full" variant="outline">
              Process Payouts
            </Button>
          </Link>
          <Link to="/admin/audit-logs">
            <Button className="w-full" variant="outline">
              View Audit Logs
            </Button>
          </Link>
          <Link to="/admin/emergency">
            <Button className="w-full" variant="destructive">
              <Shield className="mr-2 h-4 w-4" />
              Emergency Controls
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
