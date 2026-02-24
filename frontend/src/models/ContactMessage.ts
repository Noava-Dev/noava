export type ContactTitle = 'Mr' | 'Mrs' | 'Ms' | 'Dr' | 'Other';

export type ContactSubject = 
  | 'GeneralInquiry' 
  | 'Support' 
  | 'BugReport' 
  | 'Feedback' 
  | 'Complaint' 
  | 'Other';

export type ContactMessageStatus = 'Pending' | 'InProgress' | 'Resolved';

interface ContactMessage {
  id: number;
  title: ContactTitle;
  senderEmail: string;
  subject: ContactSubject;
  description: string;
  status: ContactMessageStatus;
  createdAt: string;
}

interface ContactMessageRequest {
  title: ContactTitle;
  senderEmail: string;
  subject: ContactSubject;
  description: string;
}

interface ContactMessageFilter {
  subject?: ContactSubject;
  status?: ContactMessageStatus;
}

export type { ContactMessage, ContactMessageRequest, ContactMessageFilter };