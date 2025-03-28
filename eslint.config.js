// @ts-check
import { defineConfig } from "@debbl/eslint-config";

export default defineConfig({
  typescript: {
    overrides: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["motion/*"],
              message: "Please use the import from '~/lib/motion' instead.",
            },
          ],
        },
      ],
    },
  },
  react: {
    next: true,
    compiler: true,
  },
  tailwindcss: "prettier",
});
