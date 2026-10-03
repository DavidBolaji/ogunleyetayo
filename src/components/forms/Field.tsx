"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { cn } from "@/lib/cn";

interface FieldShellProps {
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: (id: string) => ReactNode;
}

const controlClasses =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent";

/** Label + control wiring kept in one place so every form stays accessible. */
export function FieldShell({ label, hint, required, className, children }: FieldShellProps) {
  const id = useId();

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
        {required ? <span className="ml-1 text-accent">*</span> : null}
      </label>
      {children(id)}
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

interface TextFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "date";
  placeholder?: string;
  required?: boolean;
  hint?: string;
  className?: string;
}

export function TextField({
  label,
  name,
  type = "text",
  placeholder,
  required,
  hint,
  className,
}: TextFieldProps) {
  return (
    <FieldShell label={label} hint={hint} required={required} className={className}>
      {(id) => (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={controlClasses}
        />
      )}
    </FieldShell>
  );
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: readonly string[];
  required?: boolean;
  className?: string;
}

export function SelectField({ label, name, options, required, className }: SelectFieldProps) {
  return (
    <FieldShell label={label} required={required} className={className}>
      {(id) => (
        <select id={id} name={name} required={required} defaultValue="" className={controlClasses}>
          <option value="" disabled>
            Select one
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
}

interface TextAreaFieldProps {
  label: string;
  name: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function TextAreaField({
  label,
  name,
  rows = 5,
  placeholder,
  required,
  className,
}: TextAreaFieldProps) {
  return (
    <FieldShell label={label} required={required} className={className}>
      {(id) => (
        <textarea
          id={id}
          name={name}
          rows={rows}
          placeholder={placeholder}
          required={required}
          className={cn(controlClasses, "resize-y")}
        />
      )}
    </FieldShell>
  );
}
