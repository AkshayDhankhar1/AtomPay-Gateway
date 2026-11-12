import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default defineConfig([
  { ignores: ['**/dist/', '**/coverage/'] },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  // Plain JS config files are not part of the TS project, so type-aware rules can't run on them.
  { files: ['**/*.js'], extends: [tseslint.configs.disableTypeChecked] },
  prettier,
]);
