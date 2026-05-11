import type { Meta, StoryObj } from "@storybook/react"
import {
  Dropdown,
  DropdownLeadingSlotPlaceholder,
  DropdownPanelSlotPlaceholder,
  SomeIcon,
} from "design-system"

const slotIcon = (
  <SomeIcon
    iconName="formatting-pencil-alt"
    iconStyle="outline"
    iconSize="md"
    padding="2"
  />
)

const trailingChevron = (
  <SomeIcon
    iconName="arrow-down-triangle"
    iconStyle="fill"
    iconSize="md"
    padding="2"
  />
)

const meta: Meta<typeof Dropdown> = {
  title: "Dropdown",
  component: Dropdown,
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
    panelSlot: { control: false },
    status: { control: "select", options: ["default", "error"] },
  },
}

export default meta

type Story = StoryObj<typeof Dropdown>

export const Empty: Story = {
  name: "Empty (no leading)",
  args: {
    empty: true,
    children: "Dropdown",
    trailingSlot: trailingChevron,
  },
}

export const WithIcons: Story = {
  name: "Leading + trailing (SomeIcon)",
  args: {
    empty: false,
    children: "Dropdown",
    leadingSlot: slotIcon,
    trailingSlot: trailingChevron,
  },
}

export const WithPlaceholderSlots: Story = {
  name: "Slot placeholders",
  args: {
    empty: false,
    children: "Dropdown",
    showLeading: true,
    leadingSlot: <DropdownLeadingSlotPlaceholder />,
    trailingSlot: <DropdownLeadingSlotPlaceholder />,
  },
}

export const Error: Story = {
  args: {
    empty: false,
    status: "error",
    children: "Dropdown",
    leadingSlot: slotIcon,
    trailingSlot: trailingChevron,
  },
}

export const Disabled: Story = {
  args: {
    empty: false,
    disabled: true,
    children: "Dropdown",
    leadingSlot: slotIcon,
    trailingSlot: trailingChevron,
  },
}

export const Expanded: Story = {
  args: {
    empty: false,
    expanded: true,
    children: "Dropdown",
    leadingSlot: slotIcon,
    trailingSlot: trailingChevron,
    panelSlot: <DropdownPanelSlotPlaceholder />,
  },
}

export const FullWidth: Story = {
  args: {
    empty: false,
    fullWidth: true,
    children: "Dropdown",
    leadingSlot: slotIcon,
    trailingSlot: trailingChevron,
  },
}
