import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18201f",
        mist: "#eef4f1",
        moss: "#59736b",
        jade: "#2f9b7c",
        coral: "#dc6f61",
        blush: "#f6ddd7",
        cream: "#fbfaf7"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(24, 32, 31, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
