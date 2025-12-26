/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

// Tailwind : 클래스 이름만으로 스타일링하는 CSS 프레임워크
// // content 에서 어떤 파일에서 Tailwind 사용할지 지정
// 색상 폰트 브레이크 포인트 커스터마이징 설정도 여기서 가능