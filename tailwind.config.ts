import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0B",
        coal: "#121214",
        seam: "rgba(237,235,230,0.08)",
        bone: "#EDEBE6",
        ash: "#8F8C85",
        tungsten: "#F2A33C",
        tungstendim: "#B87A2A",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "sans-serif"],
        body: ["var(--font-archivo)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        label: "0.22em",
      },
      maxWidth: {
        page: "82rem",
      },
    },
  },
  plugins: [],
};
export default config;
