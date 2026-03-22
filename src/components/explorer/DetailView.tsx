import { ChevronUp, ChevronDown, Folder, FileText, FileSpreadsheet, File, Image, Video, Music, Archive, Monitor, Loader2 } from "lucide-react";
import { FileItem } from "@/types/files";

interface DetailViewProps {
  files: FileItem[];
  selectedFile: string | null;
  onSelect: (name: string | null) => void;
  onDoubleClick: (file: FileItem) => void;
  sortColumn: keyof FileItem;
  sortAsc: boolean;
  onSort: (column: keyof FileItem) => void;
  loading?: boolean;
}

const iconMap: Record<string, { icon: any; color: string }> = {
  folder: { icon: Folder, color: "text-amber-400" },
  doc: { icon: FileText, color: "text-blue-400" },
  xls: { icon: FileSpreadsheet, color: "text-emerald-400" },
  pdf: { icon: File, color: "text-red-400" },
  img: { icon: Image, color: "text-teal-400" },
  video: { icon: Video, color: "text-purple-400" },
  music: { icon: Music, color: "text-pink-400" },
  zip: { icon: Archive, color: "text-yellow-500" },
  exe: { icon: Monitor, color: "text-gray-400" },
  text: { icon: FileText, color: "text-gray-400" },
  ppt: { icon: File, color: "text-orange-400" },
};

const columns: { key: keyof FileItem; label: string; width: string }[] = [
  { key: "name", label: "Name", width: "flex-1 min-w-[240px]" },
  { key: "modified", label: "Date modified", width: "w-48" },
  { key: "type", label: "Type", width: "w-56" },
  { key: "size", label: "Size", width: "w-24 text-right" },
];

const DetailView = ({ files, selectedFile, onSelect, onDoubleClick, sortColumn, sortAsc, onSort, loading }: DetailViewProps) => {
  const SortIcon = sortAsc ? ChevronUp : ChevronDown;

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-win-mica">
      {/* Header */}
      <div className="flex h-8 items-center border-b border-win-divider bg-win-toolbar px-2 text-[11px] font-semibold text-win-text-secondary select-none">
        {columns.map((col) => (
          <button
            key={col.key}
            onClick={() => onSort(col.key)}
            className={`flex items-center gap-1 px-2 ${col.width} hover:text-win-text-primary transition-colors`}
          >
            {col.label}
            {sortColumn === col.key && <SortIcon className="h-3 w-3" />}
          </button>
        ))}
      </div>

      {/* File list */}
      <div className="flex-1 overflow-y-auto win-scrollbar" onClick={() => onSelect(null)}>
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-win-accent" />
          </div>
        ) : files.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-win-text-secondary">
            <Folder className="mb-3 h-12 w-12 opacity-30" />
            <p className="text-sm">This folder is empty</p>
            <p className="mt-1 text-xs">Click + to upload files</p>
          </div>
        ) : (
          files.map((file) => {
            const { icon: Icon, color } = iconMap[file.icon] || iconMap.text;
            const isSelected = selectedFile === file.id;

            return (
              <div
                key={file.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(file.id);
                }}
                onDoubleClick={() => onDoubleClick(file)}
                className={`flex h-7 cursor-default items-center px-2 text-xs transition-colors select-none ${
                  isSelected
                    ? "bg-win-selected-bg text-win-text-primary"
                    : "text-win-text-primary hover:bg-win-surface-hover"
                }`}
              >
                <div className={`flex items-center gap-2 px-2 ${columns[0].width}`}>
                  <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                  <span className="truncate">{file.name}</span>
                </div>
                <div className={`px-2 text-win-text-secondary ${columns[1].width}`}>
                  {file.modified}
                </div>
                <div className={`px-2 text-win-text-secondary ${columns[2].width}`}>
                  {file.type}
                </div>
                <div className={`px-2 text-win-text-secondary ${columns[3].width}`}>
                  {file.size}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DetailView;
