import { defineConfig, loadEnv } from 'vite';
import envCompatible from 'vite-plugin-env-compatible';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const apiUrl = env.VITE_API_URL || 'http://localhost:3001/api';

  return {
    plugins: [react(), envCompatible()],
    envPrefix: 'VITE_',
    root: '.',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
      },
    },
    server: {
      'port': env.VITE_PORT || 3000,
      'open': true,
      'proxy': {
        '/graphql': {
          target: `${apiUrl}/graphql`,
          secure: false,
          changeOrigin: true,
        },
      },
      '/api': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true,
      },
    },
    base: env.VITE_PUBLIC_PATH || '/',
    // preview: {
    //   viewport: {
    //     width: 'device-width',
    //     initialScale: 1,
    //     maximumScale: 1,
    //     userScalable: false,
    //   },
    // },
  };
});
