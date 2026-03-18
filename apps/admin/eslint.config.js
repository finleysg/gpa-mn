import nextConfig from '@repo/eslint-config/next';
import tailwindCanonicalClasses from 'eslint-plugin-tailwind-canonical-classes';

export default [
  ...nextConfig,
  ...tailwindCanonicalClasses.configs['flat/recommended'],
  {
    rules: {
      'tailwind-canonical-classes/tailwind-canonical-classes': [
        'warn',
        {
          cssPath: './app/globals.css',
        },
      ],
    },
  },
];
