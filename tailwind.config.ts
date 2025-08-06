import type { Config } from 'tailwindcss'

const config: Config = {
  // 👇 Agrega o modifica esta línea
  darkMode: "class", // Le dice a Tailwind que use una clase para el modo oscuro

  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Aquí puedes extender tu tema si lo necesitas
    },
  },
  plugins: [],
}
export default config