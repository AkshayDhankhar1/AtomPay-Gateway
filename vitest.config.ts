import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // shortcut: no packages exist until Day 2 (money); drop this once real tests land.
    passWithNoTests: true,
  },
});
