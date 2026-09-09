import {defineConfig} from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => {
  return {
    base: '/Hisabx-/',
    plugins: [
      tailwindcss(),
    ],
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
