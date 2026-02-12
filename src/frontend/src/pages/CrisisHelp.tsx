import { useState } from 'react';
import { useGetEmergencyContacts, useAddEmergencyContact } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Phone, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Disclaimers from '../components/safety/Disclaimers';
import type { EmergencyContact } from '../backend';

export default function CrisisHelp() {
  const { data: contacts = [] } = useGetEmergencyContacts();
  const addContact = useAddEmergencyContact();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      toast.error('Please fill in name and phone number');
      return;
    }

    const contact: EmergencyContact = {
      name: name.trim(),
      phone: phone.trim(),
      relationship: relationship.trim(),
      notes: notes.trim(),
    };

    try {
      await addContact.mutateAsync(contact);
      toast.success('Emergency contact added');
      setIsAddDialogOpen(false);
      setName('');
      setPhone('');
      setRelationship('');
      setNotes('');
    } catch (error) {
      toast.error('Failed to add contact');
      console.error('Add contact error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Heart className="h-8 w-8 text-destructive" />
          Crisis & Help
        </h1>
        <p className="text-muted-foreground">Emergency resources and support contacts.</p>
      </div>

      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            If You're in Crisis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-foreground">
            <strong>This app is not for emergencies.</strong> If you are in immediate danger or experiencing a mental
            health crisis, please contact emergency services or a crisis hotline immediately.
          </p>
          <div className="space-y-2 text-sm">
            <p className="font-medium text-foreground">Emergency Resources:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Emergency Services: 911 (US) or your local emergency number</li>
              <li>National Suicide Prevention Lifeline: 988 (US)</li>
              <li>Crisis Text Line: Text HOME to 741741 (US)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Your Emergency Contacts
              </CardTitle>
              <CardDescription>People you can reach out to for support.</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Emergency Contact</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship (Optional)</Label>
                    <Input
                      id="relationship"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      placeholder="e.g., Sponsor, Friend, Therapist"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="When to call, availability, etc."
                      rows={3}
                    />
                  </div>
                  <Button type="submit" disabled={addContact.isPending} className="w-full">
                    {addContact.isPending ? 'Adding...' : 'Add Contact'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="text-center py-8">
              <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No emergency contacts added yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact, idx) => (
                <div key={idx} className="p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{contact.name}</h3>
                      {contact.relationship && (
                        <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                      )}
                    </div>
                    <a href={`tel:${contact.phone}`} className="text-primary hover:underline font-medium">
                      {contact.phone}
                    </a>
                  </div>
                  {contact.notes && <p className="text-sm text-muted-foreground">{contact.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Important Disclaimers</CardTitle>
        </CardHeader>
        <CardContent>
          <Disclaimers />
        </CardContent>
      </Card>
    </div>
  );
}
