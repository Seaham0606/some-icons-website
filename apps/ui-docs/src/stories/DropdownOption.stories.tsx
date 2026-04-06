import type { Meta, StoryObj } from "@storybook/react"
import { Checkbox, DropdownMenu, DropdownOption, SomeIcon } from "design-system"
import { useState } from "react"

const meta: Meta<typeof DropdownOption> = {
  title: "DropdownOption",
  component: DropdownOption,
  tags: ["autodocs"],
  decorators: [
    (StoryEl) => (
      <div style={{ width: 280, padding: 16, background: "var(--color-background-base)" }}>
        <DropdownMenu>
          <StoryEl />
        </DropdownMenu>
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof DropdownOption>

export const Default: Story = {
  args: {
    leadingSlot: (
      <SomeIcon
        iconName="interface-cursor"
        iconStyle="outline"
        iconSize="sm"
        padding="050"
      />
    ),
    children: "dropdown",
    onClick: () => undefined,
  },
}

export const WithCheckbox: Story = {
  render: function WithCheckboxStory() {
    const [on, setOn] = useState(false)
    return (
      <DropdownOption
        leadingSlot={
          <SomeIcon
            iconName="interface-cursor"
            iconStyle="outline"
            iconSize="sm"
            padding="050"
          />
        }
        onClick={() => setOn((v) => !v)}
        trailingSlot={
          <Checkbox checked={on} onChange={(e) => setOn(e.target.checked)} aria-label="Selected" />
        }
      >
        dropdown
      </DropdownOption>
    )
  },
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
}

export const Selected: Story = {
  args: {
    ...Default.args,
    selected: true,
  },
}
