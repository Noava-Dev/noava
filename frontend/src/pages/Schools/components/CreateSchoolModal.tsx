import { useState } from "react";
import { LuX as X } from 'react-icons/lu';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-background-surface-dark">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create School</h2>
          <button onClick={onClose}>
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">

          {/* Name */}
          <div>
            <label className="text-sm font-medium">School Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter school name"
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>

          {/* Admin */}
          <div>
            <label className="text-sm font-medium">
              School Admin *
            </label>

            <p className="text-xs text-text-muted-light">
              A school must have 1 school admin.
            </p>

            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@school.com"
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="rounded-lg bg-primary-500 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create School"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
