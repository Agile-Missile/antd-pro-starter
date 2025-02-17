import { defineConfig, reactjs } from "@hyperse/eslint-config-hyperse";

export default defineConfig(
  [
    ...reactjs,
    {
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "tailwindcss/no-custom-classname": "off",
        "sonarjs/no-duplicate-string": "off",
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-unsafe-function-type": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-empty-object-type": "off",
        "@typescript-eslint/no-unnecessary-type-constraint": "off",
      },
    },
  ],
  ["mocks/**", "src/.umi/**"]
);
