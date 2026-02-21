import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, LogOut, Instagram, Phone } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PaymentGate() {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-6 w-6" />
            No sign in without up to date payment
          </CardTitle>
          <CardDescription>
            Payment required to access this application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Restricted</AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p className="font-medium">
                Please send Zelle payment and contact admin for access:
              </p>
              <div className="flex flex-col gap-2 mt-3">
                <div className="text-sm">
                  <strong>Zelle:</strong> 3527348440 (Matt Rossin)
                </div>
                <a
                  href="https://instagram.com/thenewbruce1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Instagram className="h-4 w-4" />
                  @thenewbruce1 on Instagram
                </a>
                <a
                  href="tel:3527348440"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  iPhone 📱 txt 3527348440
                </a>
              </div>
              <p className="text-sm mt-3">
                Make sure to provide your username, real name, and name you're known by on this App along with your Zelle payment in the description.
              </p>
            </AlertDescription>
          </Alert>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Once your Zelle payment is verified and the admin toggles your status to "Paid", you'll have full access to all features.
            </p>
            <Button onClick={handleLogout} variant="outline" className="w-full gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
