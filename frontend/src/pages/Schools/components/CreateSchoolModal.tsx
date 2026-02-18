import { useState, useEffect } from "react";
import { Modal, Button, Label, TextInput, ModalBody, ModalHeader, Spinner } from "flowbite-react";
import { LuX as X } from "react-icons/lu";
import FormErrorMessage from '../../../shared/components/validation/FormErrorMessage';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    adminEmails: string[];
  }) => Promise<void>;
  initialData?: {
    name: string;
    adminEmails: string[];
  }
}

export default function CreateSchoolModal({
  open,
  onClose,
  onCreate,
  initialData
}: Props) {

const { t } = useTranslation('errors');
const [name, setName] = useState(initialData?.name ?? "");
const [adminInput, setAdminInput] = useState("");
const [adminEmails, setAdminEmails] = useState<string[]>(initialData?.adminEmails ?? [])
const [loading, setLoading] = useState(false);
const [validationError, setValidationError] = useState<string>('');

useEffect(() => { 
  if (initialData){ 
      setName(initialData.name); 
      setAdminEmails(initialData.adminEmails ?? []);
    } else { 
      // reset when switching back to create mode
      setName("");
      setAdminEmails([]);
}}, [initialData, open]);



  if (!open) return null;

const handleAddAdmin = (e?: React.MouseEvent) => {
  if (e) e.preventDefault();
  setValidationError('');

  const email = adminInput.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    setValidationError(t('validation.email.required'));
    setAdminInput(""); 
    return;
  }

  if (!emailRegex.test(email)) {
    setValidationError(t('validation.email.invalid'));
    setAdminInput("");
    return;
  }

  if (adminEmails.includes(email)) {
    setValidationError(t('validation.email.duplicate'));
    setAdminInput("");
    return;
  }

  setAdminEmails([...adminEmails, email]);
  setAdminInput("");
};

  const handleRemoveAdmin = (email: string) => {
    setAdminEmails(adminEmails.filter(e => e !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    if (!name.trim()) {
      setValidationError(t('validation.school.name'));
      return;
    }

    if (adminEmails.length === 0) {
      setValidationError(t('validation.school.minAdmins'));
      return;
    }

    try {
      setLoading(true);

      await onCreate({
        name: name.trim(),
        adminEmails,
      });

      setName("");
      setAdminInput("");
      setAdminEmails([]);
      onClose();

    } finally {
      setLoading(false);
    }
  };

return (
    <Modal show={open} onClose={onClose} size="md" dismissible>
      <ModalHeader>
      <div className="">
        <h3 className="text-xl font-medium text-text-title-light dark:text-text-title-dark">
                {initialData ? "Edit School" : "Create School"}
        </h3>
      </div>
      </ModalHeader>
      <ModalBody>
        <div className="space-y-6">

            {validationError && <FormErrorMessage text={validationError} />}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
            
            {/* School Name Input */}
            <div>
                <div className="mb-2 block">
                <Label htmlFor="schoolName">School Name *</Label>
                </div>
                <TextInput
                id="schoolName"
                placeholder="Enter school name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
            </div>

            {/* Admin Email Input */}
            <div>
                <div className="mb-2 block">
                <Label htmlFor="adminEmail">School Admins *</Label>
                </div>
                <p className="mb-2 text-xs text-text-muted-light dark:text-text-muted-dark">
                A school must have at least one school admin. Add one admin at a time. You can remove or add multiple before creating.
                </p>
                <TextInput
                id="adminEmail"
                type="email"
                placeholder="admin@school.com"
                value={adminInput}
                onChange={(e) => setAdminInput(e.target.value)}
                />
                <Button className="rounded-lg h-6 w-12 py-4 bg-primary-500 my-3"
                        type="button" onClick={handleAddAdmin} disabled={!adminInput.trim()}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {adminEmails.map(email => (
                <div
                  key={email}
                  className="flex bg-primary-300 w-full justify-between rounded-3xl px-3 items-center"
                >
                  <span>{email}</span>
                  <button type="button" onClick={() => handleRemoveAdmin(email)} className=" flex items-center justify-center my-2 rounded-full">
                    <X></X>
                  </button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Button 
                    type="submit" 
                    disabled={loading || !name.trim()}
                    className="bg-primary-400"
                >
                {loading ? (
                    <>
                        <Spinner size="sm" className="mr-2" />
                        Creating...
                    </>
                ) : initialData ? (
                    "Save Changes"
                ) : (
                    "Create School"
                )
              }
                </Button>
                <Button className="bg-primary-500" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                
                
            </div>
            
            </form>
        </div>
      </ModalBody>
    </Modal>
  );
}