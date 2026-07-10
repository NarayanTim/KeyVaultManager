import React, { ReactNode } from 'react'

interface BadgeProps {
    children: ReactNode;
    variant?: 'success' | 'warning' | 'error' | 'secondary' | 'primary';
    size?: 'sm' | 'md';
}

const Badge = ({ children, variant = 'secondary', size = 'md' }: BadgeProps) => {
  const variants = {
    success: 'bg-success-100 text-success-800 dark:bg-success-900/50 dark:text-success-300',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/50 dark:text-warning-300',
    error: 'bg-error-100 text-error-800 dark:bg-error-900/50 dark:text-error-300',
    secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-300',
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}

export default Badge