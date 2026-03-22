import { Cloud, FileText, Image, Video, Music, Download, Users, ChevronDown, HardDrive, Star } from "lucide-react";

interface SidebarProps {
  folders: string[];
  currentPath: string[];
  onNavigate: (path: string[]) => void;
}

const folderIcons: Record<string, any> = {
  Documents: FileText,
  Photos: Image,
  Videos: Video,
  Music: Music,
  Downloads: Download,
  Shared: Users,
};

const Sidebar = ({ folders, currentPath, onNavigate }: SidebarProps) => {
  const isActive = (folder: string) =>
    currentPath.length >= 2 && currentPath[1] === folder;

  return (
    <div className="flex w-52 flex-col overflow-y-auto bg-win-sidebar py-2 win-scrollbar">
      {/* Quick access */}
      <div className="mb-1 px-4 py-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-win-text-secondary">
          Quick access
        </span>
      </div>
      <button className="flex items-center gap-2.5 px-4 py-[5px] text-left text-xs text-win-text-secondary hover:bg-win-surface-hover">
        <Star className="h-3.5 w-3.5" />
        Favorites
      </button>
      <button className="flex items-center gap-2.5 px-4 py-[5px] text-left text-xs text-win-text-secondary hover:bg-win-surface-hover">
        <HardDrive className="h-3.5 w-3.5" />
        This PC
      </button>

      <div className="mx-3 my-2 h-px bg-win-divider" />

      {/* Cloud Drive */}
      <div className="mb-1 flex items-center gap-1.5 px-4 py-1">
        <ChevronDown className="h-3 w-3 text-win-text-secondary" />
        <Cloud className="h-3.5 w-3.5 text-win-accent" />
        <span className="text-[11px] font-semibold text-win-text-primary">
          Cloud Drive
        </span>
      </div>

      {folders.map((folder) => {
        const Icon = folderIcons[folder] || FileText;
        const active = isActive(folder);
        return (
          <button
            key={folder}
            onClick={() => onNavigate(["Cloud Drive", folder])}
            className={`flex items-center gap-2.5 py-[5px] pl-9 pr-4 text-left text-xs transition-colors active:scale-[0.98] ${
              active
                ? "bg-win-selected-bg text-win-accent font-medium"
                : "text-win-text-secondary hover:bg-win-surface-hover"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {folder}
          </button>
        );
      })}

      <div className="mx-3 my-2 h-px bg-win-divider" />

      <div className="px-4 py-2">
        <div className="rounded-md bg-win-surface p-3">
          <div className="mb-1.5 flex items-center justify-between text-[11px]">
            <span className="text-win-text-secondary">Storage</span>
            <span className="text-win-text-primary">68.4 GB / 100 GB</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-win-divider">
            <div
              className="h-full rounded-full bg-win-accent"
              style={{ width: "68.4%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
