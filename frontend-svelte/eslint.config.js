import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import sveltePlugin from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";

/** @type {import("eslint").Linter.Config[]} */
export default defineConfig([
  // 1. Global Ignores
  { ignores: ["**/dist/**", "**/node_modules/**", "**/.svelte-kit/**"] },

  // 2. Base Configuration for EVERYTHING
  { 
    files: ["**/*.{js,mjs,cjs,ts,svelte,svelte.ts}"],
    languageOptions: { 
      globals: {
        ...globals.node,
        ...globals.browser
      },
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      }
    }
  },
  
  // 3. Recommended Base Standards (including Svelte flat recommended config)
  ...tseslint.configs.recommended,
  pluginJs.configs.recommended,
  ...sveltePlugin.configs['flat/recommended'],

  // 4. Svelte Parser Setup (Tells ESLint to parse .svelte files and pass their <script> blocks to TypeScript)
  {
    files: ["**/*.svelte", "**/*.svelte.ts"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".svelte", ".svelte.ts"],
      },
    },
    rules: {
      "no-undef": "off", // Handled by TypeScript / Svelte compiler
      "no-unused-vars": "off",
      "no-case-declarations": "off",
      "no-redeclare": "off",
    },
  },

  // 5. Global Custom Rules (Stylistic, No-Restricted-Imports, TS Overrides)
  {
    plugins: {
      "@stylistic": stylistic
    },
    rules: {
      "@stylistic/semi-style": ["error", "last"],
      "@stylistic/semi": ["error", "always"],
      "semi": "off",
      "no-restricted-imports": [
        "error",
        {
          "patterns": [{
            "regex": "@/(api|helpers|stores)/([a-zA-Z-_]+)",
            "message": "Must import via index.ts when importing from the outside of the package."
          }]
        }
      ],
      "no-useless-assignment": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-case-declarations": "off",
      "@typescript-eslint/ban-ts-comment": "off"
    }
  }
]);
