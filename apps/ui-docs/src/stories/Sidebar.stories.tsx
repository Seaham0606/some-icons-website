import type { Meta, StoryObj } from "@storybook/react"
import { Sidebar } from "design-system"

const sidebarFrameStyles = `
  .sb-sidebar-story {
    height: min(100dvh, 640px);
    display: flex;
    flex-direction: column;
  }
  .sb-sidebar-story aside.ds-sidebar {
    height: 100%;
    max-height: 100%;
  }
`

const meta: Meta<typeof Sidebar> = {
  title: "Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  decorators: [
    (StoryEl) => (
      <>
        <style>{sidebarFrameStyles}</style>
        <div className="sb-sidebar-story">
          <StoryEl />
        </div>
      </>
    ),
  ],
  argTypes: {
    children: {
      control: false,
      table: {
        category: "Content",
        type: { summary: "ReactNode" },
      },
    },
    pageName: {
      control: "text",
      table: { category: "Header" },
    },
    version: { table: { category: "Header" } },
    logo: {
      control: false,
      table: {
        category: "Header",
        type: { summary: "ReactNode" },
      },
    },
    themeButton: {
      control: false,
      table: {
        category: "Header",
        type: { summary: "ReactNode" },
      },
    },
    copyright: {
      control: "text",
      table: { category: "Footer" },
    },
    socialButtons: {
      control: false,
      table: {
        category: "Footer",
        type: { summary: "ReactNode" },
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Sidebar>

export const Default: Story = {
  args: {
    pageName: "Some Icons",
    version: "1.0.0",
    children: null,
  },
}

export const WithoutVersion: Story = {
  args: {
    pageName: "Page",
    version: undefined,
    children: null,
  },
}

export const CustomHeaderSlots: Story = {
  name: "Custom logo & theme",
  args: {
    pageName: "Dashboard",
    version: "2.4.0",
    logo: (
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: "var(--color-main-accent)",
          opacity: 0.85,
        }}
        aria-label="App logo"
      />
    ),
    themeButton: (
      <button
        type="button"
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          border: "1px solid var(--color-border-weak)",
          background: "var(--color-fill-background-elevation)",
          cursor: "pointer",
        }}
        aria-label="Toggle theme"
      />
    ),
    children: null,
  },
}

export const CustomFooter: Story = {
  args: {
    pageName: "Docs",
    copyright: "© 2025 Custom Org",
    socialButtons: (
      <div className="ds-sidebar__social">
        <a href="https://example.com" className="ds-sidebar__socialLink" style={{ fontSize: 12 }}>
          GitHub
        </a>
        <a href="https://example.com" className="ds-sidebar__socialLink" style={{ fontSize: 12 }}>
          X
        </a>
      </div>
    ),
    children: null,
  },
}
