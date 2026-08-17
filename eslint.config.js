import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";

/** @type {import("eslint").Linter.Config[]} */
export default defineConfig([
  // 1. Global Ignores
  { ignores: ["**/dist/**", "**/node_modules/**"] },

  // 2. Base Configuration for EVERYTHING
  { 
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
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
  
  // 3. Recommended Base Standards
  ...tseslint.configs.recommended,
  pluginJs.configs.recommended,

  // 4. Global Language Override for TS Files
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-undef": "off",
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
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-case-declarations": "off",
    }
  },

  // 6. ISOLATED FRONTEND REACT RULES
  // Spread the plugin's recommended config directly and bind it to your frontend files
  {
    ...pluginReact.configs.flat.recommended,
    files: ["frontend/**/*.{js,mjs,cjs,ts,jsx,tsx}"]
  },
  {
    files: ["frontend/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    }
  }
]);
