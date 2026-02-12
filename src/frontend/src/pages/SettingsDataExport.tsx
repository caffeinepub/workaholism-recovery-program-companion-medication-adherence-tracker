import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetUserData } from '../hooks/useQueries';
import { exportToJSON, exportToTextSummary } from '../utils/exporters';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileJson, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsDataExport() {
  const navigate = useNavigate();
  const { data: userData, isLoading } = useGetUserData();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportJSON = () => {
    if (!userData) {
      toast.error('No data available to export');
      return;
    }

    setIsExporting(true);
    try {
      exportToJSON(userData);
      toast.success('JSON export downloaded');
    } catch (error) {
      toast.error('Failed to export JSON');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportText = () => {
    if (!userData) {
      toast.error('No data available to export');
      return;
    }

    setIsExporting(true);
    try {
      exportToTextSummary(userData);
      toast.success('Text summary downloaded');
    } catch (error) {
      toast.error('Failed to export text summary');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/settings' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Export</h1>
          <p className="text-muted-foreground">Download your recovery and medication data.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            JSON Export
          </CardTitle>
          <CardDescription>
            Download all your data in JSON format. This includes all recovery steps, reflections, check-ins,
            medications, dose logs, meetings, and emergency contacts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExportJSON} disabled={isLoading || isExporting} className="gap-2">
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Download JSON'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Text Summary
          </CardTitle>
          <CardDescription>
            Download a human-readable summary of your progress. Includes program completion, recent check-ins, and
            medication adherence statistics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExportText} disabled={isLoading || isExporting} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Download Text Summary'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
