// tailwind.config.js
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",  // 이게 꼭 있어야 Tailwind가 작동함
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  