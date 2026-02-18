import { useState, useEffect } from "react";
import { Modal, Button, Label, TextInput, ModalBody, ModalHeader, Spinner } from "flowbite-react";
import { LuX as X } from "react-icons/lu";

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

const [name, setName] = useState(initialData?.name ?? "");
const [adminInput, setAdminInput] = useState("");
const [adminEmails, setAdminEmails] = useState<string[]>(initialData?.adminEmails ?? [])

useEffect(() => { 
  if (initialData){ 
      setName(initialData.name); 
      setAdminEmails(initialData.adminEmails ?? []);
    } else { 
      // reset when switching back to create mode
      setName("");
      setAdminEmails([]);
}}, [initialData, open]);

  const [loading, setLoading] = useState(false);

  if (!open) return null;

const handleAddAdmin = (e?: React.MouseEvent) => {
  if (e) e.preventDefault();

  const email = adminInput.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    setAdminInput(""); 
    return;
  }

  if (adminEmails.includes(email)) {
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
    if (!name.trim() || adminEmails.length === 0) return;

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

            <form onSubmit={handleSubmit} className="space-y-6">
            
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