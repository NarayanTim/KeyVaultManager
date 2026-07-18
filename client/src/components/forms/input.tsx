import { InputHTMLAttributes, forwardRef, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText && !error ? `${inputId}-helper` : undefined;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={errorId ?? helperId}
          className={`
            w-full px-3 py-2 text-sm bg-white dark:bg-secondary-900
            border border-secondary-200 dark:border-secondary-700 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all duration-200
            placeholder:text-secondary-400 dark:placeholder:text-secondary-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-error-500 focus:ring-error-500' : ''}
            ${className}
          `.trim()}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-secondary-500 dark:text-secondary-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;









// import { InputHTMLAttributes, forwardRef } from 'react';

// interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   error?: string;
//   helperText?: string;
// }

// const Input = forwardRef<HTMLInputElement, InputProps>(
//   ({ label, error, helperText, className = '', ...props }, ref) => {
//     return (
//       <div className="space-y-1.5">
//         {label && (
//           <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
//             {label}
//           </label>
//         )}
//         <input
//           ref={ref}
//           className={`
//             w-full px-3 py-2 text-sm bg-white dark:bg-secondary-900
//             border border-secondary-200 dark:border-secondary-700 rounded-lg
//             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
//             transition-all duration-200
//             placeholder:text-secondary-400 dark:placeholder:text-secondary-500
//             ${error ? 'border-error-500 focus:ring-error-500' : ''}
//             ${className}
//           `}
//           {...props}
//         />
//         {error && <p className="text-sm text-error-600 dark:text-error-400">{error}</p>}
//         {helperText && !error && (
//           <p className="text-sm text-secondary-500 dark:text-secondary-400">{helperText}</p>
//         )}
//       </div>
//     );
//   }
// );

// Input.displayName = 'Input';

// export default Input