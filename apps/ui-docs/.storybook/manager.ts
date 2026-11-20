import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

addons.setConfig({
  theme: create({
    brandTitle: "Some UI",
    brandImage: "/brand/logo-some-ui-full.svg",
  }),
});
