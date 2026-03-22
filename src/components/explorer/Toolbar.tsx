import { ArrowLeft, ArrowRight, ArrowUp, RotateCcw, Plus, Scissors, Copy, ClipboardPaste, FolderPlus, Trash2, MoreHorizontal } from "lucide-react";

interface ToolbarProps {
  currentPath: string[];
  onNavigate: (path: string[]) => void;
}

const Toolbar = ({ currentPath, onNavigate }: ToolbarProps) => {
  const canGoBack = currentPath.length > 1;
  const canGoUp = currentPath.length > 1;

  const goBack = () => {
    if (canGoBack) onNavigate(currentPath.slice(0, -1));
  };

  const goUp = () => {
    if (canGoUp) onNavigate(currentPath.slice(0, -1));
  };

  const ToolBtn = ({ icon: Icon, disabled, onClick, label }: { icon: any; disabled?: boolean; onClick?: () => void; label: string }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded text-win-text-secondary transition-colors hover:bg-win-surface-hover disabled:opacity-30 disabled:hover:bg-transparent active:scale-[0.96]"
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="flex h-10 items-center gap-1 border-b border-win-divider bg-win-toolbar px-2">
      <div className="flex items-center gap-0.5">
        <ToolBtn icon={ArrowLeft} disabled={!canGoBack} onClick={goBack} label="Back" />
        <ToolBtn icon={ArrowRight} disabled label="Forward" />
        <ToolBtn icon={ArrowUp} disabled={!canGoUp} onClick={goUp} label="Up" />
        <ToolBtn icon={RotateCcw} label="Refresh" />
      </div>
      <div className="mx-2 h-5 w-px bg-win-divider" />
      <div className="flex items-center gap-0.5">
        <ToolBtn icon={Plus} label="New" />
        <ToolBtn icon={Scissors} label="Cut" />
        <ToolBtn icon={Copy} label="Copy" />
        <ToolBtn icon={ClipboardPaste} label="Paste" />
        <ToolBtn icon={FolderPlus} label="New Folder" />
        <ToolBtn icon={Trash2} label="Delete" />
        <ToolBtn icon={MoreHorizontal} label="More" />
      </div>
    </div>
  );
};

export default Toolbar;
