import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { ThemeButton } from "design-system"

const meta: Meta<typeof ThemeButton> = {
  title: "ThemeButton",
  component: ThemeButton,
  tags: ["autodocs"],
  argTypes: {
    mode: { control: "select", options: ["light", "dark"] },
    onToggle: { action: "toggle" },
  },
}

export default meta

type Story = StoryObj<typeof ThemeButton>

export const LightMode: Story = {
  args: {
    mode: "light",
    onToggle: () => {},
  },
}

export const DarkMode: Story = {
  args: {
    mode: "dark",
    onToggle: () => {},
  },
}

export const Interactive: Story = {
  render: function InteractiveRender() {
    const [mode, setMode] = useState<"light" | "dark">("light")
    return (
      <ThemeButton mode={mode} onToggle={() => setMode((m) => (m === "dark" ? "light" : "dark"))} />
    )
  },
}
