import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { SomeIcon } from "design-system"

function IconFrame({
  size,
  children,
}: {
  size: number
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        color: "var(--color-main-primary)",
      }}
    >
      {children}
    </div>
  )
}

const meta: Meta<typeof SomeIcon> = {
  title: "SomeIcon",
  component: SomeIcon,
  tags: ["autodocs"],
  argTypes: {
    iconName: {
      control: "text",
      description: "Must match an `id` from the CDN `index.json`.",
    },
    iconStyle: {
      control: "select",
      options: ["outline", "fill"],
    },
    cdnBaseUrl: {
      control: "text",
      description: "Optional override; defaults to package `someIconsCdnBaseUrl`.",
    },
    color: { table: { category: "Appearance" } },
    className: { table: { category: "Appearance" } },
  },
}

export default meta

type Story = StoryObj<typeof SomeIcon>

/**
 * Fetches `index.json` + SVG from the default CDN. Requires network; shows nothing until loaded.
 */
export const Default: Story = {
  render: (args) => (
    <IconFrame size={24}>
      <SomeIcon {...args} />
    </IconFrame>
  ),
  args: {
    iconName: "formatting-pencil-alt",
    iconStyle: "outline",
  },
}

export const Filled: Story = {
  render: (args) => (
    <IconFrame size={24}>
      <SomeIcon {...args} />
    </IconFrame>
  ),
  args: {
    iconName: "formatting-pencil-alt",
    iconStyle: "fill",
  },
}

export const AccentColor: Story = {
  render: (args) => (
    <IconFrame size={24}>
      <SomeIcon {...args} />
    </IconFrame>
  ),
  args: {
    iconName: "arrow-up-out",
    iconStyle: "outline",
    color: "var(--color-main-accent)",
  },
}

export const LargerFrame: Story = {
  name: "Larger frame (40px)",
  render: (args) => (
    <IconFrame size={40}>
      <SomeIcon {...args} />
    </IconFrame>
  ),
  args: {
    iconName: "arrow-up-out",
    iconStyle: "outline",
  },
}
