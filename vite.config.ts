import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = env.PORT ? +JSON.stringify(env.PORT).replace(/"/g, '') : 3000;

  return {
    // vite config
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@components': path.resolve(__dirname, './src/components'),
      },
    },
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      port: 5173,
      watch: {
        usePolling: true,
      },
    },
    preview: {
      port,
      host: true,
    },
  };
});
