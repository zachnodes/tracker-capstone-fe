import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { AlertCircle, XCircle } from "lucide-react";

interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  details?: string;
  variant?: "error" | "warning";
}

export function ErrorModal({ 
  open, 
  onClose, 
  title = "Error",
  message,
  details,
  variant = "error"
}: ErrorModalProps) {
  const isError = variant === "error";
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-slate-800 bg-slate-900 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {isError ? (
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-900/30 border border-red-800">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-900/30 border border-yellow-800">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              </div>
            )}
            <DialogTitle className="text-xl text-white">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-slate-300 text-base">
            {message}
          </DialogDescription>
        </DialogHeader>

        {details && (
          <div className="mt-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <p className="text-xs font-medium text-slate-400 mb-2">Technical Details:</p>
            <p className="text-sm text-slate-300 font-mono break-words">{details}</p>
          </div>
        )}

        <DialogFooter className="mt-6">
          <Button
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
