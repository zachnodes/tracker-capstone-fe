import { useState, useRef, useCallback } from "react";
import { X, Upload, FileVideo, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface QueuedFile {
  id: string;
  file: File;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function UploadSlpModal({ open, onClose }: Props) {
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [rejectMsg, setRejectMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    setRejectMsg("");
    const arr = Array.from(files);
    const valid: File[] = [];
    const bad: string[] = [];

    for (const f of arr) {
      if (f.name.toLowerCase().endsWith(".slp")) {
        valid.push(f);
      } else {
        bad.push(f.name);
      }
    }

    if (bad.length > 0) {
      setRejectMsg(
        bad.length === 1
          ? `"${bad[0]}" is not a .slp file and was not added.`
          : `${bad.length} files were rejected — only .slp files are accepted.`
      );
    }

    if (valid.length === 0) return;

    setQueue((prev) => [
      ...prev,
      ...valid.map((f) => ({
        id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
        file: f,
        status: "pending" as const,
        progress: 0,
      })),
    ]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setQueue((prev) => prev.filter((f) => f.id !== id));
  };

  const uploadAll = () => {
    setQueue((prev) =>
      prev.map((f) =>
        f.status === "pending" ? { ...f, status: "uploading", progress: 0 } : f
      )
    );

    // Simulate staggered upload progress per file
    setQueue((prev) =>
      prev.map((f) => {
        if (f.status !== "uploading") return f;
        return f;
      })
    );

    setQueue((prev) =>
      prev.map((f) => {
        if (f.status !== "uploading" && f.status !== "pending") return f;
        // Simulate immediate completion for demo
        return { ...f, status: "done", progress: 100 };
      })
    );
  };

  const pendingCount = queue.filter((f) => f.status === "pending").length;
  const allDone = queue.length > 0 && queue.every((f) => f.status === "done");

  const handleClose = () => {
    setQueue([]);
    setRejectMsg("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center">
              <Upload className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Upload Replays</h2>
              <p className="text-slate-500 text-xs">.slp files only</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-500 hover:text-white transition-colors rounded-lg p-1 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drop zone */}
        <div className="px-6 pt-5 pb-2">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all py-10 px-6 ${
              dragging
                ? "border-red-500 bg-red-500/10"
                : "border-slate-700 hover:border-slate-600 bg-slate-800/40 hover:bg-slate-800/60"
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${dragging ? "bg-red-500/20" : "bg-slate-700/60"}`}>
              <FileVideo className={`w-6 h-6 transition-colors ${dragging ? "text-red-400" : "text-slate-400"}`} />
            </div>
            <div className="text-center">
              <p className="text-slate-300 text-sm font-medium">
                {dragging ? "Drop to add" : "Drag & drop .slp files here"}
              </p>
              <p className="text-slate-600 text-xs mt-1">or click to browse</p>
            </div>
            <span className="text-xs text-slate-600 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              .slp format only
            </span>
          </div>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".slp"
            className="hidden"
            onChange={handleInputChange}
          />

          {/* Rejection notice */}
          {rejectMsg && (
            <div className="flex items-start gap-2 mt-3 px-3 py-2.5 rounded-lg bg-amber-900/20 border border-amber-700/30">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-amber-400 text-xs">{rejectMsg}</p>
            </div>
          )}
        </div>

        {/* File queue */}
        {queue.length > 0 && (
          <div className="px-6 pb-2 mt-1 max-h-48 overflow-y-auto space-y-1.5" style={{ scrollbarWidth: "none" }}>
            {queue.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50"
              >
                <FileVideo className="w-4 h-4 text-slate-500 shrink-0" />

                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-xs font-medium truncate">{item.file.name}</p>
                  <p className="text-slate-600 text-xs">
                    {(item.file.size / 1024).toFixed(0)} KB
                  </p>
                </div>

                {item.status === "done" && (
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                )}
                {item.status === "error" && (
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                {item.status === "pending" && (
                  <button
                    onClick={() => removeFile(item.id)}
                    className="text-slate-600 hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {item.status === "uploading" && (
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 mt-3">
          <span className="text-slate-600 text-xs">
            {queue.length === 0
              ? "No files selected"
              : `${queue.length} file${queue.length !== 1 ? "s" : ""} queued`}
          </span>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {allDone ? "Done" : "Cancel"}
            </Button>
            {!allDone && (
              <Button
                size="sm"
                onClick={uploadAll}
                disabled={pendingCount === 0}
                className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Upload {pendingCount > 0 ? `${pendingCount} file${pendingCount !== 1 ? "s" : ""}` : ""}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
