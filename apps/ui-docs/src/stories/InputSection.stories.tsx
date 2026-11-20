import type { Meta, StoryObj } from "@storybook/react"
import {
  InputSection,
  InputSectionSlotPlaceholder,
  SomeIcon,
} from "design-system"

function DemoLeadingIcon() {
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
    leadingSlot: {
      control: false,
      table: {
        category: "Content",
        type: { summary: "ReactNode" },
      },
    },
    trailingSlot: {
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
    leadingColor: { table: { category: "Appearance" } },
    trailingColor: { table: { category: "Appearance" } },
    showLabel: { table: { category: "Layout" } },
    hasContentSlot: { table: { category: "Layout" } },
    collapsible: { table: { category: "Layout" } },
    expanded: { table: { category: "Layout" } },
    defaultExpanded: { table: { category: "Layout" } },
    onExpandedChange: { control: false, table: { category: "Layout" } },
  },
}

export default meta

type Story = StoryObj<typeof InputSection>

/** `SomeIcon` `iconSize="2xs"` matches the section label-row slots. Requires network. */
export const WithLeadingIcon: Story = {
  name: "With SomeIcon leading (2xs)",
  args: {
    label: "Section title",
    leadingSlot: (
      <SomeIcon
        iconName="pencil-alt"
        iconStyle="outline"
        iconSize="2xs"
      />
    ),
  },
}

export const LeadingIconFilled: Story = {
  name: "SomeIcon leading (filled)",
  args: {
    label: "Filled style",
    leadingSlot: (
      <SomeIcon
        iconName="pencil-alt"
        iconStyle="fill"
        iconSize="2xs"
      />
    ),
  },
}

export const WithLeadingAndTrailing: Story = {
  name: "Leading + trailing (2xs)",
  args: {
    label: "Section title",
    leadingSlot: (
      <SomeIcon
        iconName="pencil-alt"
        iconStyle="outline"
        iconSize="2xs"
      />
    ),
    trailingSlot: (
      <SomeIcon
        iconName="search"
        iconStyle="outline"
        iconSize="2xs"
      />
    ),
  },
}

export const WithLeadingColor: Story = {
  args: {
    label: "Accent leading",
    leadingSlot: (
      <SomeIcon
        iconName="pencil-alt"
        iconStyle="outline"
        iconSize="2xs"
      />
    ),
    leadingColor: "var(--color-intent-accent)",
  },
}

export const WithCustomLeadingSlot: Story = {
  name: "With custom leading slot",
  args: {
    label: "Custom leading",
    leadingSlot: <DemoLeadingIcon />,
  },
}

export const WithCustomContent: Story = {
  args: {
    label: "Notes",
    leadingSlot: (
      <SomeIcon
        iconName="pencil-alt"
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
    leadingSlot: (
      <SomeIcon
        iconName="pencil-alt"
        iconStyle="outline"
        iconSize="2xs"
      />
    ),
    hasContentSlot: false,
  },
}

export const WithoutLabel: Story = {
  args: {
    showLabel: false,
    hasContentSlot: true,
    contentSlot: <InputSectionSlotPlaceholder />,
  },
}

/** Expand/collapse trailing control fades in while the pointer is inside the section (pointer enter/leave on shell). Requires network. */
export const Collapsible: Story = {
  args: {
    label: "Collapsible section",
    collapsible: true,
    defaultExpanded: true,
    leadingSlot: (
      <SomeIcon
        iconName="pencil-alt"
        iconStyle="outline"
        iconSize="2xs"
      />
    ),
    contentSlot: (
      <p style={{ margin: 0, color: "var(--color-main-secondary)" }}>
        Body content is hidden when collapsed.
      </p>
    ),
  },
}
