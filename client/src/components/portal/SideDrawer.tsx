import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function SideDrawer({ open, onClose, title, children, footer, className }: SideDrawerProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" data-testid="side-drawer-overlay">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        data-testid="side-drawer-backdrop"
      />
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[520px] lg:w-[640px] bg-background shadow-xl transition-transform duration-300 ease-in-out flex flex-col",
          className
        )}
        data-testid="side-drawer-content"
      >
        <div className="flex items-center justify-between gap-4 p-6 border-b">
          {title && (
            <h2 className="text-lg font-semibold truncate" data-testid="side-drawer-title">
              {title}
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="ml-auto shrink-0"
            data-testid="side-drawer-close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6" data-testid="side-drawer-body">
          {children}
        </div>
        {footer && (
          <div className="border-t p-6 bg-muted/30" data-testid="side-drawer-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
