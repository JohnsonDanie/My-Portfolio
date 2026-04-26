import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
        <input
          ref={ref}
          className={`w-full bg-[#050c1a] border border-indigo-500/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
      </div>
    );
  }
);
FormInput.displayName = 'FormInput';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
        <textarea
          ref={ref}
          className={`w-full bg-[#050c1a] border border-indigo-500/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors resize-y ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
      </div>
    );
  }
);
FormTextarea.displayName = 'FormTextarea';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
        <select
          ref={ref}
          className={`w-full bg-[#050c1a] border border-indigo-500/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
      </div>
    );
  }
);
FormSelect.displayName = 'FormSelect';
