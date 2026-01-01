// LoginForm.tsx
// 로그인 페이지 UI 및 관련 데이터 관리
// React: 상태 + 이벤트 처리
// Tailwind: 픽셀 퍼펙트 UI
// React Query: 서버 통신 + 로딩/에러 상태

import { useState } from 'react';
// useState
// // React 상태 훅 -> form 데이터 관리
import { useAuth } from '../hooks/useAuth';
// useAuth 
// // 로그인 로직(login.mutate) + 상태(isPending, error) 제공
import { Mail, Lock, Loader2 } from 'lucide-react';
// Mail, Lock
// // 아이콘 컴포넌트
// // 입력란 옆에 표시
// Loader2 
// // 로딩 스피너
// // isPending일 때 표시

import { Link } from 'react-router-dom';
// Link
// // 회원 가입 페이지 연결에 필요

import type { LoginForm } from '../services/api';
// LoginForm
// TypeScript Generic(<>) 설정에 사용

import { type AxiosError } from 'axios';
// @@@ ESLint가 as any를 사용 금지 -> error as any 부분 수정에 AxiosError 사용

// LoginForm 컴포넌트 선언
export default function LoginForm() {
  // const [form, setForm] = useState({ username: '', password: '' });
  const [form, setForm] = useState<LoginForm>({ username: '', password: '' }); // <LoginForm>로 이 상태는 LoginForm 타입이라고 명시
  // 폼 데이터 초기화, 이후 사용자 입력을 여기에 저장
  const { login, isPending, error, isError } = useAuth();
  // Destructuring(구조 분해 할당 - 여러 필드를 가진 객체를 분해해 필드들 여러개로 할당) : useAuth의 반환값 중 필요한 것들만 받아서 사용하고 나머지 무시
  // login.mutate()로 요청, isPending으로 로딩 상태 받음

  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  // 아이디, 비밀번호 입력 부분의 input 블록 onChange 중복 코드 DRY 위반 해결
  // @@@ 여기서 e.target.name, e.target.value로 사용되는 블록의 name과 value 속성을 사용하므로
  // @@@ onChange={handleChange} 를 사용하기 위해서는
  // @@@ 반드시 name, value 속성이 있어야 한다
  // @@@ @@@ name="username" 으로 name 속성이 없을 경우 e.target.name이 undefined가 되어
  // @@@ @@@ 입력된 value가 username에 저장되지 않고 undefined에 저장된다
  // @@@ @@@ @@@ { username: '', password: '' }이 { username: '', password: '', undefined: 'a' } 와 같이 변경
  // @@@ @@@ 따라서 form의 username 자체는 변화가 없으므로 화면에 변화가 없다
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // <form>의 기본 동작(전체 페이지 새로고침)을 막는다
    login.mutate(form); 
    // login.mutate(form)으로 로그인 요청
    // // React Query가 백엔드 /auth/login으로 요청 전송
    // // 성공 시 localStorage 저장 + /dashboard 이동은 useAuth.onSuccess에서 처리
  };

  // JSX 반환 (UI 부분)
  return (
    <div className="min-h-screen min-w-screen p-8">
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">로그인</h1>
          <p className="text-gray-500 mt-2">계정이 있으신가요?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                // @@@ onChange={handleChange} 를 사용하기 위해서
                // @@@ 반드시 name, value 속성이 있어야 한다
                name="username"
                type="text"
                value={form.username}
                // onChange={(e) => setForm({ ...form, username: e.target.value })}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                // @@@ onChange={handleChange} 를 사용하기 위해서
                // @@@ 반드시 name, value 속성이 있어야 한다
                name="password"
                type="password"
                value={form.password}
                // onChange={(e) => setForm({ ...form, password: e.target.value })}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>로그인 중...</span>
              </>
            ) : (
              <span>로그인</span>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          계정이 없으신가요?{' '}
          <Link 
            to="/register" 
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            회원가입
          </Link>
        </p>

        {isError && error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              {/* {(error as any)?.response?.data?.detail || error.message || '로그인에 실패했습니다.'} */}
              {(error as AxiosError<{ detail: string }>)?.response?.data?.detail || error.message || '로그인에 실패했습니다.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
// // Tailwind CSS 클래스들로 공통 레이아웃 설정
// // // max-w-md: 최대 너비 448px (카드 크기 제한)
// // // mx-auto: 좌우 중앙 정렬
// // // p-8: 안쪽 여백 2rem
// // // bg-white rounded-xl shadow-lg: 흰색 배경 + 둥근 모서리 + 그림자

// 제목 영역 (위의 공통 레이아웃 설정 시 생성한 div의 하위트리)
// <div className="text-center mb-8">
// // text-center: 중앙 정렬 설정, mb-8: 아래쪽 여백 2rem
//   <h1 className="text-3xl font-bold text-gray-900">로그인</h1>
// // 큰 제목(h1)
//   <p className="text-gray-500 mt-2">계정이 있으신가요?</p>
// // 부제목
// </div>
// // 제목 영역 div 종료

// form 영역
// // 입력란 + 버튼 + Tailwind CSS + React 상태 연동
// <form onSubmit={handleSubmit} className="space-y-6">
// // onSubmit={handleSubmit}
// // // 엔터키 또는 버튼 클릭 시 handleSubmit 함수 실행
// // className="space-y-6"
// // // Tailwind CSS -> 자식 요소들 사이에 상하 여백 1.5rem(24px) 자동 추가

//   사용자명 입력란
//   <div>

//     레이블 설정
//     <label className="block text-sm font-medium text-gray-700 mb-2">
// //  block: 블록 요소로 전체 너비 차지
// //  text-sm: 폰트 크기 작게 (14px)
// //  mb-2: 아래쪽 여백 0.5rem
//       이메일 또는 사용자명
//     </label> 레이블 종료

//     아이디 입력란 + Mail 아이콘 영역 (relative + absolute 레이아웃)
//     <div className="relative">

//       Mail 아이콘 설정
//       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

//       아이디 입력
//       <input
//         type="text"
//         value={form.username} // React 상태와 동기화(Controlled Input: React 상태가 input 값 제어)
//         onChange={(e) => setForm({ ...form, username: e.target.value })} // 입력 이벤트 시 설정(입력 시마다 form.username 실시간 업데이트)
//         className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //         pl-11로 왼쪽 패딩 2.75rem (아이콘 공간 확보)
// //         focus:ring-2 focus:ring-blue-500 - 포커스 시 파란색 링 효과
//         required
// //      HTML5 유효성 검사 --> 빈칸 불가로 만들어주는 설정
//       />
// // ┌─ relative 컨테이너 (위치 기준점)
// // │
// // ├─ Mail 아이콘 (absolute 위치)
// // │   ├── absolute: 부모 relative 기준으로 절대 위치
// // │   ├── left-3: 왼쪽에서 0.75rem 떨어짐
// // │   ├── top-1/2: 세로 중앙 (50%)
// // │   └── -translate-y-1/2: 정확히 수직 중앙 정렬
// // │
// // └─ input (일반 흐름, 아이콘과 겹침)
//     </div> 입력란 + Mail 아이콘 영역 종료
//   </div> 사용자명 입력란 종료

//   비밀번호 입력란   
//   <div>

//     레이블 설정
//     <label className="block text-sm font-medium text-gray-700 mb-2">
//       비밀번호
//     </label>

//     비밀번호 입력란 + Lock 아이콘 영역 (relative + absolute 레이아웃)
//     <div className="relative">

//       Lock 아이콘 설정
//       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

//       비밀번호 입력
//       <input
//         type="password" // 아이디의 type text와 다르게 마스킹 표시됨
//         value={form.password}
//         onChange={(e) => setForm({ ...form, password: e.target.value })}
//         className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         required
//       />
//     </div> 비밀번호 입력란 + Lock 아이콘 영역 종료
//   </div> 비밀번호 입력란 종료

//   로그인 버튼 
//   <button
//     type="submit" //  form의 submit 버튼
//     disabled={isPending} // 로딩중 비활성화
//     className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//   >
// //  w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium: 전체 너비, 파란 배경, 흰 글씨, 둥근 버튼
// //  hover:bg-blue-700: 마우스 올리면 색상 어두워짐
// //  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2: 탭키로 포커스 시 파란 링
// //  disabled:opacity-50 disabled:cursor-not-allowed: disabled=true 시 반투명 + 금지 커서
// //  flex items-center justify-center space-x-2: 수평 중앙 + 아이콘/텍스트 좌우 여백

//     조건부 렌더링 부분
//     {isPending ? (
//       <>
//         <Loader2 className="w-5 h-5 animate-spin" /> // 스피너
//         <span>로그인 중...</span>
//       </>
// //  isPending true → 스피너 + "로그인 중..."
//     ) : (
//       <span>로그인</span>
//     )}
// //  false → "로그인" 텍스트만 표시

//   </button> 로그인 버튼 종료
// </form> form 영역 종료

// 회원가입 페이지 연결 링크
// <p className="mt-6 text-center text-sm text-gray-600">
//   계정이 없으신가요?{' '}
//   <Link 
//     to="/register" 
//     className="font-medium text-blue-600 hover:text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
//   >
//     회원가입
//   </Link>
// </p>

// 에러메시지 처리
// {isError && error && ( 
// // isError && error: React Query 에러 상태 표시
//   <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//     <p className="text-sm text-red-800">
//       {(error as any)?.response?.data?.detail || error.message || '로그인에 실패했습니다.'}
// //    (error as any)?.response?.data?.detail: FastAPI 422 에러 메시지 표시
//     </p>
//   </div>
// )}

// </div> 루트 div 종료

