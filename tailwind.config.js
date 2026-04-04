module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"],
        body: ['"Inter"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      colors: {
        background: "hsl(220, 15%, 10%)",
        foreground: "hsl(0, 0%, 100%)",
        border: "hsl(220, 10%, 30%)",
        "border-subtle": "hsl(220, 10%, 25%)",
        primary: {
          DEFAULT: "hsl(220, 85%, 45%)",
          foreground: "hsl(0, 0%, 100%)",
          hover: "hsl(220, 85%, 40%)",
          active: "hsl(220, 85%, 35%)",
        },
        secondary: {
          DEFAULT: "hsl(220, 60%, 30%)",
          foreground: "hsl(0, 0%, 100%)",
          hover: "hsl(220, 60%, 35%)",
          active: "hsl(220, 60%, 25%)",
        },
        tertiary: {
          DEFAULT: "hsl(192, 90%, 40%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        accent: {
          DEFAULT: "hsl(295, 80%, 55%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        cyan: {
          DEFAULT: "hsl(195, 100%, 65%)",
          dim: "hsl(195, 100%, 20%)",
        },
        card: {
          DEFAULT: "hsl(220, 15%, 12%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        muted: {
          DEFAULT: "hsl(220, 10%, 20%)",
          foreground: "hsl(210, 8%, 65%)",
        },
        success: {
          DEFAULT: "hsl(140, 60%, 45%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        warning: {
          DEFAULT: "hsl(38, 100%, 60%)",
          foreground: "hsl(0, 0%, 0%)",
        },
        error: {
          DEFAULT: "hsl(350, 80%, 50%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        info: {
          DEFAULT: "hsl(200, 85%, 55%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        neutral: {
          50: "hsl(210, 10%, 98%)",
          100: "hsl(210, 9%, 90%)",
          200: "hsl(210, 8%, 80%)",
          300: "hsl(210, 8%, 65%)",
          400: "hsl(210, 7%, 55%)",
          500: "hsl(210, 7%, 45%)",
          600: "hsl(210, 7%, 35%)",
          700: "hsl(210, 8%, 25%)",
          800: "hsl(210, 10%, 15%)",
          900: "hsl(210, 12%, 8%)",
        },
        input: "hsl(220, 15%, 12%)",
        ring: "hsl(195, 100%, 65%)",
        popover: {
          DEFAULT: "hsl(220, 15%, 12%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        destructive: {
          DEFAULT: "hsl(350, 80%, 50%)",
          foreground: "hsl(0, 0%, 100%)",
        },
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, hsl(220, 85%, 45%) 0%, hsl(192, 90%, 40%) 100%)",
        "gradient-secondary":
          "linear-gradient(135deg, hsl(220, 60%, 30%) 0%, hsl(192, 50%, 25%) 100%)",
        "gradient-accent":
          "linear-gradient(135deg, hsl(295, 80%, 55%) 0%, hsl(220, 80%, 55%) 100%)",
        "gradient-hero":
          "linear-gradient(135deg, hsl(220, 85%, 45%) 0%, hsl(192, 90%, 40%) 50%, hsl(295, 80%, 55%) 100%)",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "8px",
        lg: "16px",
        full: "9999px",
      },
      fontSize: {
        h1: [
          "40px",
          { lineHeight: "1.2", fontWeight: "500", letterSpacing: "-0.025em" },
        ],
        h2: [
          "32px",
          { lineHeight: "1.2", fontWeight: "500", letterSpacing: "-0.025em" },
        ],
        h3: ["24px", { lineHeight: "1.3", fontWeight: "400" }],
        h4: ["20px", { lineHeight: "1.3", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "1.5", fontWeight: "400" }],
        body: ["16px", { lineHeight: "1.5", fontWeight: "300" }],
        "body-sm": ["14px", { lineHeight: "1.5", fontWeight: "300" }],
        caption: ["12px", { lineHeight: "1.4", fontWeight: "300" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-out",
        "slide-up": "slideUp 250ms ease-out",
        "slide-down": "slideDown 250ms ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "count-up": "countUp 1s ease-out",
        skeleton: "skeleton 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(195, 100%, 65% / 0.4)" },
          "50%": { boxShadow: "0 0 0 8px hsl(195, 100%, 65% / 0)" },
        },
        skeleton: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
