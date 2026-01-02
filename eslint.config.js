import js from '@eslint/js';
import globals from 'globals';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
        google: 'readonly', // Google Maps API
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
    },
    rules: {
      // ===== P0: Prohibir colores literales (no tokens shadcn) =====
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/\\b(text|bg|border|ring|from|to|via)-(black|white|gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(-\\d{2,3})?\\b/]',
          message: 'Hardcoded color classes are not allowed. Use Tailwind tokens (bg-background, text-foreground, border-border, text-muted-foreground, bg-accent, text-destructive, etc.) instead.',
        },
        {
          selector: 'Literal[value=/(#[0-9a-f]{3,6}|rgb\\(|hsl\\()/i]',
          message: 'Hardcoded color values (hex, rgb, hsl) are not allowed. Use CSS variables or Tailwind tokens instead.',
        },
      ],

      // ===== P0: Prohibir estilos inline =====
      'react/style-prop-object': 'error',

      // ===== P0: Prohibir imports de UI externas =====
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@mui/*', 'antd', '@chakra-ui/*', 'react-bootstrap', 'mantine'],
              message: 'External UI libraries are not allowed. Use shadcn/ui components from @/components/ui/* instead.',
            },
          ],
          paths: [
            {
              name: '@mui/material',
              message: 'MUI is not allowed. Use shadcn/ui instead.',
            },
            {
              name: 'antd',
              message: 'Ant Design is not allowed. Use shadcn/ui instead.',
            },
            {
              name: '@chakra-ui/react',
              message: 'Chakra UI is not allowed. Use shadcn/ui instead.',
            },
          ],
        },
      ],

      // ===== TypeScript =====
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // ===== React =====
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'warn',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-danger': 'warn',

      // ===== General =====
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-debugger': 'error',
      'no-undef': 'warn', // Globals are now properly defined
    },
  },

  // ===== Ignore patterns =====
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
      'coverage/**',
      '**/*.config.js',
      '**/*.config.ts',
      'vite.config.ts',
      'tailwind.config.ts',
    ],
  },
];
