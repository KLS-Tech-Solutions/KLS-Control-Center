"use client";

import * as React from "react";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import { cn } from "@/lib/utils";
import { Field } from "@/components/ui/field";

/**
 * One place where validation behaviour is configured, so every form in the
 * app reports errors the same way: validate on blur, then re-validate on
 * every keystroke once a field has already errored.
 */
export function useZodForm<TValues extends FieldValues>(
  schema: ZodType<unknown, TValues>,
  options?: Omit<UseFormProps<TValues>, "resolver">,
): UseFormReturn<TValues> {
  return useForm<TValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as any,
    mode: "onBlur",
    reValidateMode: "onChange",
    ...options,
  });
}


export type { DefaultValues };

/**
 * Binds a Field (label + hint + error slot) to a react-hook-form field.
 * Children receive the props to spread onto the input.
 */
export function FormField<TValues extends FieldValues>({
  form,
  name,
  label,
  hint,
  required,
  className,
  children,
}: {
  form: UseFormReturn<TValues>;
  name: Path<TValues>;
  label?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: (props: {
    id: string;
    invalid: boolean;
    "aria-describedby"?: string;
  }) => React.ReactNode;
}) {
  const error = getError(form.formState.errors, name);
  const id = String(name);

  return (
    <Field
      label={label}
      htmlFor={id}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      {children({
        id,
        invalid: Boolean(error),
        "aria-describedby": error ? `${id}-error` : undefined,
      })}
    </Field>
  );
}

/** Character counter for long-form fields with a minimum length. */
export function CharacterCounter({
  value,
  min,
  max,
  className,
}: {
  value: string;
  min?: number;
  max?: number;
  className?: string;
}) {
  const length = value.trim().length;
  const short = min !== undefined && length < min;
  const over = max !== undefined && length > max;

  return (
    <p
      className={cn(
        "text-[13px] tabular-nums",
        over ? "text-danger" : short ? "text-muted" : "text-accent",
        className,
      )}
    >
      {short
        ? `${min - length} more characters needed`
        : over
          ? `${length - max} characters over the limit`
          : `${length}${max ? ` / ${max}` : ""} characters`}
    </p>
  );
}

/** Live password strength hints, matched to the register schema. */
export function PasswordRules({ value }: { value: string }) {
  const rules = [
    { label: "At least 8 characters", ok: value.length >= 8 },
    { label: "Contains a letter", ok: /[A-Za-z]/.test(value) },
    { label: "Contains a number", ok: /\d/.test(value) },
  ];

  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1">
      {rules.map((rule) => (
        <li
          key={rule.label}
          className={cn(
            "text-[13px] transition-colors",
            rule.ok ? "text-accent" : "text-muted",
          )}
        >
          {rule.ok ? "✓" : "•"} {rule.label}
        </li>
      ))}
    </ul>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getError(errors: any, name: string): string | undefined {
  const entry = name
    .split(".")
    .reduce((acc, key) => (acc ? acc[key] : undefined), errors);
  return typeof entry?.message === "string" ? entry.message : undefined;
}
