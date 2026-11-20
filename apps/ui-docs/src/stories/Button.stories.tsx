import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Button, type ButtonStateIcon } from "design-system"

const demoStripIcons: [ButtonStateIcon, ButtonStateIcon] = [
  { iconName: "moon", iconStyle: "fill" },
  { iconName: "sun", iconStyle: "outline" },
]

/** Tiny demo icons — `currentColor` so they follow button text color. */
function DemoDot() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="6" fill="currentColor" />
    </svg>
  )
}

function DemoChevron() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M9 6l6 6-6 6V6z"
      />
    </svg>
  )
}

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      table: { category: "Content" },
    },
    /**
     * ReactNode props are not editable in the Controls panel (Storybook has no control for trees).
     * They still appear under Docs → Props. Use the “With leading & trailing slots” story or JSX in code.
     */
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
    contentColor: { table: { category: "Appearance" } },
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "transparent"],
      table: { category: "Appearance" },
    },
    tint: {
      control: "select",
      options: ["default", "inverse"],
      table: { category: "Appearance" },
    },
    size: {
      control: "select",
      options: ["lg", "md", "sm"],
      table: { category: "Appearance" },
    },
    radius: {
      control: "select",
      options: [
        "none",
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "full",
      ],
      table: { category: "Appearance" },
    },
    fullWidth: {
      control: "boolean",
      table: { category: "Layout" },
    },
    href: { table: { category: "Link" } },
    target: { table: { category: "Link" } },
    rel: { table: { category: "Link" } },
    download: { table: { category: "Link" } },
    stateIcons: { control: false, table: { category: "Icon strip" } },
    stripActiveIndex: {
      control: "select",
      options: [0, 1],
      table: { category: "Icon strip" },
    },
    stripPlacement: {
      control: "select",
      options: ["start", "end"],
      table: { category: "Icon strip" },
    },
    hasFeedback: { table: { category: "Icon strip" } },
    respectReducedMotion: { table: { category: "Icon strip" } },
    stripIconSize: { table: { category: "Icon strip" } },
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: "Button",
    variant: "primary",
    size: "lg",
  },
}

export const WithLeadingAndTrailingSlots: Story = {
  name: "With leading & trailing slots",
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    leadingSlot: <DemoDot />,
    trailingSlot: <DemoChevron />,
  },
}

export const Secondary: Story = {
  args: {
    children: "Button",
    variant: "secondary",
    size: "lg",
  },
}

export const Tertiary: Story = {
  args: {
    children: "Button",
    variant: "tertiary",
    size: "lg",
  },
}

export const Transparent: Story = {
  args: {
    children: "Button",
    variant: "transparent",
    size: "lg",
  },
}

export const PrimaryInverse: Story = {
  args: {
    children: "Button",
    variant: "primary",
    tint: "inverse",
    size: "lg",
  },
  decorators: [
    (StoryEl) => (
      <div
        style={{
          padding: 24,
          background: "var(--color-gray-900)",
          borderRadius: 8,
        }}
      >
        <StoryEl />
      </div>
    ),
  ],
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button size="lg">Large</Button>
      <Button size="md">Medium</Button>
      <Button size="sm">Small</Button>
    </div>
  ),
}

export const AsLink: Story = {
  args: {
    children: "Docs",
    href: "https://example.com",
    target: "_blank",
    rel: "noopener noreferrer",
    variant: "transparent",
  },
}

export const ContentColor: Story = {
  args: {
    children: "Accent",
    variant: "tertiary",
    contentColor: "var(--color-intent-accent)",
  },
}

export const RadiusFull: Story = {
  args: {
    children: "Pill",
    variant: "primary",
    radius: "full",
  },
}

export const Disabled: Story = {
  args: {
    children: "Disabled",
    variant: "primary",
    disabled: true,
  },
}

export const WithAnimatedIconStrip: Story = {
  name: "With animated icon strip",
  args: {
    type: "button",
    variant: "transparent",
    size: "md",
    radius: "lg",
    "aria-label": "Demo strip",
    stateIcons: demoStripIcons,
    stripActiveIndex: 0,
    contentColor: "var(--color-main-tertiary)",
  },
}

export const AnimatedIconStripInteractive: Story = {
  name: "Animated icon strip (interactive)",
  render: function AnimatedIconStripInteractiveRender() {
    const [stripActiveIndex, setStripActiveIndex] = useState<0 | 1>(0)
    return (
      <Button
        type="button"
        variant="transparent"
        size="md"
        radius="lg"
        aria-label={stripActiveIndex === 0 ? "Show second" : "Show first"}
        onClick={() =>
          setStripActiveIndex((i) => (i === 0 ? 1 : 0))
        }
        stateIcons={demoStripIcons}
        stripActiveIndex={stripActiveIndex}
        contentColor="var(--color-main-tertiary)"
      />
    )
  },
}

export const Matrix: Story = {
  render: () => {
    const variants = [
      "primary",
      "secondary",
      "tertiary",
      "transparent",
    ] as const
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, auto)",
          gap: 12,
          alignItems: "center",
        }}
      >
        {variants.map((v) => (
          <Button key={v} variant={v} size="md">
            {v}
          </Button>
        ))}
      </div>
    )
  },
}
