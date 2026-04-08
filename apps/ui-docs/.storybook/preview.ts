import type { Preview } from "@storybook/react-vite";
import { initDesignSystemScrollbarVisibility } from "design-system";
import "../src/storybook-preview.css";

initDesignSystemScrollbarVisibility();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;