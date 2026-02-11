import { useState } from "react";
import { Modal, Button, Label, TextInput, ModalBody, ModalHeader, Spinner } from "flowbite-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    adminEmail: string;
  }) => Promise<void>;
}

export default function CreateSchoolModal({
  open,
  onClose,
  onCreate,
}: Props) {

  const [name, setName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !adminEmail.trim()) return;

    try {
      setLoading(true);

      await onCreate({
        name: name.trim(),
        adminEmail: adminEmail.trim(),
      });

      setName("");
      setAdminEmail("");
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
                Create School
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
                required
                />
            </div>

            {/* Admin Email Input */}
            <div>
                <div className="mb-2 block">
                <Label htmlFor="adminEmail">School Admin *</Label>
                </div>
                <p className="mb-2 text-xs text-text-muted-light dark:text-text-muted-dark">
                A school must have at least one school admin.
                </p>
                <TextInput
                id="adminEmail"
                type="email"
                placeholder="admin@school.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                />
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
                ) : (
                    "Create School"
                )}
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