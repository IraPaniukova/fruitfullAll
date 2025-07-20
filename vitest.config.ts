import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
// import { defineConfig } from "vitest/config";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   test: {
//     globals: true,
//     environment: "jsdom",
//     setupFiles: "./src/setupTests.ts",
//     alias: {
//       "react-redux": "react-redux/dist/cjs/index.js",
//     },
//     deps: {
//       inline: ["react-redux", "@reduxjs/toolkit"],
//     },
//   },
// });
