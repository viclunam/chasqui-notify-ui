import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/chasqui-notify-exams-ui/',
  plugins: [react()]
})
