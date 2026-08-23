"use client";

import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import * as React from "react";
import { Input } from "./input";

function Command({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      ref={ref}
      className={cn("flex size-full flex-col overflow-hidden", className)}
      {...props}
    />
  );
}

Command.displayName = CommandPrimitive.displayName;

function CommandInput({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input> & {
  id: string;
}) {
  return (
    <Input
      ref={ref}
      variant="ghost"
      label=""
      leadingIcon={<Search />}
      className={className}
      {...props}
      asChild
    >
      <CommandPrimitive.Input />
    </Input>
  );
}

CommandInput.displayName = CommandPrimitive.Input.displayName;

function CommandList({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      ref={ref}
      className={cn("max-h-75 overflow-y-auto overflow-x-hidden", className)}
      {...props}
    />
  );
}

CommandList.displayName = CommandPrimitive.List.displayName;

function CommandEmpty({
  ref,
  className,
  ...props
}: Omit<React.ComponentProps<typeof CommandPrimitive.Empty>, "asChild">) {
  return (
    <CommandPrimitive.Empty
      ref={ref}
      {...props}
      className={cn(
        "min-h-11 text-center font-ui-6 text-neutral-1000 grid items-center",
        className,
      )}
    />
  );
}

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

function CommandGroup(
  props: React.ComponentProps<typeof CommandPrimitive.Group>,
) {
  return <CommandPrimitive.Group {...props} />;
}
CommandGroup.displayName = CommandPrimitive.Group.displayName;

function CommandItem({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      ref={ref}
      className={cn(
        " text-start rounded-sm p-3 min-h-11 text-neutral-950 font-ui-6",
        "focus-visible:bg-primary-200 focus-visible:outline focus-visible:outline-primary",
        "data-[active=true]:bg-primary-200 data-[active=true]:outline data-[active=true]:outline-primary",
        "data-[selected=true]:bg-primary-200 data-[selected=true]:outline data-[selected=true]:outline-primary",
        className,
      )}
      {...props}
    />
  );
}

CommandItem.displayName = CommandPrimitive.Item.displayName;

export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
};
