import { ArrowLeft, ArrowRight, ArrowUp, RotateCcw, Plus, FolderPlus, Trash2, MoreHorizontal } from "lucide-react";

interface ToolbarProps {
  currentPath: { id: string | null; name: string }[];
  onNavigate: (folderId: string | null, name: string) => void;
  onGoBack: () => void;
  onGoUp: () => void;
  onRefresh: () => void;
  onNewFile: () => void;
  onNewFolder: () => void;
  canGoBack: boolean;
  canGoUp: boolean;
}

const Toolbar = ({ 
  onGoBack, 
  onGoUp, 
  onRefresh, 
  onNewFile, 
  onNewFolder,
  canGoBack,
  canGoUp
}: ToolbarProps) => {
  const ToolBtn = ({ 
    icon: Icon, 
    disabled, 
    onClick, 
    label,
    highlight
  }: { 
    icon: any; 
    disabled?: boolean; 
    onClick?: () => void; 
    label: string;
    highlight?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded transition-colors active:scale-[0.96] ${
        highlight 
          ? "bg-win-accent text-primary-foreground hover:bg-win-accent-hover" 
          : "text-win-text-secondary hover:bg-win-surface-hover disabled:opacity-30 disabled:hover:bg-transparent"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="flex h-10 items-center gap-1 border-b border-win-divider bg-win-toolbar px-2">
      <div className="flex items-center gap-0.5">
        <ToolBtn icon={ArrowLeft} disabled={!canGoBack} onClick={onGoBack} label="Back" />
        <ToolBtn icon={ArrowRight} disabled label="Forward" />
        <ToolBtn icon={ArrowUp} disabled={!canGoUp} onClick={onGoUp} label="Up" />
        <ToolBtn icon={RotateCcw} onClick={onRefresh} label="Refresh" />
      </div>
      <div className="mx-2 h-5 w-px bg-win-divider" />
      <div className="flex items-center gap-0.5">
        <ToolBtn icon={Plus} onClick={onNewFile} label="Upload File" highlight />
        <ToolBtn icon={FolderPlus} onClick={onNewFolder} label="New Folder" />
        <ToolBtn icon={Trash2} label="Delete" />
        <ToolBtn icon={MoreHorizontal} label="More" />
      </div>
    </div>
  );
};

export default Toolbar;
