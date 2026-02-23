import { Label, TextInput, Textarea, Select, Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ContactTitle, ContactSubject, ContactMessageRequest } from '../../models/ContactMessage';
import { useContactMessageService } from '../../services/ContactMessageService';
import FormErrorMessage from './validation/FormErrorMessage';
import { useToast } from '../../contexts/ToastContext';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function ContactForm({ isOpen, onClose, onSuccess }: ContactFormProps) {
  const { t } = useTranslation(['contact', 'errors']);
  const contactMessageService = useContactMessageService();
  const { showSuccess, showError } = useToast();

  const [title, setTitle] = useState<ContactTitle | ''>('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState<ContactSubject | ''>('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle('');
    setSenderEmail('');
    setSubject('');
    setDescription('');
    setErrors({});
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title) {
      newErrors.title = t('errors:validation.contact.title');
    }

    if (!senderEmail.trim()) {
      newErrors.senderEmail = t('errors:validation.email.required');
    } else if (!validateEmail(senderEmail)) {
      newErrors.senderEmail = t('errors:validation.contact.email');
    } else if (senderEmail.length > 255) {
      newErrors.senderEmail = t('errors:validation.contact.email');
    }

    if (!subject) {
      newErrors.subject = t('errors:validation.contact.subject');
    }

    if (!description.trim()) {
      newErrors.description = t('errors:validation.contact.description.required');
    } else if (description.trim().length < 20) {
      newErrors.description = t('errors:validation.contact.description.minLength');
    } else if (description.trim().length > 4000) {
      newErrors.description = t('errors:validation.contact.description.maxLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const contactRequest: ContactMessageRequest = {
        title: title as ContactTitle,
        senderEmail: senderEmail.trim(),
        subject: subject as ContactSubject,
        description: description.trim(),
      };

      await contactMessageService.create(contactRequest);

      showSuccess(t('success.message'), t('success.title'));
      resetForm();
      onClose();
      onSuccess?.();
    } catch (error) {
      showError(t('error.message'), t('error.title'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleOptions: ContactTitle[] = ['Mr', 'Mrs', 'Ms', 'Dr', 'Other'];
  const subjectOptions: ContactSubject[] = [
    'GeneralInquiry',
    'Support',
    'BugReport',
    'Feedback',
    'Complaint',
    'Other',
  ];

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl" position="center" dismissible>
      <div className="relative bg-background-app-light dark:bg-background-surface-dark rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto">
        <ModalHeader>{t('title')}</ModalHeader>

        <ModalBody>
          <p className="mb-6 text-text-body-light dark:text-text-body-dark">{t('description')}</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">
                {t('form.title.label')} <span className="text-red-500">*</span>
              </Label>
              <Select
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value as ContactTitle)}
                disabled={isSubmitting}
                color={errors.title ? 'failure' : undefined}>
                <option value="">{t('form.title.placeholder')}</option>
                {titleOptions.map((titleOption) => (
                  <option key={titleOption} value={titleOption}>
                    {t(`titles.${titleOption}`)}
                  </option>
                ))}
              </Select>
              {errors.title && <FormErrorMessage text={errors.title} />}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="senderEmail">
                {t('form.email.label')} <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="senderEmail"
                type="email"
                placeholder={t('form.email.placeholder')}
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                disabled={isSubmitting}
                color={errors.senderEmail ? 'failure' : undefined}
                maxLength={255}
              />
              {errors.senderEmail && <FormErrorMessage text={errors.senderEmail} />}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="subject">
                {t('form.subject.label')} <span className="text-red-500">*</span>
              </Label>
              <Select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value as ContactSubject)}
                disabled={isSubmitting}
                color={errors.subject ? 'failure' : undefined}>
                <option value="">{t('form.subject.placeholder')}</option>
                {subjectOptions.map((subjectOption) => (
                  <option key={subjectOption} value={subjectOption}>
                    {t(`subjects.${subjectOption}`)}
                  </option>
                ))}
              </Select>
              {errors.subject && <FormErrorMessage text={errors.subject} />}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">
                {t('form.description.label')} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder={t('form.description.placeholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                rows={6}
                maxLength={4000}
                color={errors.description ? 'failure' : undefined}
              />
              <div className="flex justify-between items-center text-sm">
                <div>{errors.description && <FormErrorMessage text={errors.description} />}</div>
                <span className="text-gray-500 dark:text-gray-400">
                  {description.length} / 4000
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button type="submit" className="w-full sm:flex-1" disabled={isSubmitting}>
                {isSubmitting ? t('form.submitting') : t('form.submit')}
              </Button>
              <Button color="gray" onClick={onClose} type="button" className="w-full sm:w-auto" disabled={isSubmitting}>
                {t('form.cancel')}
              </Button>
            </div>
          </form>
        </ModalBody>
      </div>
    </Modal>
  );
}

export default ContactForm;
