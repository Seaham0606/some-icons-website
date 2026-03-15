import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "design-system";

const meta: Meta<typeof Label> = {
  component: Label,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: "Label",
  },
};

export const ForInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <input id="email" type="email" placeholder="you@example.com" className="border border-[var(--color-border-subtle)] rounded px-2 py-1" />
    </div>
  ),
};
