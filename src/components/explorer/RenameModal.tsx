import { useState } from "react";
import { X } from "lucide-react";

interface RenameModalProps {
  currentName: string;
  isFolder: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
}

const RenameModal = ({ currentName, isFolder, onClose, onRename }: RenameModalProps) => {
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name === currentName) return;
    
    setLoading(true);
    await onRename(name.trim());
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg border border-win-divider bg-win-surface p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-win-text-primary">
            Rename {isFolder ? "Folder" : "File"}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-win-text-secondary hover:bg-win-surface-hover"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter new name"
            autoFocus
            className="mb-4 w-full rounded-md border border-win-divider bg-win-mica px-3 py-2 text-sm text-win-text-primary placeholder:text-win-text-secondary focus:border-win-accent focus:outline-none"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-win-divider px-4 py-2 text-sm text-win-text-secondary hover:bg-win-surface-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim() || name === currentName}
              className="rounded-md bg-win-accent px-4 py-2 text-sm text-white hover:bg-win-accent-hover disabled:opacity-50"
            >
              {loading ? "Renaming..." : "Rename"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameModal;
