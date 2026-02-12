import { AlertCircle } from 'lucide-react';

export default function Disclaimers() {
  return (
    <div className="space-y-4 text-sm text-muted-foreground">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="font-medium text-foreground">Not Medical Advice</p>
          <p>
            This application is a personal tracking and organizational tool. It does not provide medical advice,
            diagnosis, or treatment. Always consult with qualified healthcare professionals regarding your health and
            medication.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="font-medium text-foreground">Not for Emergencies</p>
          <p>
            This app is not designed for crisis intervention or emergency situations. If you are experiencing a mental
            health crisis or emergency, please contact emergency services (911 in the US) or a crisis hotline
            immediately.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="font-medium text-foreground">Not Legal Advice</p>
          <p>
            This application does not provide legal advice, legal counsel, or legal representation. It is not a
            substitute for consulting with a qualified attorney regarding legal matters, compliance with laws, or legal
            obligations. For legal guidance, please consult a licensed attorney in your jurisdiction.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="font-medium text-foreground">Not Religious or Spiritual Authority</p>
          <p>
            This application does not provide religious rulings, authoritative interpretation of holy texts, or
            spiritual guidance. It is not a substitute for consultation with qualified religious leaders, scholars, or
            spiritual advisors. For matters of faith and religious practice, please consult appropriate religious
            authorities within your tradition.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="font-medium text-foreground">No Guarantees or Absolute Promises</p>
          <p>
            This application is a support tool only and makes no guarantees, warranties, or promises of any kind. It
            cannot and does not guarantee perfect compliance with laws, religious obligations, or any other standards.
            It cannot prevent incarceration, institutionalization, or any other outcomes. Any claims of "100%",
            "perfect", "eternal", or absolute effectiveness are explicitly rejected. You remain fully responsible for
            your own decisions, actions, and their consequences.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="font-medium text-foreground">Personal Responsibility</p>
          <p>
            You are responsible for your own recovery journey and medication management. This app is a support tool and
            does not replace professional medical care, therapy, or participation in recovery programs.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="font-medium text-foreground">Data Privacy</p>
          <p>
            Your data is stored securely and is only accessible to you. However, you should not rely solely on this app
            for critical health information. Always maintain backup records and share important information with your
            healthcare providers.
          </p>
        </div>
      </div>
    </div>
  );
}
