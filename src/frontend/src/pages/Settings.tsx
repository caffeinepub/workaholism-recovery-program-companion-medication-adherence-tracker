import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { getUserSettings, saveUserSettings } from '../utils/userScopedStorage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Download, Heart, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Disclaimers from '../components/safety/Disclaimers';

export default function Settings() {
  const [settings, setSettings] = useState(getUserSettings());

  const handleSaveReminder = () => {
    saveUserSettings(settings);
    toast.success('Settings saved');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and app configuration.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Reminder Settings
          </CardTitle>
          <CardDescription>Configure when you want to be reminded about overdue medications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reminderWindow">Overdue Window (minutes)</Label>
            <Input
              id="reminderWindow"
              type="number"
              min="0"
              max="120"
              value={settings.reminderWindowMinutes}
              onChange={(e) =>
                setSettings({ ...settings, reminderWindowMinutes: parseInt(e.target.value) || 15 })
              }
            />
            <p className="text-xs text-muted-foreground">
              Doses will be marked as overdue this many minutes after their scheduled time.
            </p>
          </div>
          <Button onClick={handleSaveReminder}>Save Reminder Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Export
          </CardTitle>
          <CardDescription>Download your recovery and medication data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/settings/data-export">
            <Button variant="outline">Go to Data Export</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-destructive" />
            Crisis & Help
          </CardTitle>
          <CardDescription>Access emergency contacts and support resources.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/crisis-help">
            <Button variant="outline">Go to Crisis Help</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            About & Disclaimers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Disclaimers />
        </CardContent>
      </Card>
    </div>
  );
}
