import type { Preview } from "@storybook/nextjs-vite";
import { DM_Sans } from "next/font/google";
import "../src/app/globals.css";

const dmsans = DM_Sans({
  variable: "--font-app",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    (Story) => {
      document.documentElement.classList.add(dmsans.variable);
      return Story();
    },
  ],
};

export default preview;
