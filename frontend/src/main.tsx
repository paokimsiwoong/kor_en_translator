// main.tsx
// React 앱의 진입점(Entry Point)
// React + React Query + Router를 여기서 모두 연결
// // React = import React from 'react'; 
// // React Query = import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
// // Router = import App from './App';

import React from 'react';
// React 라이브러리 전체 import

import ReactDOM from 'react-dom/client';
// React 18의 API
// // createRoot로 Concurrent Features (Suspense, Transitions 등) 지원

import App from './App';
// App.tsx의 루트 컴포넌트 import

import './index.css';
// index.css에 Tailwind CSS 등 전역 스타일 적용

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// QueryClient
// // React Query의 전역 캐시 관리자
// QueryClientProvider
// // 앱 전체에서 useQuery, useMutation 사용 시 QueryClient에 접근 가능하게 함

// QueryClient 인스턴스 생성
const queryClient = new QueryClient(); // 필요할 경우 () 안에 옵션들을 입력해 세부 설정 가능
// // React Query의 중앙 데이터 저장소
// // // ex: 모든 useQuery(['me']) 결과 캐싱
// // useMutation 성공 시 자동 캐시 무효화
// // 네트워크 상태, 재시도 로직 등 전역 관리

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
// createRoot
// // Concurrent Root 생성
// document.getElementById('root')
// // index.html의 <div id="root"></div> 부분

// <React.StrictMode>
//   <QueryClientProvider client={queryClient}>
//     <App />
//   </QueryClientProvider>
// </React.StrictMode>
// // Provider 트리
// // // React.StrictMode (최상위)
// // // └── QueryClientProvider (React Query용)
// // //     └── App.tsx (라우터 + 페이지들)
// // //         ├── LoginForm (useAuth)
// // //         ├── RegisterForm (useAuth)
// // //         └── Dashboard (useQuery(['me']))

// <QueryClientProvider client={queryClient}>
// // useQuery, useMutation 훅들이 여기서 명시한 queryClient에 접근 가능


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// 전체 실행 흐름
// // 1. 브라우저 -> index.html 로드
// // 2. <script src="/src/main.tsx"></script> 실행
// // 3. main.tsx -> ReactDOM.createRoot('#root')
// // 4. Provider 트리 렌더링 -> App.tsx 호출
// // 5. App.tsx -> BrowserRouter -> Routes -> 현재 경로 컴포넌트
// // 6. LoginForm -> useAuth -> authApi.post('/auth/login')
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
