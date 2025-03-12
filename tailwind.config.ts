import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        biomsSky: "#C3EBFA",
        biomsSkyLight: "#EDF9FD",
        biomsPurple: "#CFCEFF",
        biomsPurpleLight: "#F1F0FF",
        biomsYellow: "#FAE27C",
        biomsYellowLight: "#FEFCE8",
      },
    },
  },
  plugins: [],
};
export default config;
