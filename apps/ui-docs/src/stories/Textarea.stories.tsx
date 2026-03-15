import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "design-system";

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "Enter text…",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "Some content",
    readOnly: true,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled",
    disabled: true,
  },
};
