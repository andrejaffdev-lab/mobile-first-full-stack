import { ReactNode } from "react";
import { motion } from "framer-motion";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  showHeader?: boolean;
  headerTitle?: string;
  onBack?: () => void;
}

export const MobileLayout = ({
  children,
  className = "",
  showHeader = false,
  headerTitle,
  onBack,
}: MobileLayoutProps) => {
  return (
    <div className={`mobile-container bg-background min-h-screen ${className}`}>
      {showHeader && (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
            )}
            {headerTitle && (
              <h1 className="text-lg font-semibold text-foreground font-display">
                {headerTitle}
              </h1>
            )}
          </div>
        </header>
      )}
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
    </div>
  );
};
