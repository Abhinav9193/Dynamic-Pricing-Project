/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "white",
                foreground: "#0f172a",
                primary: {
                    DEFAULT: "#3b82f6",
                    dark: "#2563eb",
                },
                card: "white",
                border: "#e2e8f0",
            },
            borderRadius: {
                xl: "1rem",
                "2xl": "1.5rem",
            },
        },
    },
    plugins: [],
};
