import ClientStyleguideBiasc from "@getcommunity/client-styleguides/biasc"
import ClientStyleguideBrandywine from "@getcommunity/client-styleguides/brandywine"
import ClientStyleguideGetcommunity from "@getcommunity/client-styleguides/getcommunity"
import ClientStyleguideOlsonhomes from "@getcommunity/client-styleguides/olsonhomes"
import ClientStyleguidePacificcommunities from "@getcommunity/client-styleguides/pacificcommunities"
import ClientStyleguideSheahomes from "@getcommunity/client-styleguides/sheahomes"
import ClientStyleguideSocialBrands from "@getcommunity/client-styleguides/social-brands"
import ClientStyleguideTollbrothers from "@getcommunity/client-styleguides/tollbrothers"
import ClientStyleguideTrumark from "@getcommunity/client-styleguides/trumark"
import ClientStyleguideVandaele from "@getcommunity/client-styleguides/vandaele"
import ClientStyleguideWpg from "@getcommunity/client-styleguides/wpg"
import kobalteTailwind from "@kobalte/tailwindcss"
import tailwindcssTypography from "@tailwindcss/typography"
import defaultTheme from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
export default {
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "0rem",
      screens: {
        "2xl": "1440px",
        "3xl": "1920px",
        "4xl": "2160px"
      }
    },
    screens: {
      ...defaultTheme.screens,
      micro: "1px",
      "2xs": "320px",
      xs: "480px",
      "2xl": "1440px",
      "3xl": "1920px",
      "4xl": "2160px"
    },
    extend: {
      fontFamily: {
        sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
        serif: ["Playfair Display", ...defaultTheme.fontFamily.serif]
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))"
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))"
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))"
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" }
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--kb-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--kb-accordion-content-height)" },
          to: { height: 0 }
        },
        "content-show": {
          from: { opacity: 0, transform: "scale(0.96)" },
          to: { opacity: 1, transform: "scale(1)" }
        },
        "content-hide": {
          from: { opacity: 1, transform: "scale(1)" },
          to: { opacity: 0, transform: "scale(0.96)" }
        },
        "caret-blink": { "0%,70%,100%": { opacity: "1" }, "20%,50%": { opacity: "0" } }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "content-show": "content-show 0.2s ease-out",
        "content-hide": "content-hide 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite"
      },
      aspectRatio: {
        "video-vertical": "9 / 16",
        "datastudio-report": "16 / 10",
        "lookerstudio-report": "16 / 10"
      }
    }
  },
  plugins: [
    kobalteTailwind,
    tailwindcssTypography(),
    ClientStyleguideBiasc,
    ClientStyleguideBrandywine,
    ClientStyleguideGetcommunity,
    ClientStyleguideOlsonhomes,
    ClientStyleguidePacificcommunities,
    ClientStyleguideSheahomes,
    ClientStyleguideSocialBrands,
    ClientStyleguideTollbrothers,
    ClientStyleguideTrumark,
    ClientStyleguideVandaele,
    ClientStyleguideWpg
  ]
}
