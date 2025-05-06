/**
 * @file vite.config.ts
 * @description Vite configuration file for the FitnessTracker3D project.
 * It defines build settings, plugins, and optimizations for both development and production environments.
 * @dependencies vite, @vitejs/plugin-react, path
 */

import { defineConfig, loadEnv, type ViteConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// eslint-disable-next-line no-console
console.log('Vite config loading...');

export default defineConfig((): ViteConfig => {
  const env = loadEnv('', process.cwd());

  if (
    !env.VITE_APP_TITLE ||
    !env.VITE_API_URL ||
    !env.VITE_MODEL_URL ||
    !env.VITE_TEXTURE_URL
  ) {
    throw new Error(
      'Missing required environment variables. Ensure VITE_APP_TITLE, VITE_API_URL, VITE_MODEL_URL, and VITE_TEXTURE_URL are defined in .env.',
    );
  }

  return {
    base: '/', // Set base URL to root
    build: {
      outDir: 'dist', // Output directory for production build
      minify: 'esbuild', // Use esbuild for minification
      sourcemap: process.env.NODE_ENV !== 'production',
      target: 'esnext',
    },
    server: {
      port: 5173, // Development server port
      hmr: true, // Enable hot module replacement
    },
    plugins: [react()], // Use the react plugin
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // Alias "@" to "./src" for easier imports
      },
    },
  };
});