import { useState, useEffect } from "react";
import { supabase, ActivityLog } from "@/lib/supabase";
import { ArrowLeft, RefreshCw, FileText, Folder, Trash2, Edit2, Copy, Scissors, FolderInput, Upload, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const actionIcons: Record<string, any> = {
  create: Plus,
  upload: Upload,
  delete: Trash2,
  rename: Edit2,
  copy: Copy,
  cut: Scissors,
  move: FolderInput,
};

const actionColors: Record<string, string> = {
  create: "text-green-400",
  upload: "text-blue-400",
  delete: "text-red-400",
  rename: "text-yellow-400",
  copy: "text-purple-400",
  cut: "text-orange-400",
  move: "text-teal-400",
};

const Log = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    
    if (data) {
      setLogs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-win-mica">
      <div className="border-b border-win-divider bg-win-toolbar">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link 
              to="/"
              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-win-text-secondary hover:bg-win-surface-hover"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <h1 className="text-lg font-semibold text-win-text-primary">Activity Log</h1>
          </div>
          <button
            onClick={loadLogs}
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-win-text-secondary hover:bg-win-surface-hover"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-win-accent" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-win-text-secondary">
            <FileText className="mb-3 h-12 w-12 opacity-30" />
            <p className="text-sm">No activity recorded yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log) => {
              const Icon = actionIcons[log.action] || FileText;
              const color = actionColors[log.action] || "text-gray-400";
              const ItemIcon = log.item_type === "folder" ? Folder : FileText;

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-3 rounded-md border border-win-divider bg-win-surface p-3 hover:bg-win-surface-hover"
                >
                  <div className={`mt-0.5 rounded p-1.5 bg-win-mica ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-win-text-primary capitalize">
                        {log.action}
                      </span>
                      <ItemIcon className={`h-3.5 w-3.5 ${log.item_type === "folder" ? "text-amber-400" : "text-gray-400"}`} />
                      <span className="text-sm text-win-text-secondary truncate">
                        {log.item_name}
                      </span>
                    </div>
                    {log.details && (
                      <p className="mt-0.5 text-xs text-win-text-secondary">
                        {log.details}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-win-text-secondary opacity-60">
                      {formatDate(log.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Log;
