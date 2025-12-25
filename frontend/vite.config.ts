// vite.config.ts
//  Vite 개발 서버와 빌드 동작을 설정하는 파일
// // React 플러그인 등록 + API 프록시 설정

import { defineConfig } from 'vite'
// defineConfig
// // Vite 설정에 타입 지원(인텔리센스)을 주는 헬퍼 함수
// // // 단순히 객체를 export default { ... }로 내보내도 되지만, 
// // // defineConfig({ ... })를 쓰면 IDE가 server, plugins 등 옵션을 더 잘 인식
import react from '@vitejs/plugin-react'
// react
// // Vite용 React 플러그인

// https://vite.dev/config/
// Vite 설정
// export default defineConfig({
//   plugins: [react()],
// })

// Vite 설정 (Vite 프록시 사용하기)
export default defineConfig({
  // 플러그인 설정
  plugins: [react()],
  // Vite에 React 관련 기능을 추가
  // // .tsx 파일에서 JSX 사용 가능
  // // React Fast Refresh 지원 (코드 수정 시 상태 유지하면서 컴포넌트만 갱신)
  // // 일부 React 관련 최적화 자동 적용

  // server.proxy 설정 (프론트 -> 백엔드 터널)
  server: {
    proxy: {
      '/api': { // 프록시 대상 경로 설정 -> Axios 인스턴스의 baseURL값
        target: 'http://localhost:8000',  // 실제 백엔드 주소
        changeOrigin: true,  // Host 헤더 변경(localhost:5173 -> localhost:8000, CORS 우회)
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'), // '/api' → '/api/v1' 변환 (백엔드 구조 맞춤)
      },
    },
    // Vite 서버(localhost:5173)가 /api로 시작하는 요청을 받으면 
    // // ex: api.get('/users/me') -> GET http://localhost:5173/api/users/me
    // 해당 요청을 적절히 변환해 Vite 프록시가 백엔드로 전달한다
    // // ex: /api는 /api/v1으로 변경 후 Host 헤더 변경(changeOrigin: true) -> GET http://localhost:8000/api/v1/users/me
    // @@@ changeOrigin: true
    // @@@ @@@ 브라우저 입장에서는 localhost:5173(프론트 서버)로만 요청하므로, 다른 Origin으로 직접 요청하지 않는다
    // @@@ @@@ 프록시는 서버-서버 통신이라 CORS가 걸리지 않는다
  },
})
