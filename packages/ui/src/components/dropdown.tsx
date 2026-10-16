import * as React from "react";
import { Check, ChevronDown } from "lucide-react-native";
import { findNodeHandle, Platform, UIManager } from "react-native";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native-css/components";

import { cn } from "../lib/utils";
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
  const inputContainerRef = React.useRef<React.ElementRef<typeof View>>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const optionRefs = React.useRef<
    Record<string, React.ElementRef<typeof Pressable> | null>
  >({});
  const [focusedOptionIndex, setFocusedOptionIndex] = React.useState(-1);
  const isDisabled = Boolean(props.disabled);
  const isWeb = Platform.OS === "web";
  const anchorId = `dropdown-trigger-${props.id}`;
  const isSearchInputVisible = search && open;
  const searchInputRef = React.useRef<React.ElementRef<typeof TextInput>>(null);
  const selectedOption = options.find((option) => option.value === value);
  const [priorityOptionValue, setPriorityOptionValue] = React.useState(value);
  const orderedOptions = React.useMemo(() => {
    const priorityOption = options.find(
      (option) => option.value === priorityOptionValue,
    );

    return priorityOption
      ? [
          priorityOption,
          ...options.filter((option) => option.value !== priorityOptionValue),
        ]
      : options;
  }, [options, priorityOptionValue]);
  const filteredOptions = React.useMemo(
    () =>
      searchValue.trim()
        ? orderedOptions.filter((option) =>
            getOptionLabel(option)
              .toLocaleLowerCase()
              .includes(searchValue.trim().toLocaleLowerCase()),
          )
        : orderedOptions,
    [orderedOptions, searchValue],
  );

  React.useEffect(() => {
    if (open || isClosing) return;

    setPriorityOptionValue(value);
  }, [isClosing, open, value]);

  const close = () => {
    if (isWeb) {
      document.getElementById(anchorId)?.blur();
    } else {
      searchInputRef.current?.blur?.();
    }
    setOpen(false);
    setIsClosing(true);
    setSearchValue("");
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setIsClosing(false);
      setAnchorRect(null);
      closeTimer.current = null;
    }, 150);
  };

  const openDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsClosing(false);
    setAnchorRect(null);
    setSearchValue("");
    setOpen(true);
  };

  const toggleOpen = () => {
    if (open) {
      close();
      return;
    }

    openDropdown();
  };

  React.useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      if (isWeb) {
        const element = document.getElementById(`${props.id}-container`);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        setAnchorRect({
          bottom: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
        });
        return;
      }

      const node = findNodeHandle(
        inputContainerRef.current ??
          (isSearchInputVisible ? searchInputRef.current : triggerRef.current),
      );
      if (node == null) return;

      UIManager.measureInWindow(node, (left, top, width, height) => {
        setAnchorRect({
          bottom: top + height + 4,
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
      selectedOption?.value ?? filteredOptions[0]?.value,
    );
    const selectedIndex = filteredOptions.findIndex(
      (option) => String(option.value) === selectedKey,
    );
    setFocusedOptionIndex(
      selectedIndex >= 0 ? selectedIndex : filteredOptions.length ? 0 : -1,
    );
    const focusFrame = window.requestAnimationFrame(() => {
      if (isSearchInputVisible) {
        searchInputRef.current?.focus?.();
      } else {
        optionRefs.current[selectedKey]?.focus?.();
      }
    });

    return () => window.cancelAnimationFrame(focusFrame);
  }, [
    anchorRect,
    filteredOptions,
    isSearchInputVisible,
    isWeb,
    open,
    options,
    selectedOption,
    value,
  ]);

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

  const handleSearchKeyPress = (key: string) => {
    if (key === "Escape") {
      close();
      return;
    }

    if (key === "Enter") {
      const option = filteredOptions[focusedOptionIndex];
      if (option) selectOption(option);
      return;
    }

    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) return;
    if (!filteredOptions.length) return;

    const nextIndex =
      key === "Home"
        ? 0
        : key === "End"
          ? filteredOptions.length - 1
          : key === "ArrowDown"
            ? (focusedOptionIndex + 1 + filteredOptions.length) %
              filteredOptions.length
            : (focusedOptionIndex - 1 + filteredOptions.length) %
              filteredOptions.length;

    setFocusedOptionIndex(nextIndex);
  };

  React.useEffect(() => {
    if (!isWeb) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = document.getElementById(anchorId);
      const searchInput = document.getElementById(anchorId);
      const isTrigger = target === trigger || trigger?.contains(target);
      const isSearchInput = target === searchInput;

      if (!open) {
        if (isTrigger && event.key === "ArrowDown") {
          event.preventDefault();
          openDropdown();
        }
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      // Search input handles its keyboard events directly through TextInput's
      // onKeyPress, which is reliable across React Native Web implementations.
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
      if (!isSearchInput) {
        window.requestAnimationFrame(() => {
          optionRefs.current[nextKey]?.focus?.();
        });
      }
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
    openDropdown,
  ]);

  return (
    <View className={cn("relative", className)} nativeID={dataTid}>
      <Input
        {...props}
        asChild
        containerRef={inputContainerRef}
        active={open}
        value={String(value ?? "")}
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
            <ChevronDown
              className={isDisabled ? "text-neutral-300" : "text-neutral-900"}
              size={24}
            />
          </View>
        }
      >
        {isSearchInputVisible ? (
          <TextInput
            accessibilityLabel={props.label}
            accessibilityRole="combobox"
            accessibilityState={{ disabled: isDisabled, expanded: open }}
            autoFocus
            className="w-full font-p-2 font-medium text-neutral-950 outline-none"
            editable={!isDisabled}
            nativeID={anchorId}
            onChangeText={setSearchValue}
            onKeyPress={(event) => handleSearchKeyPress(event.nativeEvent.key)}
            ref={searchInputRef}
            selectTextOnFocus
            value={searchValue}
          />
        ) : (
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
            <Text
              className={cn(
                "font-medium font-p-1",
                isDisabled ? "text-neutral-400" : "text-neutral-950",
              )}
              numberOfLines={1}
            >
              {valueMapper(value)}
            </Text>
          </Pressable>
        )}
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
              "z-50 overflow-hidden rounded-lg border border-neutral-400 bg-white shadow-2 duration-150",
              open
                ? "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
                : "animate-out fade-out-0 zoom-out-95 slide-out-to-top-2",
            )}
            nativeID={dataTid ? `${dataTid}-dropdown-content` : undefined}
          >
            <ScrollView className="max-h-56.5">
              {filteredOptions.length ? (
                filteredOptions.map((option, index) => {
                  const selected = option.value === value;
                  const focused = index === focusedOptionIndex;

                  return (
                    <Pressable
                      accessibilityRole="menuitem"
                      accessibilityState={{ selected }}
                      className={cn(
                        "h-14 shrink-0 flex-row items-center justify-between px-4 font-normal font-p-1 text-black hover:bg-primary-100 focus-visible:bg-primary-100 focus-visible:outline-none",
                        index < filteredOptions.length - 1 &&
                          "border-b border-neutral-300",
                        (selected || focused) && "bg-primary-100",
                      )}
                      key={String(option.value)}
                      onPress={() => selectOption(option)}
                      ref={(element) => {
                        optionRefs.current[String(option.value)] = element;
                      }}
                    >
                      {typeof option.label === "string" ||
                      typeof option.label === "number" ? (
                        <Text className="font-normal font-p-1 text-black">
                          {option.label}
                        </Text>
                      ) : (
                        option.label
                      )}
                      {selected ? (
                        <Check className="text-black" size={24} />
                      ) : null}
                    </Pressable>
                  );
                })
              ) : (
                <View className="h-14 shrink-0 items-center justify-center px-4">
                  <Text className="text-center font-normal font-p-1 text-black">
                    {noResultsText}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </DropdownPortal>
      ) : null}
    </View>
  );
}

export { Dropdown };
