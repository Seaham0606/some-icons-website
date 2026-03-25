import type { Meta, StoryObj } from "@storybook/react"
import {
  InputSection,
  InputSectionSlotPlaceholder,
  SomeIcon,
} from "design-system"

function DemoLeadIcon() {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 24 24"
      aria-hidden
      style={{ flexShrink: 0, color: "var(--color-main-primary)" }}
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
    leadColor: { table: { category: "Appearance" } },
    showLabel: { table: { category: "Layout" } },
    showContentSlot: { table: { category: "Layout" } },
  },
}

export default meta

type Story = StoryObj<typeof InputSection>

/** `SomeIcon` `iconSize="2xs"` matches the section label-row lead. Requires network. */
export const WithLeadIcon: Story = {
  name: "With SomeIcon lead (2xs)",
  args: {
    label: "Section title",
    leadSlot: (
      <SomeIcon
        iconName="formatting-pencil-alt"
        iconStyle="outline"
        iconSize="2xs"
      />
    ),
  },
}

export const LeadIconFilled: Story = {
  name: "SomeIcon lead (filled)",
  args: {
    label: "Filled style",
    leadSlot: (
      <SomeIcon
        iconName="formatting-pencil-alt"
        iconStyle="fill"
        iconSize="2xs"
      />
    ),
  },
}

export const WithLeadColor: Story = {
  args: {
    label: "Accent lead",
    leadSlot: (
      <SomeIcon
        iconName="formatting-pencil-alt"
        iconStyle="outline"
        iconSize="2xs"
      />
    ),
    leadColor: "var(--color-intent-accent)",
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
    leadSlot: (
      <SomeIcon
        iconName="formatting-pencil-alt"
        iconStyle="outline"
        iconSize="2xs"
      />
    ),
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
  },
}

export const WithoutContentSlot: Story = {
  args: {
    label: "Header row only",
    leadSlot: (
      <SomeIcon
        iconName="formatting-pencil-alt"
        iconStyle="outline"
        iconSize="2xs"
      />
    ),
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
