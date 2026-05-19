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

const iconSizeOptions = [
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
] as const

const paddingOptions = ["0", "050", "1", "2"] as const

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
    iconSize: {
      control: "select",
      options: iconSizeOptions,
      description: "Glyph size — theme `--size-icon-*`.",
    },
    padding: {
      control: "select",
      options: paddingOptions,
      description:
        "Inset from theme `--spacing-*` (excludes `025`). Outer box = `2 × padding + iconSize`.",
    },
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
    iconName: "pencil-alt",
    iconStyle: "outline",
    iconSize: "md",
    padding: "0",
  },
}

export const Filled: Story = {
  render: (args) => (
    <IconFrame size={24}>
      <SomeIcon {...args} />
    </IconFrame>
  ),
  args: {
    iconName: "pencil-alt",
    iconStyle: "fill",
    iconSize: "md",
    padding: "0",
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
    color: "var(--color-intent-accent)",
    iconSize: "md",
    padding: "0",
  },
}

/** 40×40 frame: `icon-md` + `spacing-2` padding on each side. */
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
    iconSize: "md",
    padding: "2",
  },
}

/** Design-system `Input` leading/trailing slot: 40×40 outer, 24px glyph. */
export const InputSlot: Story = {
  name: "Input slot (md + padding 2)",
  render: (args) => (
    <div style={{ color: "var(--color-main-primary)" }}>
      <SomeIcon {...args} />
    </div>
  ),
  args: {
    iconName: "search",
    iconStyle: "outline",
    iconSize: "md",
    padding: "2",
  },
}

/** `InputSection` label-row leading/trailing: 12×12 glyph (`icon-2xs`), no inset. */
export const InputSectionLeading: Story = {
  name: "InputSection leading (2xs)",
  render: (args) => (
    <div style={{ color: "var(--color-main-primary)" }}>
      <SomeIcon {...args} />
    </div>
  ),
  args: {
    iconName: "pencil-alt",
    iconStyle: "outline",
    iconSize: "2xs",
    padding: "0",
  },
}
