import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Mail, Search } from "lucide-react-native";
import { Text, View } from "react-native-css/components";

import { TextArea } from "./text-area";

const meta = {
  title: "UI/Inputs/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  argTypes: {
    resize: {
      control: "select",
      options: ["none", "both", "horizontal", "vertical"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    id: "textarea",
    label: "Label",
    variant: "outline",
    resize: "none",
    disabled: false,
    placeholder: "Placeholder",
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ResizeVertical: Story = {
  args: { resize: "vertical" },
};

export const ResizeHorizontal: Story = {
  args: { resize: "horizontal" },
};

export const ResizeBoth: Story = {
  args: { resize: "both" },
};

export const WithValue: Story = {
  args: {
    defaultValue:
      "This is a longer text that spans multiple lines.\nLine two here.",
  },
};

export const ValueWithoutPlaceholder: Story = {
  args: {
    placeholder: undefined,
    defaultValue: "This is a longer text that spans multiple lines.\nLine two here.",
  },
};

export const Active: Story = {
  args: { active: true },
};

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
  args: { helper: ["Maximum 500 characters."] },
};

export const WithError: Story = {
  args: { errors: ["This field is required."] },
};

export const WithMultipleErrors: Story = {
  args: {
    errors: ["This field is required.", "Must be at least 20 characters."],
  },
};

export const WithIconAndError: Story = {
  args: {
    leadingIcon: <Mail />,
    errors: ["Invalid input."],
  },
};

export const WithIconAndHelper: Story = {
  args: {
    leadingIcon: <Mail />,
    helper: ["Describe your issue in detail."],
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledWithValue: Story = {
  args: { disabled: true, defaultValue: "This content is read-only." },
};

export const DisabledWithError: Story = {
  args: { disabled: true, errors: ["This field is required."] },
};

export const ErrorAndHelper: Story = {
  args: {
    errors: ["Enter a valid description."],
    helper: ["Include enough detail to help us understand the issue."],
  },
};

export const DisabledWithErrorAndHelper: Story = {
  args: {
    disabled: true,
    errors: ["Enter a valid description."],
    helper: ["Include enough detail to help us understand the issue."],
  },
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
              <TextArea
                {...args}
                id={id}
                label="Description"
                defaultValue="A short description"
                leadingIcon={icons.leadingIcon}
                trailingIcon={icons.trailingIcon}
                disabled={state.disabled}
                errors={["Enter a valid description."]}
                helper={state.helper ? ["Add a little more detail about this issue."] : undefined}
              />
            </View>
          );
        }),
      )}
    </View>
  ),
};
