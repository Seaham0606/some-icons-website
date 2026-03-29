import type { Meta, StoryObj } from "@storybook/react"
import { Chip } from "design-system"

const meta: Meta<typeof Chip> = {
  title: "Chip",
  component: Chip,
  tags: ["autodocs"],
  args: {
    children: "Label",
    variant: "neutral",
    backdropBlur: false,
  },
}

export default meta

type Story = StoryObj<typeof Chip>

export const Neutral: Story = {
  args: { variant: "neutral", children: "Neutral" },
}

export const Accent: Story = {
  args: { variant: "accent", children: "Accent" },
}

export const Success: Story = {
  args: { variant: "success", children: "Success" },
}

export const Warning: Story = {
  args: { variant: "warning", children: "Warning" },
}

export const Error: Story = {
  args: { variant: "error", children: "Error" },
}

export const Inverse: Story = {
  args: { variant: "inverse", children: "Inverse" },
  decorators: [
    (StoryEl) => (
      <div
        style={{
          padding: 24,
          background: "var(--color-background-base)",
        }}
      >
        <StoryEl />
      </div>
    ),
  ],
}

export const WithBackdropBlur: Story = {
  name: "Backdrop blur",
  args: {
    variant: "neutral",
    children: "1.2.3",
    backdropBlur: true,
  },
  decorators: [
    (StoryEl) => (
      <div
        style={{
          padding: 24,
          background:
            "linear-gradient(135deg, var(--color-intent-accent) 0%, var(--color-intent-success) 100%)",
        }}
      >
        <StoryEl />
      </div>
    ),
  ],
}
