import { useState, type ReactNode } from 'react';

interface FormInputProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel';
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}

export function FormInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  required,
  placeholder,
  autoComplete,
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
        {label} {required && <span className="text-orange-400">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl bg-navy-800/60 border px-4 py-3 text-white placeholder-slate-500 transition-colors duration-200 focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500/60 focus:ring-red-500/30'
            : 'border-electric-500/20 focus:border-orange-500/50 focus:ring-orange-500/20'
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface FormTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}

export function FormTextarea({
  id,
  label,
  value,
  onChange,
  error,
  required,
  placeholder,
  rows = 4,
}: FormTextareaProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
        {label} {required && <span className="text-orange-400">*</span>}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl bg-navy-800/60 border px-4 py-3 text-white placeholder-slate-500 transition-colors duration-200 focus:outline-none focus:ring-2 resize-none ${
          error
            ? 'border-red-500/60 focus:ring-red-500/30'
            : 'border-electric-500/20 focus:border-orange-500/50 focus:ring-orange-500/20'
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface FormSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
  required?: boolean;
}

export function FormSelect({
  id,
  label,
  value,
  onChange,
  options,
  error,
  required,
}: FormSelectProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
        {label} {required && <span className="text-orange-400">*</span>}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl bg-navy-800/60 border px-4 py-3 text-white transition-colors duration-200 focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500/60 focus:ring-red-500/30'
            : 'border-electric-500/20 focus:border-orange-500/50 focus:ring-orange-500/20'
        }`}
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-navy-800">
            {o}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface CheckboxProps {
  id: string;
  label: ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  required?: boolean;
}

export function Checkbox({ id, label, checked, onChange, error, required }: CheckboxProps) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 w-5 h-5 rounded border-electric-500/30 bg-navy-800/60 text-orange-500 focus:ring-orange-500/40 focus:ring-2"
        />
        <label htmlFor={id} className="text-sm text-slate-300 leading-relaxed">
          {label} {required && <span className="text-orange-400">*</span>}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-400 ml-8" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="glass rounded-2xl p-6 sm:p-8">
      <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-orange-400 mb-6">
        {title}
      </h3>
      <div className="space-y-5">{children}</div>
    </div>
  );
}
