export type ContactTitle = 'Mr' | 'Mrs' | 'Ms' | 'Dr' | 'Other';

export type ContactSubject = 
  | 'GeneralInquiry' 
  | 'Support' 
  | 'BugReport' 
  | 'Feedback' 
  | 'Complaint' 
  | 'Other';

interface ContactMessage {
  id: number;
  title: ContactTitle;
  senderEmail: string;
  subject: ContactSubject;
  description: string;
  createdAt: string;
}

interface ContactMessageRequest {
  title: ContactTitle;
  senderEmail: string;
  subject: ContactSubject;
  description: string;
}

export type { ContactMessage, ContactMessageRequest };