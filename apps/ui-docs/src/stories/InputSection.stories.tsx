import type { Meta, StoryObj } from "@storybook/react"
import {
  InputSection,
  InputSectionSlotPlaceholder,
} from "design-system"

function DemoLeadIcon() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      aria-hidden
      className="ds-inputSection__leadIcon"
    >
      <circle cx="12" cy="12" r="6" fill="currentColor" />
    </svg>
  )
}

const meta: Meta<typeof InputSection> = {
  title: "InputSection",
  component: InputSection,
  tags: ["autodocs"],
  decorators: [
    (StoryEl) => (
      <div style={{ maxWidth: 480, width: "100%" }}>
        <StoryEl />
      </div>
    ),
  ],
  argTypes: {
    leadSlot: {
      control: false,
      table: {
        category: "Content",
        type: { summary: "ReactNode" },
      },
    },
    contentSlot: {
      control: false,
      table: {
        category: "Content",
        type: { summary: "ReactNode" },
      },
    },
    label: { table: { category: "Content" } },
    iconName: { table: { category: "CDN icon" } },
    iconStyle: {
      control: "select",
      options: ["outline", "fill"],
      table: { category: "CDN icon" },
    },
    cdnBaseUrl: { table: { category: "CDN icon" } },
    leadColor: { table: { category: "Appearance" } },
    showLabel: { table: { category: "Layout" } },
    showContentSlot: { table: { category: "Layout" } },
  },
}

export default meta

type Story = StoryObj<typeof InputSection>

/** Uses the default CDN (`design-system` package `someIconsCdnBaseUrl`). Requires network. */
export const WithCdnIcon: Story = {
  name: "With CDN icon",
  args: {
    label: "Section title",
    iconName: "formatting-pencil-alt",
    iconStyle: "outline",
  },
}

export const CdnIconFilled: Story = {
  name: "CDN icon (filled)",
  args: {
    label: "Filled style",
    iconName: "formatting-pencil-alt",
    iconStyle: "fill",
  },
}

export const WithLeadColor: Story = {
  args: {
    label: "Accent lead",
    iconName: "formatting-pencil-alt",
    leadColor: "var(--color-main-accent)",
  },
}

export const WithCustomLeadSlot: Story = {
  name: "With custom lead slot",
  args: {
    label: "Custom lead",
    leadSlot: <DemoLeadIcon />,
  },
}

export const WithCustomContent: Story = {
  args: {
    label: "Notes",
    iconName: "formatting-pencil-alt",
    contentSlot: (
      <textarea
        rows={4}
        placeholder="Type here…"
        style={{
          width: "100%",
          boxSizing: "border-box",
          resize: "vertical",
          padding: "var(--spacing-padding-3)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border-weak)",
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--size-3)",
        }}
      />
    ),
  },
}

export const LabelOnly: Story = {
  args: {
    label: "No icon",
    showLabel: true,
    iconName: undefined,
  },
}

export const WithoutContentSlot: Story = {
  args: {
    label: "Header row only",
    iconName: "formatting-pencil-alt",
    showContentSlot: false,
  },
}

export const WithoutLabel: Story = {
  args: {
    showLabel: false,
    showContentSlot: true,
    contentSlot: <InputSectionSlotPlaceholder />,
  },
}
