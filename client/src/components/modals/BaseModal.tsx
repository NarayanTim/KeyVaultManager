import { useEffect, useRef, type ReactNode, type HTMLAttributes } from 'react';
import { X } from 'lucide-react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface BaseModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
  /** Close when clicking the dark overlay outside the modal. Default: false */
  closeOnOverlayClick?: boolean;
  /** Close when pressing Escape. Default: false */
  closeOnEscape?: boolean;
}

const BaseModal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
  closeOnOverlayClick = false,
  closeOnEscape = false,
  className,
  ...props
}: BaseModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={cn(
          'w-full bg-white dark:bg-secondary-900 rounded-xl shadow-xl',
          'border border-secondary-200 dark:border-secondary-700',
          sizes[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        {...props}
      >
        {(title || showClose) && (
          <div className="flex items-start justify-between p-6 pb-4">
            <div>
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-secondary-900 dark:text-white">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                  {description}
                </p>
              )}
            </div>
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 -m-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-6 pt-0">{children}</div>
      </div>
    </div>
  );
};

export default BaseModal;








// import { useEffect, useRef, type ReactNode, type HTMLAttributes } from 'react';
// import { X } from 'lucide-react';
// import { gsap } from 'gsap';
// import { cn } from '@/lib/utils';

// interface BaseModalProps extends HTMLAttributes<HTMLDivElement> {
//   isOpen: boolean;
//   onClose: () => void;
//   title?: string;
//   description?: string;
//   children: ReactNode;
//   size?: 'sm' | 'md' | 'lg' | 'xl';
//   showClose?: boolean;
// }

// const BaseModal = ({
//   isOpen,
//   onClose,
//   title,
//   description,
//   children,
//   size = 'md',
//   showClose = true,
//   className,
//   ...props
// }: BaseModalProps) => {
//   const overlayRef = useRef<HTMLDivElement>(null);
//   const modalRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (isOpen) {
//       gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
//       gsap.fromTo(
//         modalRef.current,
//         { opacity: 0, scale: 0.95, y: 20 },
//         { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out' }
//       );
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }

//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen]);

//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === 'Escape' && isOpen) {
//         onClose();
//       }
//     };

//     document.addEventListener('keydown', handleEscape);
//     return () => document.removeEventListener('keydown', handleEscape);
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   const sizes = {
//     sm: 'max-w-sm',
//     md: 'max-w-md',
//     lg: 'max-w-lg',
//     xl: 'max-w-xl',
//   };

//   return (
//     <div
//       ref={overlayRef}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       <div
//         ref={modalRef}
//         className={cn(
//           'w-full bg-white dark:bg-secondary-900 rounded-xl shadow-xl',
//           'border border-secondary-200 dark:border-secondary-700',
//           sizes[size],
//           className
//         )}
//         onClick={(e) => e.stopPropagation()}
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby={title ? 'modal-title' : undefined}
//         aria-describedby={description ? 'modal-description' : undefined}
//         {...props}
//       >
//         {(title || showClose) && (
//           <div className="flex items-start justify-between p-6 pb-4">
//             <div>
//               {title && (
//                 <h2 id="modal-title" className="text-lg font-semibold text-secondary-900 dark:text-white">
//                   {title}
//                 </h2>
//               )}
//               {description && (
//                 <p id="modal-description" className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
//                   {description}
//                 </p>
//               )}
//             </div>
//             {showClose && (
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="p-1 -m-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
//                 aria-label="Close modal"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             )}
//           </div>
//         )}
//         <div className="p-6 pt-0">{children}</div>
//       </div>
//     </div>
//   );
// };



// export default BaseModal ;
