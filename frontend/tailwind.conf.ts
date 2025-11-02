import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',

    ],
    theme: {
        extend: {
            colors: {
                // cores do megabite (dark)
                primary: {
                    50: '#262626',
                    100: '#1f1f1f', 
                    200: '#1a1a1a',
                    300: '#171717',
                    400: '#141414',
                    500: '#0f0f0f',  // Azul principal
                    600: '#0a0a0a',
                    700: '#050505',
                    800: '#000000',
                    900: '#000000',
                },

                //cores de destaque
                pink: {
                    500: "#ec4899", //principal
                    400: "#f472b6",
                    600: "#db2777",

                },
                purple: {
                    500: "#a855f7", //principal
                    400: "#c084fc",
                    600: "#9333ea",
                },
                green: {
                    500: "#10b981",
                    400: "#34d399",
                    600: "#059669",
                },
                orange: {
                    500: "#f97316",
                    400: "#fdba74",
                    600: "#ea580c",
                }
            },
            bg: {
                primary: '#2a2d45',
                secondary: '#35385c',
                tertiary: '#414470',
                card: '#2f3250',
                header: '#26293f',
            },
            text: {
                primary: '#f8fafc',
                secondary: '#cbd5e1',
                accent: '#ffffff',
            },
            backgroundImage: {
                'gradient-berry': 'linear-gradient(135deg, #ec4899, #a855f7)',
                'gradient-citurs': 'linear-gradient(135deg, #f97316, #10b981)',
                'gradient-mint': 'linear-gradient(135deg, #10b981, #3b82f6)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'dish': '12px',
            }
        },
    },
    plugins: [],
    darkMode: 'class',
}

export default config;