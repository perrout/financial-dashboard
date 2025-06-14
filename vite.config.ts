import { resolve } from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/financial-dashboard/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@/components": resolve(__dirname, "./src/components"),
      "@/factories": resolve(__dirname, "./src/factories"),
      "@/hooks": resolve(__dirname, "./src/hooks"),
      "@/languages": resolve(__dirname, "./src/languages"),
      "@/layouts": resolve(__dirname, "./src/layouts"),
      "@/mocks": resolve(__dirname, "./src/mocks"),
      "@/models": resolve(__dirname, "./src/models"),
      "@/pages": resolve(__dirname, "./src/pages"),
      "@/services": resolve(__dirname, "./src/services"),
      "@/store": resolve(__dirname, "./src/store"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          chart: ["chart.js", "react-chartjs-2"],
          ui: ["react-bootstrap", "bootstrap"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "zustand", "chart.js"],
  },
})
