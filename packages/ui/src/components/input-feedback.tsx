import * as React from "react";
import { CircleAlert, CircleX } from "lucide-react-native";
import { Text, View } from "react-native-css/components";

import { cn } from "../lib/utils";

export type InputFeedbackProps = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  errorIcon?: boolean;
  errors?: string[];
  helper?: string[];
};

function InputFeedback({
  children,
  className,
  disabled = false,
  errorIcon = false,
  errors,
  helper,
}: InputFeedbackProps) {
  return (
    <View className={cn("grid gap-1", className)}>
      {children}
      {errors?.map((error) => {
        const errorColor = disabled ? "text-neutral-400" : "text-red";

        return errorIcon ? (
          <View className="flex gap-1 items-start flex-row" key={error}>
            <CircleX className={cn(errorColor, "mt-0.5")} size={16} />
            <Text className={cn("font-medium font-p2", errorColor)}>
              {error}
            </Text>
          </View>
        ) : (
          <Text
            key={error}
            className={cn("font-medium font-p2", errorColor)}
          >
            {error}
          </Text>
        );
      })}
      {helper?.map((help) => (
        <View className="flex gap-1 items-start flex-row" key={help}>
          <CircleAlert className="text-primary mt-0.5" size={16} />
          <Text className="font-p-2 font-normal text-neutral-800">
            {help}
          </Text>
        </View>
      ))}
    </View>
  );
}

export { InputFeedback };
