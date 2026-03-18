import reactInternalConfig from '@repo/eslint-config/react-internal';
import tailwindCanonicalClasses from 'eslint-plugin-tailwind-canonical-classes';

export default [
  ...reactInternalConfig,
  ...tailwindCanonicalClasses.configs['flat/recommended'],
  {
    rules: {
      'tailwind-canonical-classes/tailwind-canonical-classes': [
        'warn',
        {
          cssPath: '../../apps/web/app/globals.css',
        },
      ],
    },
  },
];
