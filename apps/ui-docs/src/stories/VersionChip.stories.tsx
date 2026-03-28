import type { Meta, StoryObj } from "@storybook/react";
import { VersionChip } from "design-system";

const meta: Meta<typeof VersionChip> = {
  title: "VersionChip",
  component: VersionChip,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof VersionChip>;

export const Default: Story = {
  args: { version: "1.2.3" },
};

export const Beta: Story = {
  args: { version: "1.2.3", variant: "beta" },
};
