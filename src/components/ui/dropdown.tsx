import { ReactNode, useState } from "react";
import { Combobox, Option } from "./combobox";
import { Input, InputProps } from "./input";
import { useResponsiveElementSize } from "@/hooks/responsive-element-size";
import { ChevronDown } from "lucide-react";

type DropdownProps<T> = {
  options: Array<Option<T>>;
  value: T;
  onChange?: (value: T) => void;
  valueMapper?: (value: T) => string | ReactNode;
  search?: boolean;
  noResultsText?: string;
  clearValueOnSelect?: boolean;
  "data-tid"?: string;
  popupLabel: string;
} & Omit<InputProps, "value" | "onChange" | "active">;

export function Dropdown<T>({
  onChange,
  options,
  value,
  className,
  search,
  valueMapper = (v) => options.find((vl) => vl.value === v)?.label ?? String(v),
  noResultsText = "Sem resultados",
  clearValueOnSelect = false,
  "data-tid": dataTid,
  popupLabel,
  ...props
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const { ref, width } = useResponsiveElementSize<HTMLInputElement>();
  return (
    <Combobox
      data-tid={dataTid}
      onChange={onChange ?? (() => void 0)}
      options={options}
      value={value}
      contentWidth={width}
      search={search}
      open={open}
      noResultsText={noResultsText}
      clearValueOnSelect={clearValueOnSelect}
      setOpen={setOpen}
      aria-label={popupLabel}
    >
      <Input
        {...props}
        data-tid={dataTid}
        ref={ref}
        className={className}
        asChild
        value={value as string}
        active={open}
        trailingIcon={
          <div
            data-active={open}
            data-disabled={props.disabled}
            className="size-6 text-neutral-900 transition-transform duration-200 data-[active=true]:rotate-180 data-[disabled=true]:text-neutral-300"
          >
            <ChevronDown className="size-6" />
          </div>
        }
      >
        <button type="button" className="text-start">
          {valueMapper(value)}
        </button>
      </Input>
    </Combobox>
  );
}
