import { type Key, type ReactNode } from "react";
import { Command as CommandPrimitive } from "cmdk";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";

// const offset = 8;

export interface Option<T> {
  value: T;
  label: ReactNode;
}

interface ComboboxProps<T> {
  options: Array<Option<T>>;
  value: T;
  onChange: (value: T) => void;
  children: ReactNode;
  search?: boolean;
  contentWidth?: number;
  className?: string;
  open: boolean;
  noResultsText?: string;
  setOpen: (open: boolean) => void;
  clearValueOnSelect?: boolean;
  alignOffset?: number;
  sideOffset?: number;
  "data-tid"?: string;
  "aria-label"?: string;
}

function Combobox<T>({
  onChange,
  options,
  value,
  children,
  search = false,
  contentWidth,
  className,
  open,
  setOpen,
  noResultsText,
  clearValueOnSelect = false,
  alignOffset,
  sideOffset = 8,
  "data-tid": dataTid,
  "aria-label": ariaLabel,
}: Readonly<ComboboxProps<T>>) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild role="combobox" aria-expanded={open}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        style={{ width: contentWidth }}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        align="start"
        data-tid={dataTid ? `${dataTid}-dropdown-content` : undefined}
        aria-label={ariaLabel}
      >
        <Command className={cn(className)}>
          {search ? (
            <CommandInput
              id={null as unknown as string}
              className="w-full p-0.5"
            />
          ) : (
            <></>
          )}
          <CommandList>
            {search ? <CommandEmpty>{noResultsText}</CommandEmpty> : <></>}
            <CommandGroup className="*:[[cmdk-group-items]]:-mt-1 *:[[cmdk-group-items]]:grid *:[[cmdk-group-items]]:gap-1 *:[[cmdk-group-items]]:px-0.5 *:[[cmdk-group-items]]:py-0.5">
              <CommandPrimitive.Item
                style={{ height: 0, overflow: "hidden", padding: 0, margin: 0 }}
                aria-hidden="true"
                tabIndex={-1}
              >
                hidden item to prevent cmdk from preselecting the first item
              </CommandPrimitive.Item>
              {options.map((option) => (
                <CommandItem
                  asChild
                  data-active={option.value === value}
                  key={option.value as Key}
                  onSelect={() => {
                    if (option.value === value) {
                      if (clearValueOnSelect) {
                        onChange(null as unknown as T);
                        setOpen(false);
                      }
                      return;
                    }
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <button type="button">{option.label}</button>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
