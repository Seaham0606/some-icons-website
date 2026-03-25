import type { Meta, StoryObj } from "@storybook/react"
import { Input, InputSlotPlaceholder } from "design-system"

const meta: Meta<typeof Input> = {
  title: "Input",
  component: Input,
  tags: ["autodocs"],
  decorators: [
    (StoryEl) => (
      <div style={{ maxWidth: 320, width: "100%" }}>
        <StoryEl />
      </div>
    ),
  ],
  argTypes: {
    leadingSlot: { control: false },
    trailingSlot: { control: false },
    status: {
      control: "select",
      options: ["default", "success", "warning", "error"],
    },
  },
}

export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: "Placeholder",
    showLeading: false,
    showTrailing: false,
  },
}

export const WithSlots: Story = {
  name: "Leading + trailing (placeholders)",
  args: {
    placeholder: "Input",
    showLeading: true,
    showTrailing: true,
    leadingSlot: <InputSlotPlaceholder />,
    trailingSlot: <InputSlotPlaceholder />,
  },
}

export const Disabled: Story = {
  args: {
    placeholder: "Disabled",
    disabled: true,
    showLeading: false,
    showTrailing: false,
  },
}

export const ReadOnly: Story = {
  args: {
    value: "Read-only value",
    readOnly: true,
    showLeading: false,
    showTrailing: false,
  },
}

export const Success: Story = {
  args: {
    placeholder: "Success",
    status: "success",
    defaultValue: "Valid value",
    showLeading: false,
    showTrailing: false,
  },
}

export const Warning: Story = {
  args: {
    placeholder: "Warning",
    status: "warning",
    defaultValue: "Check this",
    showLeading: false,
    showTrailing: false,
  },
}

export const Error: Story = {
  args: {
    placeholder: "Error",
    status: "error",
    defaultValue: "Invalid",
    showLeading: false,
    showTrailing: false,
  },
}

export const AriaInvalid: Story = {
  name: "aria-invalid (maps to error)",
  args: {
    placeholder: "Invalid",
    "aria-invalid": true,
    showLeading: false,
    showTrailing: false,
  },
}

export const ContentColor: Story = {
  name: "contentColor (text + slot icons)",
  args: {
    placeholder: "Custom tint",
    defaultValue: "Hello",
    contentColor: "var(--color-intent-accent)",
    showLeading: true,
    showTrailing: true,
    leadingSlot: <InputSlotPlaceholder />,
    trailingSlot: <InputSlotPlaceholder />,
  },
}
