import { Minus, Square, X } from "lucide-react";

const TitleBar = () => (
  <div className="flex h-9 items-center justify-between bg-win-mica px-2 select-none">
    <div className="flex items-center gap-2 pl-2">
      <span className="text-xs font-semibold text-win-text-primary">Cloud Drive</span>
    </div>
    <div className="flex">
      {[Minus, Square, X].map((Icon, i) => (
        <button
          key={i}
          className={`flex h-9 w-12 items-center justify-center text-win-text-secondary transition-colors ${
            i === 2 ? "hover:bg-destructive hover:text-primary-foreground" : "hover:bg-win-surface-hover"
          } active:scale-[0.97]`}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  </div>
);

export default TitleBar;
