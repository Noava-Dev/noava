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
const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
  
  const newErrors: { [key: string]: string } = {};
  const email = adminInput.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    newErrors.adminEmail = t('validation.email.required');
  } else if (!emailRegex.test(email)) {
    newErrors.adminEmail = t('validation.email.invalid');
  } else if (adminEmails.includes(email)) {
    newErrors.adminEmail = t('validation.email.duplicate');
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
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
    
    const newErrors: { [key: string]: string } = {};
    
    if (!name.trim()) {
      newErrors.name = t('validation.school.name');
    }

    if (adminEmails.length === 0) {
      newErrors.admins = t('validation.school.minAdmins');
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
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
                {errors.name && <FormErrorMessage text={errors.name} />}
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
                {errors.adminEmail && <FormErrorMessage text={errors.adminEmail} />}
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
            {errors.admins && <FormErrorMessage text={errors.admins} />}

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button className="bg-primary-500 w-full sm:w-auto" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
              <Button 
                    type="submit" 
                    disabled={loading || !name.trim()}
                    className="bg-primary-400 w-full sm:w-auto"
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
            </div>
            
            </form>
        </div>
      </ModalBody>
    </Modal>
  );
}