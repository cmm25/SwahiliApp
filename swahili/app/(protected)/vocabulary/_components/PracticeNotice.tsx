import { X } from "lucide-react";

interface PracticeNoticeProps {
  message: string | null;
  onClose: () => void;
}

export function PracticeNotice({ message, onClose }: PracticeNoticeProps) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
      <div className="relative bg-card rounded-2xl border border-border/30 shadow-2xl max-w-md w-full p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-hand text-lg">Garden Update</h3>
            <p className="font-hand-secondary text-sm text-muted-foreground">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted/50 rounded-lg transition-colors"
            aria-label="Close notice"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
