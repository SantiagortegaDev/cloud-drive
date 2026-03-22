import { useState, useCallback } from "react";
import { Lock, Eye, EyeOff, Cloud } from "lucide-react";

interface PasswordGateProps {
  onUnlock: () => void;
}

const PasswordGate = ({ onUnlock }: PasswordGateProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (password === "password1234") {
        onUnlock();
      } else {
        setError(true);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    },
    [password, onUnlock]
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div
        className={`w-full max-w-sm rounded-xl border border-win-divider bg-win-mica p-8 shadow-2xl shadow-black/40 transition-transform ${
          shake ? "animate-[shake_0.5s_ease-in-out]" : ""
        }`}
        style={{
          animation: shake
            ? "shake 0.5s cubic-bezier(.36,.07,.19,.97) both"
            : undefined,
        }}
      >
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-win-surface">
            <Cloud className="h-8 w-8 text-win-accent" />
          </div>
          <h1 className="text-xl font-semibold text-win-text-primary">
            Cloud Drive
          </h1>
          <p className="text-sm text-win-text-secondary">
            Enter password to access your files
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-win-text-secondary" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Password"
              autoFocus
              className="h-10 w-full rounded-lg border border-win-divider bg-win-surface pl-10 pr-10 text-sm text-win-text-primary placeholder:text-win-text-secondary focus:border-win-accent focus:outline-none focus:ring-1 focus:ring-win-accent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-win-text-secondary hover:text-win-text-primary"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {error && (
            <p className="text-xs text-destructive">
              Incorrect password. Please try again.
            </p>
          )}

          <button
            type="submit"
            className="h-10 rounded-lg bg-win-accent text-sm font-semibold text-primary-foreground transition-colors hover:bg-win-accent-hover active:scale-[0.98]"
          >
            Unlock
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default PasswordGate;
