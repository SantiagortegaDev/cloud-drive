import { ChevronRight, Search, Cloud } from "lucide-react";

interface AddressBarProps {
  currentPath: string[];
  onNavigate: (path: string[]) => void;
}

const AddressBar = ({ currentPath, onNavigate }: AddressBarProps) => {
  return (
    <div className="flex h-10 items-center gap-2 border-b border-win-divider bg-win-toolbar px-3">
      <div className="flex flex-1 items-center gap-0.5 rounded-md border border-win-divider bg-win-surface px-3 py-1.5">
        <Cloud className="mr-1 h-3.5 w-3.5 text-win-accent" />
        {currentPath.map((segment, i) => (
          <span key={i} className="flex items-center">
            <button
              onClick={() => onNavigate(currentPath.slice(0, i + 1))}
              className="rounded px-1 text-xs text-win-text-primary hover:bg-win-surface-hover active:scale-[0.97]"
            >
              {segment}
            </button>
            {i < currentPath.length - 1 && (
              <ChevronRight className="h-3 w-3 text-win-text-secondary" />
            )}
          </span>
        ))}
      </div>
      <div className="flex w-56 items-center gap-2 rounded-md border border-win-divider bg-win-surface px-3 py-1.5">
        <Search className="h-3.5 w-3.5 text-win-text-secondary" />
        <span className="text-xs text-win-text-secondary">Search Cloud Drive</span>
      </div>
    </div>
  );
};

export default AddressBar;
