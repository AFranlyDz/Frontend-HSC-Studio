import { fileURLToPath } from 'url'; // Cambiado de 'node:url'
import path from 'path'; // Cambiado de 'node:path'
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";

// Obtener __dirname equivalente en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "import": importPlugin,
    },
    settings: {
      "import/resolver": {
        node: true, // Habilita la resolución de módulos Node.js
        alias: {
          map: [
            ["@", path.resolve(__dirname, "./src")],
            ["@components", path.resolve(__dirname, "./src/components")],
            ["@pages", path.resolve(__dirname, "./src/pages")],
          ],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "import/no-unresolved": ["error", { ignore: ['^node:', '^@tailwindcss/vite'] }], // Ignora prefijos node:
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "no-undef": "error",
    },
  },
];