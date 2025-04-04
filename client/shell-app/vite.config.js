import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

/*
 * This configuration sets up a Vite project for a shell application using React.
 * It uses module federation to load remote micro-frontends dynamically.
 */
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shellApp",
      remotes: {
        userApp: "http://localhost:3001/assets/remoteEntry.js",
        communityApp: "http://localhost:3002/assets/remoteEntry.js",
      },
      shared: ["react", "react-dom", "@apollo/client", "graphql"],
    }),
  ],
});
