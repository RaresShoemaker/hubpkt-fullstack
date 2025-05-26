import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import { useTheme } from '../../store/features/ui/useUITheme';
import { cn } from '../../lib/utils';

interface ModalPortalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const ModalPortal: React.FC<ModalPortalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md'
}) => {
  const { isDark } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Prevent scrolling on the body when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Generate max width class based on prop
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case '2xl': return 'max-w-2xl';
      case 'full': return 'max-w-full mx-4';
      default: return 'max-w-md';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle ESC key to close the modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  // Modal markup
  const modalContent = isOpen ? (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity",
        isDark ? "bg-black/70" : "bg-gray-500/70"
      )}
      aria-modal="true"
      role="dialog"
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          "w-full max-h-full overflow-y-auto p-10 relative rounded-lg shadow-xl transition-all",
          getMaxWidthClass(),
          isDark 
            ? "bg-dark-background border border-dark-border/30" 
            : "bg-light-background border border-light-border/30"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b",
          isDark ? "border-dark-border/30" : "border-light-border/30"
        )}>
          <h2 className={cn(
            "text-lg font-semibold",
            isDark ? "text-dark-text-primary" : "text-light-text-primary"
          )}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className={cn(
              "p-1 rounded-full transition-colors",
              isDark 
                ? "text-dark-text-secondary hover:bg-dark-surface hover:text-dark-text-primary" 
                : "text-light-text-secondary hover:bg-light-surface hover:text-light-text-primary"
            )}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={cn(
          "p-4",
          isDark ? "text-dark-text-primary" : "text-light-text-primary"
        )}>
          {children}
        </div>
      </div>
    </div>
  ) : null;

  // Use portal only on client side
  if (!mounted) return null;

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById('modal-root') || document.body
  );
};

export default ModalPortal;