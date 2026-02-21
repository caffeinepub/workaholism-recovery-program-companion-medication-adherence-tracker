import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Loader2, User, Phone, Mail, Instagram } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactCard() {
  const navigate = useNavigate();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [formData, setFormData] = useState({
    realName: '',
    displayName: '',
    phone: '',
    email: '',
    instagram: '',
    additionalNotes: '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        realName: userProfile.name || '',
        displayName: userProfile.name || '',
        phone: '',
        email: '',
        instagram: '',
        additionalNotes: '',
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.displayName.trim()) {
      toast.error('Display name is required');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: formData.displayName,
        subscriptionStatus: userProfile?.subscriptionStatus || { __kind__: 'Pending', Pending: null },
        isAdmin: userProfile?.isAdmin || false,
        hasPaid: userProfile?.hasPaid || false,
      });

      toast.success('Contact information saved successfully');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save contact information');
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/dashboard' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8" />
            Contact Card
          </h1>
          <p className="text-muted-foreground">Manage your personal and contact information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your real name, display name, and contact details. Your display name will be shown throughout the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="realName">Real Name</Label>
              <Input
                id="realName"
                type="text"
                placeholder="Enter your real name"
                value={formData.realName}
                onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Your legal name for identification purposes
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">
                NFL Combine Tracker Username <span className="text-destructive">*</span>
              </Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Enter your display name"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                This name will be displayed on the leaderboard and your public entries
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Instagram Handle
              </Label>
              <Input
                id="instagram"
                type="text"
                placeholder="@yourusername"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Any additional contact information or notes..."
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={saveProfile.isPending} className="gap-2">
                {saveProfile.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Contact Information
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/dashboard' })}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
