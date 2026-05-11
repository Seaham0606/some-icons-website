import type { Meta, StoryObj } from "@storybook/react"
import { Checkbox } from "design-system"

const meta: Meta<typeof Checkbox> = {
  title: "Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    defaultChecked: false,
    disabled: false,
  },
}

export default meta

type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {},
}

export const WithLabel: Story = {
  args: {
    children: "Remember me",
  },
}

export const Checked: Story = {
  args: {
    defaultChecked: true,
    children: "Checked",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
}

export const Row: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 24,
        alignItems: "center",
      }}
    >
      <Checkbox aria-label="Unchecked" />
      <Checkbox defaultChecked aria-label="Checked" />
      <Checkbox disabled aria-label="Disabled unchecked" />
      <Checkbox defaultChecked disabled aria-label="Disabled checked" />
    </div>
  ),
}
