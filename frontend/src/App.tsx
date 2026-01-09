// App.tsx
// React Router로 구성된 전체 앱의 루트 컴포넌트

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// BrowserRouter
// // HTML5 History API를 사용한 클라이언트 사이드 라우터. URL 변경 시 새로고침 없이 페이지 전환
// Routes
// // 여러 Route를 감싸는 컨테이너 React Router v6의 핵심 컴포넌트
// Route
// // 특정 경로(path - /login, /register 등)에 컴포넌트(element - LoginForm, RegisterForm 등)를 매핑
// Navigate
// // A component-based version of useNavigate to use in a React.Component class where hooks cannot be used (<Navigate to="/login" />)


// 각 페이지 tsx 파일(components 폴더) import
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@ export 없어도 되는 이유 @@@
// 여기서 명시적으로 export default function App() ... 를 하거나 함수 뒤에 export default App;를 추가하지 않아도
// ES6의 Default Export 규칙에 따라서 export default가 있다고 가정하고
// Vite/TypeScript가 자동으로 export default App으로 처리한다
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen min-w-screen bg-linear-to-br from-red-50 to-indigo-100 py-12 px-4">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// <BrowserRouter>
// // 최상위에 1개만 두는 모든 라우팅의 루트(root)

// <div className="min-h-screen ...">
// // 공통 레이아웃 설정
// // // min-h-screen: 화면 전체 높이 최소 보장
// // // bg-gradient-to-br from-blue-50 to-indigo-100: 배경 그라데이션
// // // py-12 px-4: 패딩 (상하 3rem, 좌우 1rem)

// <Routes>
// // 여러 Route를 감싸는 컨테이너

// <Route path="/login" element={<LoginForm />} />
// // http://localhost:5173/login을 하면
// // LoginForm 컴포넌트 렌더링

// <Route path="/register" element={<RegisterForm />} />
// // RegisterForm 컴포넌트 렌더링

// <Route
//   path="/dashboard"
//   element={
//     <ProtectedRoute>
//       <Dashboard />
//     </ProtectedRoute>
//   }
// />
// // 대시보드는 ProtectedRoute를 거치는 구조
// // // ProtectedRoute 컴포넌트 실행 -> /users/me API 호출 → 토큰 확인 
// // //                                                         ├─ 토큰 유효 -> <Dashboard /> 렌더링
// // //                                                         └─ 토큰 없음 -> <Navigate to="/login" />

// <Route path="/" element={<Navigate to="/dashboard" />} />
// // 루트 리다이렉트 -> 자동으로 dashboard 페이지로 이동

// <Route path="*" element={<Navigate to="/" />} />
// 이외의 모든 경로는 루트(/)로 리다이렉트

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// 전체 라우팅 흐름
// // 1. 앱 시작 -> /
// // 2. / -> /dashboard (리다이렉트)
// // 3. /dashboard -> ProtectedRoute 검사
// // ├─ 토큰 있음 -> Dashboard
// // └─ 토큰 없음 -> /login
// // 4. 로그인 성공 → useAuth.onSuccess → /dashboard
// // 5. 로그아웃 → useAuth.logout → /login
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

export default App;



// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
