import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Home, Settings, Users } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { MainCardButton } from "./main-card-button";

const meta = {
  title: "UI/Buttons/MainCardButton",
  component: MainCardButton,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    asChild: { table: { disable: true } },
  },
  args: {
    disabled: false,
  },
} satisfies Meta<typeof MainCardButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <MainCardButton {...args} accessibilityLabel="Home">
      <Home />
      Home
    </MainCardButton>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <MainCardButton {...args} accessibilityLabel="Home">
      <Home />
      Home
    </MainCardButton>
  ),
};

export const Grid: Story = {
  render: (args) => (
    <View style={styles.grid}>
      <MainCardButton {...args} accessibilityLabel="Home">
        <Home />
        Home
      </MainCardButton>
      <MainCardButton
        {...args}
        accessibilityLabel="Residents"
      >
        <Users />
        Residents
      </MainCardButton>
      <MainCardButton
        {...args}
        accessibilityLabel="Settings"
      >
        <Settings />
        Settings
      </MainCardButton>
    </View>
  ),
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    gap: 12,
    width: 384,
  },
});
