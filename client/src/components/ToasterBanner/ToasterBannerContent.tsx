import React, { useEffect, useRef } from 'react';
import { FileWarning, CheckCircle, AlertCircle, X } from 'lucide-react';
import { TOASTER_TYPES, Toast } from '../../context/ToasterBannerContext/constants';

type ToastProps = Omit<Toast, 'id'> & {
  onDismiss: () => void;
};

const ToastContent: React.FC<ToastProps> = ({ message, type, duration = 3000, onDismiss }) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const animationEndRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const timer = setTimeout(onDismiss, duration + 100);
    const progressBar = progressBarRef.current;

    if (progressBarRef.current) {
      // Set up the animation
      progressBarRef.current.style.transition = `width ${duration}ms linear`;
      // Force a reflow
      progressBarRef.current.getBoundingClientRect();
      progressBarRef.current.style.width = '0%';

      // Set up the animation end handler
      animationEndRef.current = () => {
        clearTimeout(timer);
        onDismiss();
      };

      progressBarRef.current.addEventListener('transitionend', animationEndRef.current);
    }

    return () => {
      if (progressBar && animationEndRef.current) {
        progressBar.removeEventListener('transitionend', animationEndRef.current);
      }
    };
  }, [duration, onDismiss]);

  const getIcon = () => {
    switch (type) {
      case TOASTER_TYPES.SUCCESS:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case TOASTER_TYPES.ERROR:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case TOASTER_TYPES.WARNING:
        return <FileWarning className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case TOASTER_TYPES.SUCCESS:
        return 'bg-green-500';
      case TOASTER_TYPES.ERROR:
        return 'bg-red-500';
      case TOASTER_TYPES.WARNING:
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="relative mb-2 overflow-hidden rounded-lg bg-gray-900 text-white">
      <div className="flex items-center gap-3 p-4">
        {getIcon()}
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onDismiss}
          className="p-1 rounded-full hover:bg-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="h-1 bg-gray-700">
        <div
          ref={progressBarRef}
          className={`h-full w-full ${getProgressColor()}`}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

export default ToastContent;