import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const publicEnv = Object.fromEntries(
    Object.entries(env).filter(([key]) => key.startsWith('VITE_')),
  );

  return {
  plugins: [react()],
  define: {
    __APP_ENV__: JSON.stringify(publicEnv),
  },
  server: {
    port: 3000,
  },
  };
})
