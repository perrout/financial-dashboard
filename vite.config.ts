import { resolve } from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@/components": resolve(__dirname, "./src/components"),
      "@/factories": resolve(__dirname, "./src/factories"),
      "@/languages": resolve(__dirname, "./src/languages"),
      "@/layouts": resolve(__dirname, "./src/layouts"),
      "@/mocks": resolve(__dirname, "./src/mocks"),
      "@/models": resolve(__dirname, "./src/models"),
      "@/pages": resolve(__dirname, "./src/pages"),
      "@/store": resolve(__dirname, "./src/store"),
      "@/utils": resolve(__dirname, "./src/utils"),
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
