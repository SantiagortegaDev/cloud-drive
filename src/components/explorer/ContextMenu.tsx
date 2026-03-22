import { Copy, Scissors, Clipboard, Trash2, Edit2, Link, Download, FolderInput } from "lucide-react";

interface ContextMenuProps {
  x: number;
  y: number;
  isFolder: boolean;
  hasUrl?: boolean;
  onClose: () => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onRename: () => void;
  onCopyLink?: () => void;
  onDownload?: () => void;
  onMoveTo: () => void;
  canPaste: boolean;
}

const ContextMenu = ({
  x,
  y,
  isFolder,
  hasUrl,
  onClose,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onRename,
  onCopyLink,
  onDownload,
  onMoveTo,
  canPaste,
}: ContextMenuProps) => {
  const MenuItem = ({ 
    icon: Icon, 
    label, 
    onClick, 
    disabled,
    danger
  }: { 
    icon: any; 
    label: string; 
    onClick: () => void; 
    disabled?: boolean;
    danger?: boolean;
  }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
        onClose();
      }}
      disabled={disabled}
      className={`flex w-full items-center gap-2 px-3 py-1.5 text-xs transition-colors ${
        disabled 
          ? "text-win-text-secondary opacity-50 cursor-not-allowed" 
          : danger
            ? "text-red-400 hover:bg-red-500/20"
            : "text-win-text-primary hover:bg-win-surface-hover"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );

  // Adjust position to keep menu in viewport
  const adjustedX = Math.min(x, window.innerWidth - 180);
  const adjustedY = Math.min(y, window.innerHeight - 280);

  return (
    <>
      <div 
        className="fixed inset-0 z-50" 
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />
      <div
        className="fixed z-50 min-w-[160px] rounded-md border border-win-divider bg-win-surface py-1 shadow-xl"
        style={{ left: adjustedX, top: adjustedY }}
      >
        {!isFolder && hasUrl && (
          <>
            <MenuItem icon={Download} label="Download" onClick={onDownload!} />
            <MenuItem icon={Link} label="Copy Link" onClick={onCopyLink!} />
            <div className="mx-2 my-1 h-px bg-win-divider" />
          </>
        )}
        <MenuItem icon={Copy} label="Copy" onClick={onCopy} />
        <MenuItem icon={Scissors} label="Cut" onClick={onCut} />
        <MenuItem icon={Clipboard} label="Paste" onClick={onPaste} disabled={!canPaste} />
        <div className="mx-2 my-1 h-px bg-win-divider" />
        <MenuItem icon={FolderInput} label="Move to..." onClick={onMoveTo} />
        <MenuItem icon={Edit2} label="Rename" onClick={onRename} />
        <div className="mx-2 my-1 h-px bg-win-divider" />
        <MenuItem icon={Trash2} label="Delete" onClick={onDelete} danger />
      </div>
    </>
  );
};

export default ContextMenu;
