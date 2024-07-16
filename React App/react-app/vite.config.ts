import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'config': path.resolve(__dirname, './src/config.js'),  // Ensure this alias is added
    },
  },
});
