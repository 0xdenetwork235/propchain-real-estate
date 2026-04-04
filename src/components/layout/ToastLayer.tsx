import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, Warning, X } from "@phosphor-icons/react";
import { useApp } from "../../context/AppContext";

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: Warning,
};

const colors = {
  success: "border-success text-success",
  error: "border-error text-error",
  info: "border-info text-info",
  warning: "border-warning text-warning",
};

export default function ToastLayer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto bg-card border-l-4 ${colors[toast.type]} rounded-lg p-4 flex items-start gap-3`}
            >
              <Icon size={20} weight="duotone" className="shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-body font-medium text-foreground">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="text-caption font-body text-muted-foreground mt-0.5">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                aria-label="Dismiss notification"
              >
                <X size={16} weight="duotone" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
