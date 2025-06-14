import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { resolve } from "node:path"

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/tests/",
        "**/*.d.ts",
        "**/*.config.*",
        "dist/",
      ],
    },
  },
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
})
