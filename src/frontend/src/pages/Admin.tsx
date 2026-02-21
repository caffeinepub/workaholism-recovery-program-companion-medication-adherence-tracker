import { useState } from 'react';
import { useAdminListAllUsers, useAdminSetUserSubscription } from '../hooks/useSubscription';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { SubscriptionStatus } from '../backend';

function formatExpiryDate(status: SubscriptionStatus): string {
  if (status.__kind__ === 'Active') {
    const expiryTime = Number(status.Active) / 1_000_000;
    return new Date(expiryTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  return 'N/A';
}

function getStatusBadge(status: SubscriptionStatus) {
  if (status.__kind__ === 'Active') {
    const expiryTime = Number(status.Active) / 1_000_000;
    const isExpired = Date.now() > expiryTime;
    if (isExpired) {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Expired
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
        <CheckCircle className="h-3 w-3" />
        Active
      </Badge>
    );
  }
  if (status.__kind__ === 'Pending') {
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
    );
  }
  return (
    <Badge variant="destructive" className="gap-1">
      <XCircle className="h-3 w-3" />
      Expired
    </Badge>
  );
}

export default function Admin() {
  const { data: currentProfile } = useGetCallerUserProfile();
  const { data: users, isLoading } = useAdminListAllUsers();
  const setSubscription = useAdminSetUserSubscription();
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
            <p className="text-muted-foreground">You do not have permission to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleGrantAccess = async (userPrincipal: string) => {
    setProcessingUser(userPrincipal);
    try {
      await setSubscription.mutateAsync({
        user: userPrincipal as any,
        durationDays: 30,
      });
      toast.success('30-day access granted successfully');
    } catch (error) {
      toast.error('Failed to grant access');
      console.error('Grant access error:', error);
    } finally {
      setProcessingUser(null);
    }
  };

  const handleMarkExpired = async (userPrincipal: string) => {
    setProcessingUser(userPrincipal);
    try {
      await setSubscription.mutateAsync({
        user: userPrincipal as any,
        durationDays: 0,
      });
      toast.success('Subscription marked as expired');
    } catch (error) {
      toast.error('Failed to update subscription');
      console.error('Mark expired error:', error);
    } finally {
      setProcessingUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Admin Panel
        </h1>
        <p className="text-muted-foreground">Manage user subscriptions and access</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : users && users.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.principal.toString()}>
                      <TableCell className="font-medium">{user.name || 'No name'}</TableCell>
                      <TableCell className="font-mono text-xs max-w-[200px] truncate">
                        {user.principal.toString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(user.subscriptionStatus)}</TableCell>
                      <TableCell>{formatExpiryDate(user.subscriptionStatus)}</TableCell>
                      <TableCell>{user.isAdmin ? <Badge variant="outline">Admin</Badge> : '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleGrantAccess(user.principal.toString())}
                            disabled={processingUser === user.principal.toString()}
                          >
                            {processingUser === user.principal.toString() ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Grant 30 Days'
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleMarkExpired(user.principal.toString())}
                            disabled={processingUser === user.principal.toString()}
                          >
                            {processingUser === user.principal.toString() ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Mark Expired'
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
