"use client";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";
import { If } from "../if";
import { CircleX } from "lucide-react";

type InputProps = {
  id: string;
  label: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  errors?: string[];
  helper?: string[];
  variant?: "ghost" | "outline";
} & InputHTMLAttributes<HTMLInputElement>;
export function Input({
  label,
  leadingIcon,
  trailingIcon,
  errors,
  helper,
  variant = "outline",
  className,
  ...props
}: InputProps) {
  const hasError = !!errors?.length;
  return (
    <div className={cn("grid gap-1 font-p-2 text-neutral-950", className)}>
      {variant === "outline" ? <label htmlFor={props.id}>{label}</label> : null}
      <div
        data-disabled={props.disabled}
        className="[&_svg:not([class*='size-'])]:size-5 relative data-[disabled=true]:text-neutral-400"
      >
        <If condition={!!leadingIcon}>
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {leadingIcon}
          </div>
        </If>
        <input
          {...props}
          data-leading={!!leadingIcon}
          data-trailing={!!trailingIcon}
          data-error={hasError}
          className={cn(
            "font-medium w-full px-3 py-2 rounded-lg data-[leading=true]:pl-11 data-[trailing=true]:pr-11",
            variant === "outline" &&
              "outline outline-neutral-600 focus-visible:outline-2 hover:outline-2 data-[error=true]:outline-red disabled:outline-neutral-500 disabled:bg-neutral-100 disabled:outline-1",
            variant === "ghost" &&
              "focus-visible:outline-2 focus-visible:outline-primary disabled:outline-none",
          )}
        />
        <If condition={!!trailingIcon}>
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {trailingIcon}
          </div>
        </If>
      </div>
      <If condition={hasError}>
        <ul className="grid gap-1">
          {errors?.map((err) => (
            <li
              key={err}
              className="text-red font-p-3 inline-flex gap-1 items-center"
            >
              <CircleX className="size-4" /> {err}
            </li>
          ))}
        </ul>
      </If>
      <If condition={!!helper?.length}>
        <ul className="grid gap-1">
          {helper?.map((help) => (
            <li
              key={help}
              className="text-neutral-600 font-p-3 inline-flex gap-1 items-center"
            >
              {help}
            </li>
          ))}
        </ul>
      </If>
    </div>
  );
}
