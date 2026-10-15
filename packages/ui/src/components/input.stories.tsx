import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Mail, Search } from "lucide-react-native";
import { Text, View } from "react-native-css/components";

import { Input } from "./input";

const meta = {
  title: "UI/Inputs/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["outline"],
    },
    disabled: { control: "boolean" },
    size: {
      control: "select",
      options: ["default", "lg"],
    },
  },
  args: {
    id: "input",
    label: "Label",
    variant: "outline",
    disabled: false,
    placeholder: "Placeholder",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLeadingIcon: Story = {
  args: { leadingIcon: <Mail /> },
};

export const WithTrailingIcon: Story = {
  args: { trailingIcon: <Search /> },
};

export const WithBothIcons: Story = {
  args: { leadingIcon: <Mail />, trailingIcon: <Search /> },
};

export const WithHelper: Story = {
  args: { helper: ["This is a helper message."] },
};

export const WithError: Story = {
  args: { errors: ["This field is required."] },
};

export const WithMultipleErrors: Story = {
  args: {
    errors: ["This field is required.", "Must be at least 8 characters."],
  },
};

export const WithValue: Story = {
  args: { defaultValue: "user@example.com" },
};

export const ValueWithoutPlaceholder: Story = {
  args: {
    placeholder: undefined,
    defaultValue: "user@example.com",
  },
};

export const WithIconAndError: Story = {
  args: {
    leadingIcon: <Mail />,
    errors: ["Invalid email address."],
  },
};

export const WithIconAndHelper: Story = {
  args: {
    leadingIcon: <Mail />,
    helper: ["We'll never share your email."],
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledWithValue: Story = {
  args: { disabled: true, defaultValue: "Readonly value" },
};

export const DisabledWithIcon: Story = {
  args: {
    disabled: true,
    leadingIcon: <Mail />,
    defaultValue: "user@example.com",
  },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const AllSizes: Story = {
  render: (args) => (
    <View className="gap-4">
      {(["default", "lg"] as const).map((size) => (
        <Input
          key={size}
          {...args}
          id={size}
          label={size === "default" ? "Default" : "Large"}
          size={size}
        />
      ))}
    </View>
  ),
};

const errorIconCombinations = [
  { name: "No icons", leadingIcon: undefined, trailingIcon: undefined },
  { name: "Leading icon", leadingIcon: <Mail />, trailingIcon: undefined },
  { name: "Trailing icon", leadingIcon: undefined, trailingIcon: <Search /> },
  { name: "Both icons", leadingIcon: <Mail />, trailingIcon: <Search /> },
];

const errorStateCombinations = [
  { name: "Error", disabled: false, helper: false },
  { name: "Error + helper", disabled: false, helper: true },
  { name: "Disabled + error", disabled: true, helper: false },
  { name: "Disabled + error + helper", disabled: true, helper: true },
];

export const ErrorCombinations: Story = {
  render: (args) => (
    <View className="flex-row flex-wrap gap-6">
      {errorIconCombinations.flatMap((icons) =>
        errorStateCombinations.map((state) => {
          const id = `${icons.name}-${state.name}`
            .toLowerCase()
            .replaceAll(" ", "-")
            .replaceAll("+", "and");

          return (
            <View className="w-80 gap-2" key={id}>
              <Text className="font-p-2 font-medium text-neutral-700">
                {icons.name} / {state.name}
              </Text>
              <Input
                {...args}
                id={id}
                label="Email address"
                defaultValue="invalid-email"
                leadingIcon={icons.leadingIcon}
                trailingIcon={icons.trailingIcon}
                disabled={state.disabled}
                errors={["Enter a valid email address."]}
                helper={state.helper ? ["Use the address linked to your account."] : undefined}
              />
            </View>
          );
        }),
      )}
    </View>
  ),
};
