import type { StorybookConfig } from "@storybook/react-vite";

const faviconLink = `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`;

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [],
  framework: "@storybook/react-vite",
  staticDirs: [
    { from: "../../icons/assets/images", to: "/brand" },
    { from: "../public", to: "/" },
  ],
  managerHead: (head) => `${head}${faviconLink}`,
  previewHead: (head) => `${head}${faviconLink}`,
};

export default config;
