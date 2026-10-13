import * as React from "react";
import { ChevronDown, Search } from "lucide-react-native";
import { findNodeHandle, Platform, UIManager } from "react-native";
import { Pressable, Text, TextInput, View } from "react-native-css/components";

import { cn } from "../lib/utils";
import { colors } from "../theme";
import { Input, type InputProps } from "./input";
import { DropdownPortal } from "./dropdown-portal";

export interface DropdownOption<T> {
  value: T;
  label: React.ReactNode;
}

export type DropdownProps<T> = {
  options: Array<DropdownOption<T>>;
  value: T;
  onChange?: (value: T) => void;
  valueMapper?: (value: T) => React.ReactNode;
  search?: boolean;
  noResultsText?: string;
  clearValueOnSelect?: boolean;
  container?: Element | null;
  "data-tid"?: string;
  popupLabel: string;
} & Omit<InputProps, "value" | "onChange" | "active" | "children" | "asChild">;

function getOptionLabel<T>(option: DropdownOption<T>): string {
  return typeof option.label === "string" || typeof option.label === "number"
    ? String(option.label)
    : "";
}

function Dropdown<T>({
  "data-tid": dataTid,
  clearValueOnSelect = false,
  className,
  container,
  noResultsText = "Sem resultados",
  onChange,
  options,
  popupLabel,
  search = false,
  value,
  valueMapper = (nextValue) =>
    options.find((option) => option.value === nextValue)?.label ??
    String(nextValue),
  ...props
}: DropdownProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [anchorRect, setAnchorRect] = React.useState<{
    bottom: number;
    left: number;
    width: number;
  } | null>(null);
  const triggerRef = React.useRef<React.ElementRef<typeof Pressable>>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const optionRefs = React.useRef<
    Record<string, React.ElementRef<typeof Pressable> | null>
  >({});
  const [focusedOptionIndex, setFocusedOptionIndex] = React.useState(-1);
  const isDisabled = Boolean(props.disabled);
  const isWeb = Platform.OS === "web";
  const anchorId = `dropdown-trigger-${props.id}`;
  const filteredOptions = searchValue.trim()
    ? options.filter((option) =>
        getOptionLabel(option)
          .toLocaleLowerCase()
          .includes(searchValue.trim().toLocaleLowerCase()),
      )
    : options;

  const close = () => {
    setOpen(false);
    setIsClosing(true);
    setSearchValue("");
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setIsClosing(false);
      setAnchorRect(null);
      closeTimer.current = null;
    }, 150);
    if (isWeb) {
      window.requestAnimationFrame(() => triggerRef.current?.focus?.());
    }
  };

  const toggleOpen = () => {
    if (open) {
      close();
      return;
    }

    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsClosing(false);
    setAnchorRect(null);
    setOpen(true);
  };

  React.useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      if (isWeb) {
        const element = document.getElementById(anchorId);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        setAnchorRect({
          bottom: rect.bottom + 8,
          left: rect.left,
          width: rect.width,
        });
        return;
      }

      const node = findNodeHandle(triggerRef.current);
      if (node == null) return;

      UIManager.measureInWindow(node, (left, top, width, height) => {
        setAnchorRect({
          bottom: top + height + 8,
          left,
          width,
        });
      });
    };

    updatePosition();
    if (isWeb) {
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
    }

    return () => {
      if (isWeb) {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      }
    };
  }, [anchorId, isWeb, open]);

  React.useEffect(() => {
    if (!isWeb || !open || !anchorRect) return;

    const selectedKey = String(
      options.find((option) => option.value === value)?.value ??
        filteredOptions[0]?.value,
    );
    const selectedIndex = filteredOptions.findIndex(
      (option) => String(option.value) === selectedKey,
    );
    setFocusedOptionIndex(selectedIndex);
    const focusFrame = window.requestAnimationFrame(() => {
      optionRefs.current[selectedKey]?.focus?.();
    });

    return () => window.cancelAnimationFrame(focusFrame);
  }, [anchorRect, filteredOptions, isWeb, open, options, value]);

  const selectOption = (option: DropdownOption<T>) => {
    if (option.value === value) {
      if (clearValueOnSelect) {
        onChange?.(null as T);
        close();
      }
      return;
    }

    onChange?.(option.value);
    close();
  };

  React.useEffect(() => {
    if (!isWeb) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = document.getElementById(anchorId);
      const isTrigger = target === trigger || trigger?.contains(target);
      const isSearchInput = target?.tagName === "INPUT";

      if (!open) {
        if (isTrigger && event.key === "ArrowDown") {
          event.preventDefault();
          setOpen(true);
        }
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (isSearchInput) return;

      if (event.key === "Enter" && focusedOptionIndex >= 0) {
        event.preventDefault();
        const option = filteredOptions[focusedOptionIndex];
        if (option) selectOption(option);
        return;
      }

      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        return;
      }

      event.preventDefault();
      if (!filteredOptions.length) return;

      const nextIndex =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? filteredOptions.length - 1
            : event.key === "ArrowDown"
              ? (focusedOptionIndex + 1) % filteredOptions.length
              : (focusedOptionIndex - 1 + filteredOptions.length) %
                filteredOptions.length;

      setFocusedOptionIndex(nextIndex);
      const nextKey = String(filteredOptions[nextIndex]?.value);
      window.requestAnimationFrame(() => {
        optionRefs.current[nextKey]?.focus?.();
      });
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    anchorId,
    close,
    filteredOptions,
    focusedOptionIndex,
    isWeb,
    open,
    selectOption,
  ]);

  return (
    <View className={cn("relative", className)} nativeID={dataTid}>
      <Input
        {...props}
        asChild
        active={open}
        disabled={isDisabled}
        label={props.label}
        trailingIcon={
          <View
            className={cn(
              "size-6 transition-transform duration-200",
              open && "rotate-180",
              isDisabled ? "text-neutral-300" : "text-neutral-900",
            )}
          >
            <ChevronDown color={isDisabled ? colors.neutral[300] : colors.neutral[900]} size={24} />
          </View>
        }
      >
        <Pressable
          accessibilityLabel={props.label}
          accessibilityRole="combobox"
          accessibilityState={{ disabled: isDisabled, expanded: open }}
          className="text-start"
          disabled={isDisabled}
          nativeID={anchorId}
          onPress={toggleOpen}
          ref={triggerRef}
        >
          <Text className="font-p-2 font-medium" numberOfLines={1}>
            {valueMapper(value)}
          </Text>
        </Pressable>
      </Input>
      {(open || isClosing) && anchorRect ? (
        <DropdownPortal
          contentStyle={
            anchorRect
              ? {
                  left: anchorRect.left,
                  position: isWeb ? "fixed" : "absolute",
                  top: anchorRect.bottom,
                  width: anchorRect.width,
                }
              : undefined
          }
          container={container}
          onDismiss={close}
        >
          <View
            accessibilityLabel={popupLabel}
            accessibilityRole="menu"
            className={cn(
              "z-50 duration-150 rounded-lg border border-neutral-100 bg-neutral-0 px-1 py-2 shadow-2",
              open
                ? "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
                : "animate-out fade-out-0 zoom-out-95 slide-out-to-top-2",
            )}
            nativeID={dataTid ? `${dataTid}-dropdown-content` : undefined}
          >
          {search ? (
            <View className="relative mb-1">
              <Search
                color={colors.neutral[600]}
                size={20}
                style={{ position: "absolute", left: 12, top: 10, zIndex: 1 }}
              />
              <TextInput
                accessibilityLabel="Search"
                className="w-full rounded-lg px-3 py-2 pl-11 font-p-2 text-neutral-950 outline outline-neutral-600 focus-visible:outline-2"
                onChangeText={setSearchValue}
                placeholderTextColor={colors.neutral[300]}
                value={searchValue}
              />
            </View>
          ) : null}
            <View className="gap-1">
            {filteredOptions.length ? (
              filteredOptions.map((option) => {
                const selected = option.value === value;

                return (
                  <Pressable
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected }}
                    className={cn(
                      "min-h-11 rounded-sm p-3 font-ui-6 text-neutral-950",
                      "focus-visible:bg-primary-200 focus-visible:outline focus-visible:outline-primary",
                      selected && "bg-primary-200 outline outline-primary",
                    )}
                    key={String(option.value)}
                    onPress={() => selectOption(option)}
                    ref={(element) => {
                      optionRefs.current[String(option.value)] = element;
                    }}
                  >
                    {typeof option.label === "string" ||
                    typeof option.label === "number" ? (
                      <Text className="font-ui-6 text-neutral-950">
                        {option.label}
                      </Text>
                    ) : (
                      option.label
                    )}
                  </Pressable>
                );
              })
            ) : (
              <Text className="min-h-11 py-3 text-center font-ui-6 text-neutral-1000">
                {noResultsText}
              </Text>
            )}
            </View>
          </View>
        </DropdownPortal>
      ) : null}
    </View>
  );
}

export { Dropdown };
