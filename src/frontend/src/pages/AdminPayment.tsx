import { useState } from 'react';
import { useAdminListAllUsers, useTogglePaymentStatus } from '../hooks/usePaymentAdmin';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Shield, Loader2, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPayment() {
  const { data: currentProfile } = useGetCallerUserProfile();
  const { data: users, isLoading } = useAdminListAllUsers();
  const togglePayment = useTogglePaymentStatus();
  const [processingUser, setProcessingUser] = useState<string | null>(null);

  if (!currentProfile?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You do not have permission to access the payment admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleTogglePayment = async (userPrincipal: string, currentStatus: boolean) => {
    setProcessingUser(userPrincipal);
    try {
      const newStatus = await togglePayment.mutateAsync(userPrincipal as any);
      toast.success(
        newStatus ? 'User marked as paid - access granted' : 'User marked as unpaid - access blocked'
      );
    } catch (error) {
      toast.error('Failed to update payment status');
      console.error('Toggle payment error:', error);
    } finally {
      setProcessingUser(null);
    }
  };

  const sortedUsers = users
    ? [...users].sort((a, b) => {
        // Unpaid users first
        if (a.hasPaid !== b.hasPaid) {
          return a.hasPaid ? 1 : -1;
        }
        // Then by name
        return (a.name || '').localeCompare(b.name || '');
      })
    : [];

  const paidCount = users?.filter((u) => u.hasPaid).length || 0;
  const unpaidCount = users?.filter((u) => !u.hasPaid).length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <DollarSign className="h-8 w-8" />
          Payment Management
        </h1>
        <p className="text-muted-foreground">Manage user payment status and access control</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Paid Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-destructive" />
              Unpaid Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{unpaidCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Payment Status</CardTitle>
          <CardDescription>
            Toggle payment status to grant or revoke user access. Unpaid users will be blocked from accessing the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : sortedUsers && sortedUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead className="text-right">Toggle Payment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUsers.map((user) => {
                    const isProcessing = processingUser === user.principal.toString();
                    return (
                      <TableRow key={user.principal.toString()}>
                        <TableCell className="font-medium">{user.name || 'No name'}</TableCell>
                        <TableCell className="font-mono text-xs max-w-[200px] truncate">
                          {user.principal.toString()}
                        </TableCell>
                        <TableCell>
                          {user.hasPaid ? (
                            <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
                              <CheckCircle className="h-3 w-3" />
                              Paid
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1">
                              <XCircle className="h-3 w-3" />
                              Unpaid
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.isAdmin && (
                            <Badge variant="secondary" className="gap-1">
                              <Shield className="h-3 w-3" />
                              Admin
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm text-muted-foreground">
                              {user.hasPaid ? 'Paid' : 'Unpaid'}
                            </span>
                            <Switch
                              checked={user.hasPaid}
                              onCheckedChange={() =>
                                handleTogglePayment(user.principal.toString(), user.hasPaid)
                              }
                              disabled={isProcessing}
                            />
                            {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No users found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
