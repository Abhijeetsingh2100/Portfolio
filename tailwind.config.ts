import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 40px rgba(56, 247, 211, 0.25)",
        glowStrong: "0 0 80px rgba(56, 247, 211, 0.35)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -14px, 0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        scan: {
          "0%": { transform: "translateY(-120%)" },
          "100%": { transform: "translateY(120%)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        shimmer: "shimmer 8s linear infinite",
        scan: "scan 4s linear infinite",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(circle at top, rgba(45, 212, 191, 0.18), transparent 45%)",
      },
    },
  },
  plugins: [],
};

export default config;
