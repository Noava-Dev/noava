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
  onCreate, // ✅ added
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
    <Modal show={open} onClose={onClose} size="md" popup>
      <ModalHeader />
      <ModalBody>
        <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Create School
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* School Name Input */}
            <div>
                <div className="mb-2 block">
                {/* FIX: Label text goes inside the component, not in 'value' prop */}
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
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
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
                <Button color="gray" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                
                {/* FIX: Removed 'isProcessing'. Manually handle loading state. */}
                <Button 
                    type="submit" 
                    disabled={loading || !name.trim()}
                    color="blue"
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
            </div>
            
            </form>
        </div>
      </ModalBody>
    </Modal>
  );
}