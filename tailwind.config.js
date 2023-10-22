/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./src/screens/*.{js,jsx,ts,tsx}", 
    "./src/screens/**/*.{js,jsx,ts,tsx}",
    "./src/screens/AuthScreens/*.{js,jsx,ts,tsx}", 
    "./src/screens/CommonScreens/*.{js,jsx,ts,tsx}",
    "./src/screens/HostHomeScreens/*.{js,jsx,ts,tsx}",
    "./src/screens/TherapistScreens/*.{js,jsx,ts,tsx}",
    "./src/components/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}", 
    "./src/components/UIComponents/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

